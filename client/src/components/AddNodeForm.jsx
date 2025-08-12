import { useState } from "react";

export default function AddNodeForm({ parentId = null, onAdd }) {
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Name is required");
      return;
    }
    setBusy(true);
    try {
      await onAdd(trimmed, parentId);
      setName("");
      setError("");
    } finally {
      setBusy(false);
    }
  };

  const onChange = (e) => {
    setName(e.target.value);
    if (error) setError("");
  };

  const invalid = !!error;

  return (
    <form onSubmit={submit} className="mt-2 flex items-start gap-2">
      <div className="flex-1">
        <input
          className={`border rounded px-3 py-2 text-sm w-56 ${
            invalid ? "border-red-500 ring-1 ring-red-400" : "border-gray-300"
          }`}
          value={name}
          onChange={onChange}
          placeholder="New node name"
          aria-invalid={invalid}
          aria-describedby={invalid ? "name-error" : undefined}
        />
        {invalid && (
          <p id="name-error" className="text-red-600 text-xs mt-1">
            {error}
          </p>
        )}
      </div>
      <button
        disabled={busy}
        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm disabled:opacity-60"
      >
        {busy ? "Adding..." : "Add"}
      </button>
    </form>
  );
}
