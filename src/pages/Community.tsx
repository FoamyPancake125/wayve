import { useState, useMemo } from 'react'
import {
  MapPin, ChevronUp, ChevronDown, Plus, X, Clock, CheckCircle, XCircle,
  AlertTriangle, ShieldAlert, Gauge, Users, Star, BadgeCheck, Filter
} from 'lucide-react'

const REPORT_TYPES = [
  { value: 'spot_available', label: 'Spot Available', icon: CheckCircle, cls: 'text-green-700 bg-green-100 border-green-200' },
  { value: 'lot_full', label: 'Lot Full', icon: XCircle, cls: 'text-red-700 bg-red-100 border-red-200' },
  { value: 'street_parking_open', label: 'Street Parking Open', icon: CheckCircle, cls: 'text-teal-700 bg-teal-100 border-teal-200' },
  { value: 'leaving_soon', label: 'Leaving Soon', icon: Clock, cls: 'text-blue-700 bg-blue-100 border-blue-200' },
  { value: 'construction', label: 'Construction', icon: AlertTriangle, cls: 'text-orange-700 bg-orange-100 border-orange-200' },
  { value: 'street_cleaning', label: 'Street Cleaning', icon: Gauge, cls: 'text-violet-700 bg-violet-100 border-violet-200' },
  { value: 'event_traffic', label: 'Event Traffic', icon: Users, cls: 'text-amber-700 bg-amber-100 border-amber-200' },
  { value: 'temporary_closure', label: 'Temporary Closure', icon: ShieldAlert, cls: 'text-red-700 bg-red-100 border-red-200' },
]

const PARKING_TYPES = ['Garage', 'Street', 'Surface Lot', 'Metered', 'Permit Lot']
const DURATIONS = ['< 30 min', '30–60 min', '1–2 hours', '2+ hours', 'All day']

type Report = {
  id: number
  location: string
  report_type: string
  notes: string
  upvotes: number
  downvotes: number
  time: string
  author: string
  credibility: number
  verified: boolean
  confirmedBy: number
  confidence: number
  parkingType: string
  spotsAvailable?: number
}

const SEEDS: Report[] = [
  {
    id: 1, location: 'Lower Hearst Structure, UC Berkeley', report_type: 'spot_available',
    notes: 'Level 3 has about 15 open spots near the elevator. Meter machines working fine. Gate arm is up.',
    upvotes: 28, downvotes: 1, time: '4 min ago', author: 'Maria C.', credibility: 94,
    verified: true, confirmedBy: 4, confidence: 96, parkingType: 'Garage', spotsAvailable: 15,
  },
  {
    id: 2, location: 'RSF Garage, Bancroft & Ellsworth', report_type: 'lot_full',
    notes: 'Attendant turned me away at Level 1. Levels 2 and 3 also appeared full from the ramp. Try Downtown BART garage instead.',
    upvotes: 41, downvotes: 2, time: '18 min ago', author: 'James O.', credibility: 88,
    verified: true, confirmedBy: 6, confidence: 91, parkingType: 'Garage',
  },
  {
    id: 3, location: 'Durant Ave between Telegraph & Bowditch', report_type: 'street_parking_open',
    notes: 'About 4 open spots on the north side. Street cleaning was this morning so should be clear until 6pm.',
    upvotes: 17, downvotes: 0, time: '31 min ago', author: 'Sofia R.', credibility: 82,
    verified: false, confirmedBy: 2, confidence: 78, parkingType: 'Street', spotsAvailable: 4,
  },
  {
    id: 4, location: 'Telegraph/Channing Garage', report_type: 'leaving_soon',
    notes: 'Just leaving Level 2 — spot near the stairwell. Should be open in 2 minutes.',
    upvotes: 34, downvotes: 0, time: '52 min ago', author: 'David P.', credibility: 91,
    verified: true, confirmedBy: 3, confidence: 87, parkingType: 'Garage', spotsAvailable: 1,
  },
  {
    id: 5, location: 'Bancroft Way between Dana & Ellsworth', report_type: 'construction',
    notes: 'Street torn up for utility work. No parking on south side through end of week per city sign. North side ok.',
    upvotes: 52, downvotes: 3, time: '1 hr 20 min ago', author: 'Aisha W.', credibility: 97,
    verified: true, confirmedBy: 8, confidence: 98, parkingType: 'Street',
  },
  {
    id: 6, location: 'Hearst Ave near Shattuck', report_type: 'street_cleaning',
    notes: 'Street cleaning just went through — both sides now clear. Free until 6pm tonight.',
    upvotes: 19, downvotes: 1, time: '1 hr 45 min ago', author: 'Priya M.', credibility: 79,
    verified: false, confirmedBy: 1, confidence: 72, parkingType: 'Street', spotsAvailable: 8,
  },
  {
    id: 7, location: 'Stadium Parking Garage, Gayley Rd', report_type: 'event_traffic',
    notes: "Cal men's basketball tonight — flat rate $25 starting at 4pm. Already backed up to Piedmont Ave. Go early or use BART.",
    upvotes: 63, downvotes: 4, time: '2 hrs ago', author: 'Leo B.', credibility: 86,
    verified: true, confirmedBy: 11, confidence: 95, parkingType: 'Garage',
  },
]

const FILTER_OPTIONS = [
  { id: 'most_verified', label: 'Most Verified' },
  { id: 'most_recent', label: 'Most Recent' },
  { id: 'garages', label: 'Garages' },
  { id: 'street', label: 'Street Parking' },
  { id: 'leaving_soon', label: 'Leaving Soon' },
  { id: 'construction', label: 'Construction' },
  { id: 'closures', label: 'Closures' },
]

function Badge({ type }: { type: string }) {
  const rt = REPORT_TYPES.find(r => r.value === type)
  if (!rt) return null
  const Icon = rt.icon
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${rt.cls}`}>
      <Icon className="w-3 h-3" />{rt.label}
    </span>
  )
}

function CredibilityRing({ score }: { score: number }) {
  const color = score >= 90 ? 'text-green-600' : score >= 75 ? 'text-amber-500' : 'text-red-500'
  return (
    <div className={`flex flex-col items-center ${color}`}>
      <Star className="w-3.5 h-3.5" />
      <span className="text-xs font-bold">{score}</span>
    </div>
  )
}

export default function Community() {
  const [reports, setReports] = useState<Report[]>(SEEDS)
  const [upvoted, setUpvoted] = useState<number[]>([])
  const [downvoted, setDownvoted] = useState<number[]>([])
  const [showForm, setShowForm] = useState(false)
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set())

  // Form state
  const [location, setLocation] = useState('')
  const [reportType, setReportType] = useState('')
  const [parkingType, setParkingType] = useState('')
  const [spotsAvailable, setSpotsAvailable] = useState('')
  const [duration, setDuration] = useState('')
  const [notes, setNotes] = useState('')
  const [isAccessible, setIsAccessible] = useState(false)

  const upvote = (id: number) => {
    if (upvoted.includes(id)) return
    if (downvoted.includes(id)) {
      setDownvoted(p => p.filter(x => x !== id))
      setReports(p => p.map(r => r.id === id ? { ...r, downvotes: r.downvotes - 1 } : r))
    }
    setUpvoted(p => [...p, id])
    setReports(p => p.map(r => r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r))
  }

  const downvote = (id: number) => {
    if (downvoted.includes(id)) return
    if (upvoted.includes(id)) {
      setUpvoted(p => p.filter(x => x !== id))
      setReports(p => p.map(r => r.id === id ? { ...r, upvotes: r.upvotes - 1 } : r))
    }
    setDownvoted(p => [...p, id])
    setReports(p => p.map(r => r.id === id ? { ...r, downvotes: r.downvotes + 1 } : r))
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!location || !reportType) return
    const newReport: Report = {
      id: Date.now(),
      location, report_type: reportType,
      notes, upvotes: 0, downvotes: 0,
      time: 'Just now', author: 'You',
      credibility: 75, verified: false, confirmedBy: 0,
      confidence: 60, parkingType,
      spotsAvailable: spotsAvailable ? parseInt(spotsAvailable) : undefined,
    }
    setReports(p => [newReport, ...p])
    setShowForm(false)
    setLocation(''); setReportType(''); setParkingType('')
    setSpotsAvailable(''); setDuration(''); setNotes(''); setIsAccessible(false)
  }

  const toggleFilter = (id: string) => {
    setActiveFilters(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const displayedReports = useMemo(() => {
    let rs = [...reports]
    if (activeFilters.has('garages')) rs = rs.filter(r => r.parkingType === 'Garage')
    if (activeFilters.has('street')) rs = rs.filter(r => r.parkingType === 'Street')
    if (activeFilters.has('leaving_soon')) rs = rs.filter(r => r.report_type === 'leaving_soon')
    if (activeFilters.has('construction')) rs = rs.filter(r => r.report_type === 'construction')
    if (activeFilters.has('closures')) rs = rs.filter(r => r.report_type === 'temporary_closure')
    if (activeFilters.has('most_verified')) rs = [...rs].sort((a, b) => b.confirmedBy - a.confirmedBy)
    else if (activeFilters.has('most_recent')) rs = [...rs]
    return rs
  }, [reports, activeFilters])

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground tracking-tight">Community Reports</h1>
          <p className="text-muted-foreground mt-1.5 text-base">
            Real-time updates from Wayve users — help others find spots faster by sharing what you see.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-primary hover:opacity-90 active:scale-[0.98] text-primary-foreground text-sm font-bold px-5 py-3 rounded-xl transition-all shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" /> Share Update
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active Reports', value: reports.length.toString() },
          { label: 'Verified Today', value: reports.filter(r => r.verified).length.toString() },
          { label: 'Avg. Confidence', value: `${Math.round(reports.reduce((a, r) => a + r.confidence, 0) / reports.length)}%` },
        ].map(s => (
          <div key={s.label} className="bg-card rounded-2xl border border-border p-4 text-center shadow-sm">
            <div className="text-2xl font-display font-bold text-foreground">{s.value}</div>
            <div className="text-xs text-muted-foreground font-medium mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Submit Form */}
      {showForm && (
        <div className="bg-card rounded-2xl border border-border shadow-lg p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display text-lg font-bold text-foreground">Share a Parking Update</h3>
              <p className="text-sm text-muted-foreground mt-0.5">Your report helps nearby drivers in real time</p>
            </div>
            <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground p-2 hover:bg-secondary rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={submit} className="space-y-5">
            {/* Location */}
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1.5">Location or Address *</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Lower Hearst Structure, Level 3"
                  className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
            </div>

            {/* Report type */}
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">What's the status? *</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {REPORT_TYPES.map(rt => {
                  const Icon = rt.icon
                  return (
                    <button
                      key={rt.value}
                      type="button"
                      onClick={() => setReportType(rt.value)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all text-left ${
                        reportType === rt.value
                          ? `${rt.cls} border-current`
                          : 'border-border text-muted-foreground hover:bg-secondary bg-card'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{rt.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Details row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1.5">Parking Type</label>
                <select
                  value={parkingType}
                  onChange={e => setParkingType(e.target.value)}
                  className="w-full py-2.5 px-3 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select...</option>
                  {PARKING_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1.5">Available Spots</label>
                <input
                  type="number"
                  min="0"
                  value={spotsAvailable}
                  onChange={e => setSpotsAvailable(e.target.value)}
                  placeholder="e.g. 5"
                  className="w-full py-2.5 px-3 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1.5">Expected Duration</label>
                <select
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  className="w-full py-2.5 px-3 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select...</option>
                  {DURATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="flex flex-col justify-end">
                <label className="flex items-center gap-2.5 cursor-pointer py-2.5">
                  <div
                    onClick={() => setIsAccessible(!isAccessible)}
                    className={`w-10 h-5.5 rounded-full transition-colors relative ${isAccessible ? 'bg-primary' : 'bg-secondary border border-border'}`}
                    style={{ height: '22px', width: '40px' }}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${isAccessible ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </div>
                  <span className="text-sm font-medium text-foreground">ADA Accessible</span>
                </label>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1.5">Additional Details (optional)</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Describe what you see — level, section, specific location, any hazards, useful context..."
                rows={3}
                className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>

            <div className="flex gap-3 justify-end pt-1">
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-secondary rounded-xl transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                disabled={!location || !reportType}
                className="px-6 py-2.5 bg-primary hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground text-sm font-bold rounded-xl transition-all shadow-sm"
              >
                Submit Report
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground shrink-0">
          <Filter className="w-3.5 h-3.5" /> Filter:
        </div>
        {FILTER_OPTIONS.map(f => (
          <button
            key={f.id}
            onClick={() => toggleFilter(f.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
              activeFilters.has(f.id)
                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                : 'bg-card border-border text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-primary/5'
            }`}
          >
            {f.label}
          </button>
        ))}
        {activeFilters.size > 0 && (
          <button
            onClick={() => setActiveFilters(new Set())}
            className="text-xs text-red-600 font-semibold hover:text-red-700 ml-1"
          >
            Clear
          </button>
        )}
      </div>

      {/* Reports */}
      {displayedReports.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-14 text-center shadow-sm">
          <AlertTriangle className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-30" />
          <p className="text-sm font-semibold text-foreground mb-3">No reports match your filters.</p>
          <button onClick={() => setActiveFilters(new Set())} className="text-sm text-primary font-semibold hover:opacity-80">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedReports.map(r => {
            const hasUpvoted = upvoted.includes(r.id)
            const hasDownvoted = downvoted.includes(r.id)
            return (
              <div key={r.id} className="bg-card rounded-2xl border border-border p-5 hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  {/* Vote column */}
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <button
                      onClick={() => upvote(r.id)}
                      disabled={hasUpvoted}
                      className={`flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-xl border transition-all ${
                        hasUpvoted
                          ? 'border-green-300 bg-green-50 text-green-700'
                          : 'border-border text-muted-foreground hover:border-green-300 hover:text-green-700 hover:bg-green-50'
                      }`}
                    >
                      <ChevronUp className="w-4 h-4" />
                      <span className="text-xs font-bold">{r.upvotes}</span>
                    </button>
                    <button
                      onClick={() => downvote(r.id)}
                      disabled={hasDownvoted}
                      className={`flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-xl border transition-all ${
                        hasDownvoted
                          ? 'border-red-300 bg-red-50 text-red-600'
                          : 'border-border text-muted-foreground hover:border-red-200 hover:text-red-500 hover:bg-red-50'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                      <span className="text-xs font-bold">{r.downvotes}</span>
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Top row: badge + meta */}
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <Badge type={r.report_type} />
                      {r.verified && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                          <BadgeCheck className="w-3 h-3" /> Verified
                        </span>
                      )}
                      {r.confirmedBy > 1 && (
                        <span className="text-xs text-muted-foreground font-medium">
                          {r.confirmedBy} users confirmed
                        </span>
                      )}
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-1.5 mb-2">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span className="text-sm font-bold text-foreground">{r.location}</span>
                      {r.spotsAvailable !== undefined && (
                        <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full ml-1">
                          {r.spotsAvailable} {r.spotsAvailable === 1 ? 'spot' : 'spots'} open
                        </span>
                      )}
                    </div>

                    {r.notes && (
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">{r.notes}</p>
                    )}

                    {/* Footer row */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />{r.time}
                        </div>
                        <span className="text-xs text-muted-foreground font-medium">{r.author}</span>
                        <CredibilityRing score={r.credibility} />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-muted-foreground">Confidence:</span>
                        <div className="flex items-center gap-1.5">
                          <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${r.confidence >= 85 ? 'bg-green-500' : r.confidence >= 65 ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{ width: `${r.confidence}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-foreground">{r.confidence}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* CTA */}
      {!showForm && (
        <div className="bg-primary/5 border border-primary/15 rounded-2xl p-6 text-center">
          <p className="font-semibold text-foreground mb-1">See something drivers should know?</p>
          <p className="text-sm text-muted-foreground mb-4">Your report is instantly visible to everyone searching nearby. Takes 30 seconds.</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-bold px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-sm"
          >
            <Plus className="w-4 h-4" /> Share a Parking Update
          </button>
        </div>
      )}
    </div>
  )
}
