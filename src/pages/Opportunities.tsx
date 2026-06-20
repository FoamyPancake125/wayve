import { useState } from 'react'
import { Search, MapPin, Car, Train, Bookmark, ChevronRight, Briefcase, GraduationCap, Calendar, Heart, Users, Stethoscope } from 'lucide-react'

const TYPES = [
  { value: 'all', label: 'All types' },
  { value: 'job', label: 'Jobs' },
  { value: 'class', label: 'Classes' },
  { value: 'event', label: 'Events' },
  { value: 'internship', label: 'Internships' },
  { value: 'volunteer', label: 'Volunteer' },
  { value: 'networking', label: 'Networking' },
  { value: 'healthcare', label: 'Healthcare' },
]

const OPPORTUNITIES = [
  {
    id: 1, type: 'job',
    title: 'Software Engineer', org: 'TechNova Labs',
    location: '580 Howard St, SF', salary: '$120k–$160k',
    parking_difficulty: 'moderate', transit: 'BART Embarcadero · 4 min walk',
    parking_nearby: 38, score: 82, tags: ['Remote-friendly', 'Full-time'],
  },
  {
    id: 2, type: 'class',
    title: 'Data Science Bootcamp', org: 'SFCC Community College',
    location: '1860 Hayes St, SF', salary: '$2,400/semester',
    parking_difficulty: 'easy', transit: 'Muni 21-Hayes · 2 min walk',
    parking_nearby: 64, score: 91, tags: ['Student permit', 'Part-time'],
  },
  {
    id: 3, type: 'event',
    title: 'Tech Networking Night', org: 'SF Startup Hub',
    location: '101 California St, SF', salary: 'Free admission',
    parking_difficulty: 'hard', transit: 'BART Montgomery · 1 min walk',
    parking_nearby: 12, score: 68, tags: ['Tonight 6pm', 'Networking'],
  },
  {
    id: 4, type: 'internship',
    title: 'UX Design Intern', org: 'Urban Mobility Co.',
    location: '353 Sacramento St, SF', salary: '$25/hr',
    parking_difficulty: 'moderate', transit: 'BART Montgomery · 3 min walk',
    parking_nearby: 22, score: 76, tags: ['Summer 2025', 'Paid'],
  },
  {
    id: 5, type: 'volunteer',
    title: 'Food Bank Volunteer', org: 'SF-Marin Food Bank',
    location: '900 Pennsylvania Ave, SF', salary: 'Volunteer',
    parking_difficulty: 'easy', transit: 'Muni 48 · 5 min walk',
    parking_nearby: 55, score: 88, tags: ['Weekends', 'Flexible'],
  },
  {
    id: 6, type: 'healthcare',
    title: 'Patient Care Assistant', org: 'UCSF Medical Center',
    location: '505 Parnassus Ave, SF', salary: '$22–$28/hr',
    parking_difficulty: 'easy', transit: 'Muni N-Judah · 1 min walk',
    parking_nearby: 71, score: 94, tags: ['Full-time', 'Benefits'],
  },
]

const ICONS: Record<string, React.ElementType> = {
  job: Briefcase, class: GraduationCap, event: Calendar,
  internship: Briefcase, volunteer: Heart, networking: Users, healthcare: Stethoscope,
}

const DIFF: Record<string, { label: string; cls: string }> = {
  easy: { label: 'Easy parking', cls: 'text-green-700 bg-green-50 border-green-200' },
  moderate: { label: 'Some difficulty', cls: 'text-yellow-700 bg-yellow-50 border-yellow-200' },
  hard: { label: 'Hard to park', cls: 'text-red-700 bg-red-50 border-red-200' },
}

export default function Opportunities() {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [activeType, setActiveType] = useState('all')
  const [saved, setSaved] = useState<number[]>([])

  const filtered = OPPORTUNITIES
    .filter(o =>
      (activeType === 'all' || o.type === activeType) &&
      (o.title.toLowerCase().includes(query.toLowerCase()) ||
        o.org.toLowerCase().includes(query.toLowerCase()))
    )
    .sort((a, b) => b.score - a.score)

  const toggleSave = (id: number) =>
    setSaved(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Opportunity Discovery</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Find jobs, classes, events, and more, ranked by how accessible they actually are from your location.
        </p>
      </div>

      <div className="bg-card rounded-2xl border border-border p-4 space-y-3 shadow-sm">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="Your location"
            className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search opportunities..."
            className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {TYPES.map(t => (
          <button
            key={t.value}
            onClick={() => setActiveType(t.value)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              activeType === t.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        {filtered.length} result{filtered.length !== 1 ? 's' : ''} · Sorted by accessibility score
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Search className="w-10 h-10 mx-auto mb-3 opacity-25" />
          <p className="text-sm">No opportunities found. Try adjusting your search.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(opp => {
            const Icon = ICONS[opp.type] || Briefcase
            const diff = DIFF[opp.parking_difficulty]
            const isSaved = saved.includes(opp.id)
            const scoreColor = opp.score >= 85 ? 'text-green-600' : opp.score >= 70 ? 'text-yellow-600' : 'text-red-500'
            return (
              <div key={opp.id} className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-foreground text-sm">{opp.title}</h3>
                        <p className="text-sm text-muted-foreground">{opp.org}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="text-center">
                          <div className={`text-sm font-bold ${scoreColor}`}>{opp.score}</div>
                          <div className="text-xs text-muted-foreground">Access</div>
                        </div>
                        <button
                          onClick={() => toggleSave(opp.id)}
                          className={`p-1.5 rounded-lg transition-colors ${isSaved ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:bg-secondary'}`}
                        >
                          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 mt-1.5">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground truncate">{opp.location}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {opp.tags.map(tag => (
                        <span key={tag} className="text-xs px-2 py-0.5 bg-secondary text-muted-foreground rounded-full">{tag}</span>
                      ))}
                    </div>

                    <div className="mt-3 pt-3 border-t border-border grid grid-cols-2 gap-3">
                      <div className="flex items-start gap-2">
                        <Car className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-foreground">{opp.parking_nearby} spots nearby</p>
                          <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full border ${diff.cls}`}>{diff.label}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Train className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                        <p className="text-xs text-muted-foreground">{opp.transit}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm font-semibold text-foreground">{opp.salary}</span>
                      <button className="flex items-center gap-1 text-xs font-semibold text-primary hover:opacity-80 transition-opacity">
                        View details <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <p className="text-xs text-center text-muted-foreground pb-4">
        Search for jobs, classes, or events to see which ones are actually reachable based on transportation and parking.
      </p>
    </div>
  )
}
