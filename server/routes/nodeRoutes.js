import express from "express";
import {
    createNodeCtrl,
    listNodesCtrl,
    getTreeCtrl,
    renameNodeCtrl,
    deleteNodeCtrl
} from "../controllers/nodeController.js";

const router = express.Router();

// Create node (root if parentId omitted or null)
router.post("/", createNodeCtrl);

// Flat list (optional)
router.get("/", listNodesCtrl);

// Full tree (nested)
router.get("/tree", getTreeCtrl);

// Rename
router.patch("/:id", renameNodeCtrl);

// Delete node + descendants
router.delete("/:id", deleteNodeCtrl);

export default router;
