import { asyncHandler } from "../utils/asyncHandler.js";
import {
    createNode,
    listNodes,
    getTree,
    renameNode,
    deleteNodeCascade
} from "../services/nodeService.js";

export const createNodeCtrl = asyncHandler(async (req, res) => {
    const { name, parentId = null } = req.body || {};
    if (!name || !name.trim()) {
        res.status(400);
        throw new Error("Name is required");
    }
    const doc = await createNode({ name: name.trim(), parentId });
    res.status(201).json({ message: "Node created", data: doc });
});

export const listNodesCtrl = asyncHandler(async (_req, res) => {
    const list = await listNodes();
    res.json({ message: "Nodes fetched", data: list });
});

export const getTreeCtrl = asyncHandler(async (_req, res) => {
    const tree = await getTree();
    res.json({ message: "Tree fetched", data: tree });
});

export const renameNodeCtrl = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name } = req.body || {};
    if (!name || !name.trim()) {
        res.status(400);
        throw new Error("Name is required");
    }
    const updated = await renameNode(id, name.trim());
    if (!updated) {
        res.status(404);
        throw new Error("Node not found");
    }
    res.json({ message: "Node renamed", data: updated });
});

export const deleteNodeCtrl = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const out = await deleteNodeCascade(id);
    res.json({ message: `Deleted ${out.deletedCount} node(s)`, data: out });
});
