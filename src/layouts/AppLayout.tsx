import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Waves, MapPin, Briefcase, Users, BarChart2, Menu, X } from 'lucide-react'

const NAV_ITEMS = [
  { path: '/', label: 'Find Parking', icon: MapPin },
  { path: '/opportunities', label: 'Opportunities', icon: Briefcase },
  { path: '/community', label: 'Community', icon: Users },
  { path: '/dashboard', label: 'Dashboard', icon: BarChart2 },
]

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <NavLink to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm group-hover:opacity-90 transition-opacity">
                <Waves className="w-4.5 h-4.5 text-primary-foreground" strokeWidth={2.5} />
              </div>
              <div>
                <span className="font-display text-xl font-bold tracking-tight text-foreground">Wayve</span>
                <span className="hidden sm:inline text-xs text-muted-foreground ml-2 font-medium">AI Parking &amp; Mobility</span>
              </div>
            </NavLink>

            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map(item => {
                const isActive = location.pathname === item.path
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </NavLink>
                )
              })}
            </nav>

            <button
              className="md:hidden p-2.5 rounded-xl hover:bg-secondary transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-white">
            <nav className="max-w-6xl mx-auto px-4 py-3 space-y-1">
              {NAV_ITEMS.map(item => {
                const isActive = location.pathname === item.path
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </NavLink>
                )
              })}
            </nav>
          </div>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Outlet />
      </main>
    </div>
  )
}
