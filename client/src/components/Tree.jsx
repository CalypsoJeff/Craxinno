import { useState } from "react";
import AddNodeForm from "./AddNodeForm";
import NodeItem from "./NodeItem";

export default function Tree({ roots, actions, loading, err }) {
  const [showRootForm, setShowRootForm] = useState(false);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-gray-900">
        Node Tree Manager
      </h1>
      <h5 className="text-base text-gray-600">
        Manage your hierarchical data structure with ease
      </h5>

      <div className="pt-10">
        <button
          type="button"
          onClick={() => setShowRootForm((v) => !v)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          + Add Root Node
        </button>
        {showRootForm && (
          <div className="mt-5">
            <AddNodeForm onAdd={(name) => actions.createNode(name, null)} />
          </div>
        )}
      </div>

      {loading && <p className="mt-4">Loading…</p>}
      {err && <p className="mt-4 text-red-600">{err}</p>}

      <ul className="mt-4 space-y-2">
        {roots.map((n) => (
          <NodeItem key={n._id} node={n} actions={actions} level={0} />
        ))}
      </ul>

      <p className="mt-8 text-xs text-gray-500">
        Click node names to edit • Use expand/collapse buttons to navigate • Add
        children with the “+” button
      </p>
    </div>
  );
}
