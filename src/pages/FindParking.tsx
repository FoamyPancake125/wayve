import { useState } from 'react'
import { Search, MapPin, Clock, Car, Train, Bike, Navigation, ChevronRight, RotateCcw, Sparkles } from 'lucide-react'

const MODES = [
  { value: 'standard', label: 'Standard' },
  { value: 'event_parking', label: 'Event parking' },
  { value: 'commute', label: 'Commute' },
  { value: 'student', label: 'Student' },
  { value: 'accessible', label: 'Accessible' },
]

const ARRIVAL_TIMES = [
  { value: 'now', label: 'Now' },
  { value: '15', label: 'In 15 min' },
  { value: '30', label: 'In 30 min' },
  { value: '60', label: 'In 1 hour' },
  { value: '120', label: 'In 2 hours' },
]

type SearchEntry = { destination: string; arrivalTime: string; mode: string }

function makeSeed(s: string) {
  return s.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
}

function getParkingOptions(destination: string, mode: string) {
  const n = makeSeed(destination)
  return [
    {
      name: `${destination.split(',')[0]} Parking Garage`,
      type: 'Garage',
      spots: 15 + (n % 45),
      distance: `${(0.1 + (n % 7) * 0.1).toFixed(1)} mi`,
      cost: mode === 'student' ? 'Free w/ permit' : `$${3 + (n % 8)}/hr`,
      difficulty: 'easy' as const,
      walk: `${2 + (n % 5)} min walk`,
    },
    {
      name: 'Street Parking',
      type: 'Street',
      spots: 2 + (n % 9),
      distance: `${(0.05 + (n % 4) * 0.05).toFixed(2)} mi`,
      cost: `$${1 + (n % 3)}/hr`,
      difficulty: 'hard' as const,
      walk: `${1 + (n % 3)} min walk`,
    },
    {
      name: 'Central Lot',
      type: 'Surface Lot',
      spots: 30 + (n % 55),
      distance: `${(0.3 + (n % 5) * 0.1).toFixed(1)} mi`,
      cost: `$${5 + (n % 6)}/hr`,
      difficulty: 'moderate' as const,
      walk: `${5 + (n % 6)} min walk`,
    },
    {
      name: 'Civic Center Garage',
      type: 'Garage',
      spots: 8 + (n % 20),
      distance: `${(0.5 + (n % 4) * 0.15).toFixed(1)} mi`,
      cost: `$${4 + (n % 7)}/hr`,
      difficulty: 'easy' as const,
      walk: `${7 + (n % 5)} min walk`,
    },
  ]
}

const DIFF: Record<string, string> = {
  easy: 'text-green-700 bg-green-50 border border-green-200',
  moderate: 'text-yellow-700 bg-yellow-50 border border-yellow-200',
  hard: 'text-red-700 bg-red-50 border border-red-200',
}

export default function FindParking() {
  const [destination, setDestination] = useState('')
  const [arrivalTime, setArrivalTime] = useState('now')
  const [mode, setMode] = useState('standard')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SearchEntry | null>(null)
  const [recent, setRecent] = useState<SearchEntry[]>([])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!destination.trim()) return
    setLoading(true)
    setResult(null)
    const entry: SearchEntry = { destination: destination.trim(), arrivalTime, mode }
    setTimeout(() => {
      setResult(entry)
      setRecent(prev => [entry, ...prev.filter(r => r.destination !== entry.destination)].slice(0, 5))
      setLoading(false)
    }, 1800)
  }

  const runRecent = (s: SearchEntry) => {
    setDestination(s.destination)
    setArrivalTime(s.arrivalTime)
    setMode(s.mode)
    setLoading(true)
    setResult(null)
    setTimeout(() => { setResult(s); setLoading(false) }, 1800)
  }

  const options = result ? getParkingOptions(result.destination, result.mode) : []

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Where are you headed?</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Enter a destination to see AI parking predictions, availability estimates, and smart alternatives.
        </p>
      </div>

      <form
        onSubmit={handleSearch}
        className="bg-card rounded-2xl border border-border p-5 space-y-4 shadow-sm"
      >
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
            Destination
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={destination}
              onChange={e => setDestination(e.target.value)}
              placeholder="Where are you headed?"
              className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
              Arrival Time
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <select
                value={arrivalTime}
                onChange={e => setArrivalTime(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
              >
                {ARRIVAL_TIMES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
              Search Mode
            </label>
            <div className="relative">
              <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <select
                value={mode}
                onChange={e => setMode(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
              >
                {MODES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {MODES.map(m => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMode(m.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                mode === m.value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/30'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={!destination.trim() || loading}
          className="w-full bg-primary hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-semibold py-2.5 rounded-lg transition-opacity text-sm flex items-center justify-center gap-2"
        >
          <Search className="w-4 h-4" />
          {loading ? 'Finding parking...' : 'Find Parking'}
        </button>
      </form>

      {loading && (
        <div className="bg-card rounded-2xl border border-border p-10 text-center shadow-sm">
          <div className="w-10 h-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin mx-auto mb-4" />
          <p className="text-sm font-medium text-foreground">
            Analyzing parking near <span className="text-primary">{destination}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">Checking real-time availability and AI predictions...</p>
        </div>
      )}

      {result && !loading && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <h2 className="font-display font-semibold text-foreground">Parking Options</h2>
            </div>
            <button
              onClick={() => setResult(null)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> New search
            </button>
          </div>

          <div className="space-y-3">
            {options.map((opt, i) => (
              <div
                key={i}
                className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-foreground text-sm">{opt.name}</h3>
                      <span className="text-xs px-2 py-0.5 bg-secondary text-muted-foreground rounded-full">{opt.type}</span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />{opt.distance} · {opt.walk}
                      </span>
                      <span className="font-medium text-foreground">{opt.cost}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xl font-bold text-foreground">{opt.spots}</div>
                    <div className="text-xs text-muted-foreground">spots</div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${DIFF[opt.difficulty]}`}>
                    {opt.difficulty} to find
                  </span>
                  <button className="flex items-center gap-1 text-xs font-semibold text-primary hover:opacity-80 transition-opacity">
                    Navigate <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <h2 className="font-display font-semibold text-foreground mb-1">Smart Alternatives</h2>
            <p className="text-xs text-muted-foreground mb-4">Other ways to get there</p>
            <div className="space-y-3">
              {[
                { icon: Train, label: 'Transit', detail: 'BART station nearby · fastest option' },
                { icon: Bike, label: 'Bike', detail: 'City bike share available · 8 min' },
                { icon: Navigation, label: 'Walk', detail: `${18 + makeSeed(result.destination) % 10} min from transit hub` },
              ].map((alt, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                    <alt.icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{alt.label}</p>
                    <p className="text-xs text-muted-foreground">{alt.detail}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!result && !loading && recent.length > 0 && (
        <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
          <h2 className="font-display font-semibold text-foreground mb-4">Recent Searches</h2>
          <div className="space-y-1">
            {recent.map((s, i) => (
              <button
                key={i}
                onClick={() => runRecent(s)}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors text-left"
              >
                <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{s.destination}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {MODES.find(m => m.value === s.mode)?.label} · {ARRIVAL_TIMES.find(t => t.value === s.arrivalTime)?.label}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {!result && !loading && recent.length === 0 && (
        <div className="text-center py-12">
          <Car className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-30" />
          <p className="text-sm text-muted-foreground">No searches yet. Try finding parking for a destination.</p>
          <p className="text-xs text-muted-foreground mt-1">
            AI-powered parking predictions so you spend less time circling and more time at what matters.
          </p>
        </div>
      )}
    </div>
  )
}
