import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "";

export default function Sidebar({ onSelectList }) {
  const [workspaces, setWorkspaces] = useState([]);
  const [lists, setLists] = useState([]);
  const [newWorkspace, setNewWorkspace] = useState("");
  const [newList, setNewList] = useState("");
  const [activeWorkspace, setActiveWorkspace] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/workspaces`).then(r => r.json()).then(setWorkspaces).catch(() => {});
  }, []);

  useEffect(() => {
    if (!activeWorkspace) return;
    fetch(`${API_BASE}/lists?workspace_id=${activeWorkspace}`).then(r => r.json()).then(setLists).catch(() => {});
  }, [activeWorkspace]);

  const createWorkspace = async () => {
    if (!newWorkspace.trim()) return;
    const res = await fetch(`${API_BASE}/workspaces`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newWorkspace })});
    if (res.ok) {
      setNewWorkspace("");
      const all = await (await fetch(`${API_BASE}/workspaces`)).json();
      setWorkspaces(all);
    }
  };

  const createList = async () => {
    if (!newList.trim() || !activeWorkspace) return;
    const res = await fetch(`${API_BASE}/lists`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newList, workspace_id: activeWorkspace })});
    if (res.ok) {
      setNewList("");
      const all = await (await fetch(`${API_BASE}/lists?workspace_id=${activeWorkspace}`)).json();
      setLists(all);
    }
  };

  return (
    <div className="w-72 bg-slate-900/60 backdrop-blur border-r border-white/10 p-4 flex flex-col gap-4">
      <div>
        <h2 className="text-white font-semibold mb-2">Workspaces</h2>
        <div className="flex gap-2 mb-2">
          <input value={newWorkspace} onChange={e=>setNewWorkspace(e.target.value)} placeholder="New workspace" className="flex-1 bg-slate-800/60 text-white rounded px-2 py-1 text-sm outline-none border border-white/10" />
          <button onClick={createWorkspace} className="bg-blue-600 hover:bg-blue-500 text-white rounded px-2 text-sm">Add</button>
        </div>
        <div className="space-y-1 max-h-40 overflow-auto pr-1">
          {workspaces.map(w => (
            <button key={w._id} onClick={()=>setActiveWorkspace(w._id)} className={`w-full text-left px-2 py-1 rounded text-sm ${activeWorkspace===w._id? 'bg-blue-600 text-white':'text-blue-200 hover:bg-white/5'}`}>{w.name}</button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-white font-semibold mb-2">Lists</h2>
        <div className="flex gap-2 mb-2">
          <input value={newList} onChange={e=>setNewList(e.target.value)} placeholder="New list" className="flex-1 bg-slate-800/60 text-white rounded px-2 py-1 text-sm outline-none border border-white/10" />
          <button onClick={createList} className="bg-blue-600 hover:bg-blue-500 text-white rounded px-2 text-sm">Add</button>
        </div>
        <div className="space-y-1 max-h-60 overflow-auto pr-1">
          {lists.map(l => (
            <button key={l._id} onClick={()=>onSelectList(l._id)} className="w-full text-left px-2 py-1 rounded text-sm text-blue-200 hover:bg-white/5">{l.name}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
