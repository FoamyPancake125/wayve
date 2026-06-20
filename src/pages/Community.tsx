import { useState } from 'react'
import { MapPin, ChevronUp, Plus, X, Clock, CheckCircle, XCircle, Gauge, ShieldAlert, AlertTriangle } from 'lucide-react'

const REPORT_TYPES = [
  { value: 'spot_available', label: 'Spot available', icon: CheckCircle, cls: 'text-green-700 bg-green-50 border-green-200' },
  { value: 'leaving_soon', label: 'Leaving soon', icon: Clock, cls: 'text-blue-700 bg-blue-50 border-blue-200' },
  { value: 'lot_full', label: 'Lot full', icon: XCircle, cls: 'text-red-700 bg-red-50 border-red-200' },
  { value: 'street_parking_open', label: 'Street parking open', icon: CheckCircle, cls: 'text-teal-700 bg-teal-50 border-teal-200' },
  { value: 'meters_available', label: 'Meters available', icon: Gauge, cls: 'text-violet-700 bg-violet-50 border-violet-200' },
  { value: 'construction_closed', label: 'Construction/closed', icon: AlertTriangle, cls: 'text-orange-700 bg-orange-50 border-orange-200' },
  { value: 'safety', label: 'Safety', icon: ShieldAlert, cls: 'text-red-700 bg-red-50 border-red-200' },
]

type Report = { id: number; location: string; report_type: string; notes: string; upvotes: number; time: string; author: string }

const SEEDS: Report[] = [
  { id: 1, location: 'Kearny St. Garage, SF', report_type: 'spot_available', notes: '3rd floor has plenty of open spots. Meter ends at 6pm.', upvotes: 14, time: '8 min ago', author: 'Maria C.' },
  { id: 2, location: 'Main St. Lot 3, Downtown', report_type: 'lot_full', notes: 'Completely full — attendant turned me away. Try the Kearny garage instead.', upvotes: 31, time: '22 min ago', author: 'James O.' },
  { id: 3, location: 'Mission St. between 4th & 5th', report_type: 'street_parking_open', notes: 'About 6 open spots on the south side. Street cleaning done for the day.', upvotes: 9, time: '45 min ago', author: 'Sofia R.' },
  { id: 4, location: 'Embarcadero Center Garage', report_type: 'leaving_soon', notes: 'Just pulling out from Level 2 — spot near elevator on the left.', upvotes: 22, time: '1 hr ago', author: 'David P.' },
  { id: 5, location: 'Polk St. near City Hall', report_type: 'construction_closed', notes: 'Entire block closed for utility work. No parking until Thursday per the signs.', upvotes: 47, time: '2 hrs ago', author: 'Aisha W.' },
]

function Badge({ type }: { type: string }) {
  const rt = REPORT_TYPES.find(r => r.value === type)
  if (!rt) return null
  const Icon = rt.icon
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${rt.cls}`}>
      <Icon className="w-3 h-3" />
      {rt.label}
    </span>
  )
}

export default function Community() {
  const [reports, setReports] = useState<Report[]>(SEEDS)
  const [upvoted, setUpvoted] = useState<number[]>([])
  const [showForm, setShowForm] = useState(false)
  const [location, setLocation] = useState('')
  const [reportType, setReportType] = useState('')
  const [notes, setNotes] = useState('')

  const upvote = (id: number) => {
    if (upvoted.includes(id)) return
    setUpvoted(p => [...p, id])
    setReports(p => p.map(r => r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r))
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!location || !reportType) return
    setReports(p => [{ id: Date.now(), location, report_type: reportType, notes, upvotes: 0, time: 'Just now', author: 'You' }, ...p])
    setShowForm(false)
    setLocation('')
    setReportType('')
    setNotes('')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Community Reports</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Share real-time parking updates to help others find spots faster.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-primary hover:opacity-90 text-primary-foreground text-sm font-semibold px-4 py-2.5 rounded-lg transition-opacity shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          Report parking status
        </button>
      </div>

      {showForm && (
        <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-foreground">Share a parking update</h3>
            <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                Location or address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="Location or address"
                  className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                What's the status?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {REPORT_TYPES.map(rt => {
                  const Icon = rt.icon
                  return (
                    <button
                      key={rt.value}
                      type="button"
                      onClick={() => setReportType(rt.value)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all text-left ${
                        reportType === rt.value
                          ? `${rt.cls} border-current`
                          : 'border-border text-muted-foreground hover:bg-secondary bg-card'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="text-xs">{rt.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                Any additional details (optional)
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Any additional details (optional)"
                rows={3}
                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-muted-foreground hover:bg-secondary rounded-lg transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                disabled={!location || !reportType}
                className="px-4 py-2 bg-primary hover:opacity-90 disabled:opacity-50 text-primary-foreground text-sm font-semibold rounded-lg transition-opacity"
              >
                Submit Report
              </button>
            </div>
          </form>
        </div>
      )}

      {reports.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-12 text-center shadow-sm">
          <AlertTriangle className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-30" />
          <p className="text-sm font-medium text-foreground">Be the first to share a parking update in your area.</p>
          <button onClick={() => setShowForm(true)} className="mt-4 text-sm text-primary font-medium hover:opacity-80 transition-opacity">
            Report parking status →
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map(r => (
            <div key={r.id} className="bg-card rounded-xl border border-border p-5 hover:shadow-sm transition-all">
              <div className="flex items-start gap-4">
                <button
                  onClick={() => upvote(r.id)}
                  disabled={upvoted.includes(r.id)}
                  className={`flex flex-col items-center gap-0.5 px-2.5 py-2 rounded-lg border transition-all shrink-0 ${
                    upvoted.includes(r.id)
                      ? 'border-primary/30 bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/30 hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  <ChevronUp className="w-4 h-4" />
                  <span className="text-xs font-bold">{r.upvotes}</span>
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <Badge type={r.report_type} />
                    <span className="text-xs text-muted-foreground">{r.time} · {r.author}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="text-sm font-medium text-foreground">{r.location}</span>
                  </div>
                  {r.notes && <p className="text-sm text-muted-foreground leading-relaxed">{r.notes}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
