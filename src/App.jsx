import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Board from './components/Board'

function App() {
  const [activeList, setActiveList] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-blue-100">
      <div className="relative min-h-screen flex">
        <Sidebar onSelectList={setActiveList} />
        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b border-white/10 flex items-center px-4 justify-between bg-slate-900/60 backdrop-blur">
            <div className="flex items-center gap-3">
              <img src="/flame-icon.svg" alt="logo" className="w-7 h-7" />
              <div className="font-semibold text-white">ClickUp Pro Replica</div>
            </div>
            <div className="text-xs text-blue-300/70">Your personal project OS</div>
          </header>
          <Board activeList={activeList} />
        </div>
      </div>
    </div>
  )
}

export default App
