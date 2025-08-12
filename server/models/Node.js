import mongoose from "mongoose";

const nodeSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Node", default: null },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Node", nodeSchema);
