import { useState } from "react";
import {
  FiChevronRight,
  FiChevronDown,
  FiPlus,
  FiTrash2,
  FiEdit3,
} from "react-icons/fi";
import AddNodeForm from "./AddNodeForm";

export default function NodeItem({ node, actions, level = 0 }) {
  const { renameNode, deleteNode, createNode } = actions;
  const [expanded, setExpanded] = useState(false); // children visibility
  const [addMode, setAddMode] = useState(false); // show input only when + clicked
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(node.name);

  const hasChildren = node.children?.length > 0;

  const save = async () => {
    const next = val.trim();
    if (next && next !== node.name) await renameNode(node._id, next);
    setEditing(false);
  };

  const handleAdd = async (name) => {
    await createNode(name, node._id);
    setAddMode(false);
    setExpanded(true); // keep open after add
  };
  const confirmDelete = () => {
    if (window.confirm("Delete this node and all its children?")) {
      deleteNode(node._id);
    }
  };

  const rowClasses =
    "flex items-center justify-between bg-white border rounded-lg shadow-sm px-4 py-2 w-full";

  return (
    <li>
      {/* indent for this level */}
      <div className="w-full" style={{ paddingLeft: level * 16 }}>
        <div className={rowClasses}>
          <div className="flex items-center gap-2 min-w-0">
            {/* chevron toggles ONLY children */}
            {hasChildren ? (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="w-6 h-6 rounded border flex items-center justify-center hover:bg-gray-50"
                title={expanded ? "Collapse" : "Expand"}
                aria-label={expanded ? "Collapse" : "Expand"}
              >
                {expanded ? <FiChevronDown /> : <FiChevronRight />}
              </button>
            ) : (
              <span className="w-6 h-6 inline-block" />
            )}

            {editing ? (
              <input
                className="border rounded px-2 py-1 text-sm"
                value={val}
                onChange={(e) => setVal(e.target.value)}
                onBlur={save}
                onKeyDown={(e) => e.key === "Enter" && save()}
                autoFocus
              />
            ) : (
              <div
                className="flex items-center gap-2 min-w-0"
                onDoubleClick={() => setEditing(true)}
                title="Double click to rename"
              >
                <span className="truncate text-gray-800">{node.name}</span>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setEditing(true)}
                  aria-label="Rename"
                  title="Rename"
                >
                  <FiEdit3 />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* + only toggles the input row; also ensure it's visible */}
            <button
              onClick={() => {
                setAddMode((v) => !v);
                setExpanded(true);
              }}
              className="w-7 h-7 rounded border flex items-center justify-center hover:bg-gray-50"
              title="Add child"
              aria-label="Add child"
            >
              <FiPlus />
            </button>
            <button
              onClick={confirmDelete}
              className="w-7 h-7 rounded border flex items-center justify-center hover:bg-red-50 text-red-600 border-red-200"
              title="Delete"
              aria-label="Delete"
            >
              <FiTrash2 />
            </button>
          </div>
        </div>
      </div>

      {/* input row appears ONLY when + is clicked */}
      {addMode && (
        <div className="mt-2 w-full" style={{ paddingLeft: (level + 1) * 16 }}>
          <div className={rowClasses}>
            <span className="w-6 h-6 inline-block" />
            <div className="flex-1">
              <AddNodeForm parentId={node._id} onAdd={handleAdd} />
            </div>
            <button
              className="text-sm text-gray-500 hover:text-gray-700"
              onClick={() => setAddMode(false)}
            >
              Cancel
            </button>
            <span className="w-7" />
          </div>
        </div>
      )}

      {/* children show only when chevron expands */}
      {expanded && hasChildren && (
        <ul className="mt-2 space-y-2">
          {node.children.map((child) => (
            <NodeItem
              key={child._id}
              node={child}
              actions={actions}
              level={level + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
