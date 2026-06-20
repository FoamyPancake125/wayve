import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Briefcase, Users, LogOut, Waves } from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/opportunities', icon: Briefcase, label: 'Opportunities' },
  { to: '/community', icon: Users, label: 'Community' },
]

export default function Sidebar() {
  return (
    <aside className="w-60 bg-white border-r border-slate-200 flex flex-col shrink-0">
      <div className="p-5 flex items-center gap-2.5 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
          <Waves className="w-4 h-4 text-white" />
        </div>
        <span className="text-lg font-bold text-slate-900">Wayve</span>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-slate-100">
        <NavLink
          to="/login"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </NavLink>
        <div className="flex items-center gap-3 px-3 py-3 mt-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            X
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">Xiangting</p>
            <p className="text-xs text-slate-400 truncate">xiangtingren@gmail.com</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
