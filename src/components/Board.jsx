import { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "";
const STATUSES = [
  { key: 'todo', label: 'To do' },
  { key: 'in_progress', label: 'In progress' },
  { key: 'review', label: 'Review' },
  { key: 'done', label: 'Done' },
];

export default function Board({ activeList }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    if (!activeList) return;
    fetch(`${API_BASE}/tasks?list_id=${activeList}`).then(r=>r.json()).then(setTasks).catch(()=>{});
  }, [activeList]);

  const grouped = useMemo(() => {
    const g = { todo: [], in_progress: [], review: [], done: [] };
    tasks.forEach(t => { g[t.status||'todo'].push(t); });
    return g;
  }, [tasks]);

  const addTask = async () => {
    if (!newTask.trim() || !activeList) return;
    const res = await fetch(`${API_BASE}/tasks`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: newTask, list_id: activeList })});
    if (res.ok) {
      setNewTask("");
      const all = await (await fetch(`${API_BASE}/tasks?list_id=${activeList}`)).json();
      setTasks(all);
    }
  };

  return (
    <div className="flex-1 overflow-auto p-6">
      {!activeList ? (
        <div className="text-blue-200">Select a list to view tasks</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATUSES.map(s => (
            <div key={s.key} className="bg-slate-900/60 border border-white/10 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-semibold text-sm">{s.label}</h3>
                <span className="text-xs text-blue-300/60">{grouped[s.key].length}</span>
              </div>
              <div className="space-y-2 min-h-[120px]">
                {grouped[s.key].map(t => (
                  <div key={t._id} className="bg-slate-800/60 rounded-lg p-3 border border-white/10 text-blue-100 text-sm">
                    <div className="font-medium text-white">{t.title}</div>
                    {t.description && <div className="text-blue-200/70 text-xs mt-1">{t.description}</div>}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="sm:col-span-2 lg:col-span-4">
            <div className="flex gap-2">
              <input value={newTask} onChange={e=>setNewTask(e.target.value)} placeholder="Quick add task" className="flex-1 bg-slate-900/60 text-white rounded px-3 py-2 outline-none border border-white/10" />
              <button onClick={addTask} className="bg-blue-600 hover:bg-blue-500 text-white rounded px-4">Add task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
