import mongoose from "mongoose";
import Node from "../models/Node.js";

export async function createNode({ name, parentId = null }) {
    if (!name?.trim()) {
        const err = new Error("Name is required");
        err.statusCode = 400;
        throw err;
    }

    if (parentId) {
        if (!mongoose.Types.ObjectId.isValid(parentId)) {
            const err = new Error("Invalid parentId");
            err.statusCode = 400;
            throw err;
        }
        const exists = await Node.exists({ _id: parentId });
        if (!exists) {
            const err = new Error("Parent node not found");
            err.statusCode = 404;
            throw err;
        }
    }

    return Node.create({ name: name.trim(), parentId: parentId || null });
}

export function listNodes() {
    return Node.find().sort({ createdAt: 1 }).lean();
}

function buildTree(nodes) {
    const map = new Map(nodes.map(n => [String(n._id), { ...n, children: [] }]));
    const roots = [];
    for (const n of map.values()) {
        if (n.parentId) {
            const p = map.get(String(n.parentId));
            if (p) p.children.push(n);
        } else {
            roots.push(n);
        }
    }
    return roots;
}

export async function getTree() {
    const nodes = await Node.find().lean();
    return buildTree(nodes);
}

export async function renameNode(id, name) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const err = new Error("Invalid node id");
        err.statusCode = 400;
        throw err;
    }
    if (!name?.trim()) {
        const err = new Error("Name is required");
        err.statusCode = 400;
        throw err;
    }
    return Node.findByIdAndUpdate(id, { name: name.trim() }, { new: true }).lean();
}

export async function deleteNodeCascade(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const err = new Error("Invalid node id");
        err.statusCode = 400;
        throw err;
    }

    const _id = new mongoose.Types.ObjectId(id);
    const agg = await Node.aggregate([
        { $match: { _id } },
        {
            $graphLookup: {
                from: "nodes",
                startWith: "$_id",
                connectFromField: "_id",
                connectToField: "parentId",
                as: "descendants"
            }
        },
        { $project: { allIds: { $concatArrays: [["$_id"], "$descendants._id"] } } }
    ]);

    if (!agg.length) {
        const err = new Error("Node not found");
        err.statusCode = 404;
        throw err;
    }

    const allIds = agg[0].allIds || [];
    const res = await Node.deleteMany({ _id: { $in: allIds } });
    return { deletedCount: res.deletedCount || 0 };
}
