import { useEffect, useState, useCallback } from "react";
import { http } from "../api/http";
import toast from "react-hot-toast";

// helpers
const getMsg = (e) =>
  e?.response?.data?.message || e?.message || "Something went wrong";
const getData = (res) => res?.data?.data ?? res?.data ?? [];

export default function useTree() {
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const fetchTree = useCallback(async () => {
    try {
      setLoading(true);
      const res = await http.get("/nodes/tree");
      setTree(getData(res));
      setErr("");
    } catch (e) {
      const m = getMsg(e);
      setErr(m);
      toast.error(m);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTree();
  }, [fetchTree]);

  const createNode = async (name, parentId = null) => {
    try {
      const res = await http.post("/nodes", { name, parentId });
      toast.success(res?.data?.message || "Node added");
      await fetchTree();
    } catch (e) {
      toast.error(getMsg(e));
      throw e;
    }
  };

  const renameNode = async (id, name) => {
    try {
      const res = await http.patch(`/nodes/${id}`, { name });
      toast.success(res?.data?.message || "Node renamed");
      await fetchTree();
    } catch (e) {
      toast.error(getMsg(e));
      throw e;
    }
  };

  const deleteNode = async (id) => {
    try {
      const res = await http.delete(`/nodes/${id}`);
      toast.success(res?.data?.message || "Node deleted");
      await fetchTree();
    } catch (e) {
      toast.error(getMsg(e));
      throw e;
    }
  };

  return { tree, loading, err, createNode, renameNode, deleteNode };
}
