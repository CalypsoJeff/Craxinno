import useTree from "./hooks/useTree";
import Tree from "./components/Tree";
import './index.css'
import { Toaster } from "react-hot-toast";

export default function App() {
  const { tree, loading, err, createNode, renameNode, deleteNode } = useTree();
  return (
    <div className="p-6">
        <Toaster position="top-center" />
      <Tree
        roots={tree}
        loading={loading}
        err={err}
        actions={{ createNode, renameNode, deleteNode }}
      />
    </div>
  );
}
