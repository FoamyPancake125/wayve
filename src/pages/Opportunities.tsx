import { useState, useMemo } from 'react'
import {
  Search, MapPin, Car, Train, Bookmark, ChevronRight, ChevronDown,
  Briefcase, GraduationCap, Calendar, Heart, Users, Stethoscope,
  Clock, DollarSign, Accessibility, Wifi, Star
} from 'lucide-react'

type OppType = 'job' | 'class' | 'event' | 'internship' | 'volunteer' | 'networking' | 'healthcare'

type Opportunity = {
  id: number
  type: OppType
  title: string
  org: string
  location: string
  salary: string
  travelMin: number
  parkingNearby: number
  parkingCost: string
  transitOption: string
  accessibilityScore: number
  parkingDifficulty: 'easy' | 'moderate' | 'hard'
  tags: string[]
  recommendedTransport: string
  whyRanked: string
  // Expanded details
  nearbyParking: string[]
  transitDetails: string[]
  walkingDistance: string
  commuteSummary: string
  affordabilityScore: number
  accessibilityDetails: string
  remote: boolean
}

const OPPORTUNITIES: Opportunity[] = [
  {
    id: 1, type: 'job',
    title: 'Software Engineer', org: 'TechNova Labs',
    location: '2150 Shattuck Ave, Berkeley', salary: '$120k–$160k',
    travelMin: 8, parkingNearby: 38, parkingCost: '$4/hr',
    transitOption: 'BART Downtown Berkeley · 3-min walk',
    accessibilityScore: 92, parkingDifficulty: 'easy',
    tags: ['Full-time', 'Hybrid', 'Health Benefits'],
    recommendedTransport: 'BART',
    whyRanked: 'Exceptional transit access via BART and plentiful nearby parking make this one of the most accessible jobs in the East Bay. The Downtown Berkeley BART garage is 0.2 mi away with 93% confidence of open spots.',
    nearbyParking: ['Downtown Berkeley BART Garage — 420 spots, $2/hr', 'Shattuck Ave street meters — $1.25/hr (2-hr limit)', 'Center St Garage — $3/hr, covered'],
    transitDetails: ['BART Downtown Berkeley station — 3-min walk', 'AC Transit 51B along Telegraph', 'Lyft/Uber surge rarely exceeds $12 from campus'],
    walkingDistance: '0.2 mi from BART (3-min walk)',
    commuteSummary: 'Berkeley BART → 3-min walk. Drive: 8-min from campus, ample parking at $4/hr or free BART garage first hour.',
    affordabilityScore: 88,
    accessibilityDetails: 'ADA elevator at Downtown Berkeley BART. Building has accessible entrance on Shattuck Ave. Accessible parking spaces available in BART garage.',
    remote: false,
  },
  {
    id: 2, type: 'class',
    title: 'Data Science Bootcamp', org: 'Berkeley City College',
    location: '2050 Center St, Berkeley', salary: '$2,400/semester',
    travelMin: 6, parkingNearby: 64, parkingCost: '$2/hr',
    transitOption: 'BART Downtown Berkeley · 1-min walk',
    accessibilityScore: 96, parkingDifficulty: 'easy',
    tags: ['Part-time', 'Certificate', 'Student Financial Aid'],
    recommendedTransport: 'BART',
    whyRanked: "Steps from BART and surrounded by the most parking of any location in our dataset. Highest accessibility score because it's reachable by every mode of transport.",
    nearbyParking: ['Center St Garage — $3/hr, 200+ spaces', 'Downtown BART Garage — 420 spots, $2/hr', 'Oxford St meters — free after 6pm'],
    transitDetails: ['BART Downtown Berkeley — 1-min walk', 'AC Transit 51B, 52 along Telegraph', 'Multiple bike share docks nearby'],
    walkingDistance: '0.1 mi from BART (1-min walk)',
    commuteSummary: 'Most accessible location in Berkeley. Direct BART access, multiple garages, and bike lanes make every transport mode viable.',
    affordabilityScore: 94,
    accessibilityDetails: 'ADA compliant building. Elevator access on all floors. Accessible BART station with elevators. ADA parking spaces in both nearby garages.',
    remote: false,
  },
  {
    id: 3, type: 'event',
    title: 'Tech Networking Night', org: 'East Bay Startup Hub',
    location: '2476 Telegraph Ave, Berkeley', salary: 'Free admission',
    travelMin: 12, parkingNearby: 22, parkingCost: '$2.50/hr',
    transitOption: 'AC Transit 51B · 2-min walk',
    accessibilityScore: 74, parkingDifficulty: 'moderate',
    tags: ['This Friday 6pm', 'Networking', 'Free Food'],
    recommendedTransport: 'Transit or Rideshare',
    whyRanked: "Free admission and strong networking value. Moderate parking difficulty means it's best reached by transit on a Friday evening when meters are often free.",
    nearbyParking: ['Telegraph/Channing Garage — $2/hr, 54 spots', 'Street meters on Channing — free after 6pm', 'Bancroft Structure — 0.4 mi, $3.50/hr'],
    transitDetails: ['AC Transit 51B — 2-min walk from stop', 'BART Downtown Berkeley — 12-min walk or 5-min 51B ride', 'Lyft/Uber typically $8–12 from campus Fri evening'],
    walkingDistance: '0.3 mi from nearest BART bus connection',
    commuteSummary: 'Evening event — street meters often free after 6pm. Transit is easiest. Telegraph/Channing Garage is the best paid option if driving.',
    affordabilityScore: 72,
    accessibilityDetails: 'Street-level venue with accessible entrance. Nearest ADA parking in Telegraph/Channing Garage (0.1 mi). Check with organizer for elevator access at venue.',
    remote: false,
  },
  {
    id: 4, type: 'internship',
    title: 'UX Design Intern', org: 'Urban Mobility Co.',
    location: '1919 Addison St, Berkeley', salary: '$28/hr',
    travelMin: 10, parkingNearby: 29, parkingCost: '$3/hr',
    transitOption: 'BART Downtown Berkeley · 5-min walk',
    accessibilityScore: 82, parkingDifficulty: 'easy',
    tags: ['Summer 2025', 'Paid', 'Design Portfolio'],
    recommendedTransport: 'BART or bike',
    whyRanked: 'Paid internship with above-average accessibility. Easy transit via BART, plus the office has its own bike storage room and shower facilities for cyclists.',
    nearbyParking: ['Addison St garage — $3/hr, 45 spots', 'BART garage — 420 spots, $2/hr (0.4 mi)', 'Oxford St meters — $1.25/hr'],
    transitDetails: ['BART Downtown Berkeley — 5-min walk', 'AC Transit 18 along Sacramento St', 'Bay Wheels bike share docks 0.1 mi away'],
    walkingDistance: '0.4 mi from BART (5-min walk)',
    commuteSummary: 'Easy BART commute or bike ride from campus. Office has secure bike storage. Nearby paid parking if driving.',
    affordabilityScore: 80,
    accessibilityDetails: 'ADA accessible building with elevator to all floors. Accessible parking in Addison St garage. BART station is ADA compliant.',
    remote: false,
  },
  {
    id: 5, type: 'volunteer',
    title: 'Food Bank Volunteer', org: 'Alameda County Community Food Bank',
    location: '7900 Edgewater Dr, Oakland', salary: 'Volunteer',
    travelMin: 22, parkingNearby: 55, parkingCost: 'Free on-site',
    transitOption: 'AC Transit 57 · 5-min walk',
    accessibilityScore: 84, parkingDifficulty: 'easy',
    tags: ['Weekends', 'Flexible Hours', 'Community Impact'],
    recommendedTransport: 'Drive or carpool',
    whyRanked: 'Free on-site parking and flexible weekend hours make this one of the easiest volunteer opportunities to reach. High community impact score elevates its ranking.',
    nearbyParking: ['Free on-site parking — 55+ spaces', 'Edgewater Dr street parking — free', 'AC Transit access from Lake Merritt BART'],
    transitDetails: ['BART Lake Merritt → AC Transit 57 (25-min total)', 'Free parking on-site for volunteers', 'Carpool signup available on org website'],
    walkingDistance: '0.3 mi from AC Transit stop',
    commuteSummary: 'Drive and park free on-site. Transit takes 25 min from Berkeley via BART + AC Transit. Carpool program available.',
    affordabilityScore: 96,
    accessibilityDetails: 'ADA accessible facility with large accessible parking area. Loading dock access for volunteers with mobility needs. Contact org to arrange accommodations.',
    remote: false,
  },
  {
    id: 6, type: 'healthcare',
    title: 'Patient Care Assistant', org: 'Alta Bates Summit Medical Center',
    location: '2450 Ashby Ave, Berkeley', salary: '$24–$30/hr',
    travelMin: 14, parkingNearby: 71, parkingCost: '$3/hr (staff discount)',
    transitOption: 'AC Transit 18 · 1-min walk',
    accessibilityScore: 91, parkingDifficulty: 'easy',
    tags: ['Full-time', 'Benefits', 'Healthcare'],
    recommendedTransport: 'Transit or drive',
    whyRanked: 'Hospital campus has dedicated staff parking with discounts, and multiple transit lines stop at the main entrance. Highest parking availability of any healthcare listing.',
    nearbyParking: ['Alta Bates Staff Garage — $3/hr (discount)', 'Ashby Ave surface lot — 71 spaces', 'Claremont Ave meters — $1.25/hr'],
    transitDetails: ['AC Transit 18 — stop at main entrance', 'BART Ashby station — 0.8 mi walk or short bus', 'Free employee shuttle from BART Ashby (check HR)'],
    walkingDistance: '0.8 mi from Ashby BART (or take shuttle)',
    commuteSummary: 'Easiest healthcare commute in the dataset. Staff parking discount, multiple bus lines to the door, and a free HR shuttle from BART Ashby.',
    affordabilityScore: 86,
    accessibilityDetails: 'Full ADA compliance across entire medical campus. Accessible parking on every garage level. Shuttle service is wheelchair accessible.',
    remote: false,
  },
  {
    id: 7, type: 'job',
    title: 'Product Manager (Remote)', org: 'CloudBase Inc.',
    location: 'Remote — Anywhere', salary: '$130k–$175k',
    travelMin: 0, parkingNearby: 0, parkingCost: 'N/A — remote',
    transitOption: 'No commute required',
    accessibilityScore: 100, parkingDifficulty: 'easy',
    tags: ['Fully Remote', 'Full-time', 'Equity'],
    recommendedTransport: 'No commute',
    whyRanked: 'Perfect accessibility score — no commute, no parking cost, and no transportation barrier of any kind. Highest accessibility of all listings.',
    nearbyParking: ['No commute required — work from home or any location'],
    transitDetails: ['No commute required', 'Occasional in-person meetings — expense reimbursed', 'Home office stipend provided'],
    walkingDistance: 'N/A',
    commuteSummary: 'Fully remote. No transportation cost or time. Occasional travel reimbursed.',
    affordabilityScore: 100,
    accessibilityDetails: 'Fully accessible — work from any location. Company provides ergonomic home office equipment upon request.',
    remote: true,
  },
]

const TYPE_FILTERS = [
  { id: 'all', label: 'All Types' },
  { id: 'job', label: 'Jobs' },
  { id: 'class', label: 'Classes' },
  { id: 'event', label: 'Events' },
  { id: 'internship', label: 'Internships' },
  { id: 'volunteer', label: 'Volunteer' },
  { id: 'networking', label: 'Networking' },
  { id: 'healthcare', label: 'Healthcare' },
]

const ACCESS_FILTERS = [
  { id: 'easy_parking', label: 'Easy Parking' },
  { id: 'near_transit', label: 'Near Transit' },
  { id: 'low_cost', label: 'Low-Cost Access' },
  { id: 'accessible_routes', label: 'Accessible Routes' },
  { id: 'student_friendly', label: 'Student Friendly' },
  { id: 'within_10', label: 'Under 10 Min' },
  { id: 'remote', label: 'Remote Options' },
]

const ICONS: Record<string, React.ElementType> = {
  job: Briefcase, class: GraduationCap, event: Calendar,
  internship: Briefcase, volunteer: Heart, networking: Users, healthcare: Stethoscope,
}

const TYPE_COLORS: Record<string, string> = {
  job: 'bg-blue-100 text-blue-700',
  class: 'bg-violet-100 text-violet-700',
  event: 'bg-orange-100 text-orange-700',
  internship: 'bg-amber-100 text-amber-700',
  volunteer: 'bg-pink-100 text-pink-700',
  networking: 'bg-teal-100 text-teal-700',
  healthcare: 'bg-green-100 text-green-700',
}

const DIFF: Record<string, { label: string; cls: string }> = {
  easy: { label: 'Easy parking', cls: 'text-green-700 bg-green-50 border-green-200' },
  moderate: { label: 'Some difficulty', cls: 'text-yellow-700 bg-yellow-50 border-yellow-200' },
  hard: { label: 'Hard to park', cls: 'text-red-700 bg-red-50 border-red-200' },
}

function ScoreBadge({ score, label }: { score: number; label: string }) {
  const color = score >= 90 ? 'text-green-700 bg-green-100' : score >= 75 ? 'text-amber-700 bg-amber-100' : 'text-red-600 bg-red-100'
  return (
    <div className={`text-center px-3 py-2 rounded-xl ${color}`}>
      <div className="text-lg font-bold leading-none">{score}</div>
      <div className="text-xs font-semibold mt-0.5 opacity-80">{label}</div>
    </div>
  )
}

export default function Opportunities() {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [activeType, setActiveType] = useState('all')
  const [activeAccessFilters, setActiveAccessFilters] = useState<Set<string>>(new Set())
  const [saved, setSaved] = useState<number[]>([])
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const toggleAccessFilter = (id: string) => {
    setActiveAccessFilters(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const filtered = useMemo(() => {
    let opps = OPPORTUNITIES.filter(o =>
      (activeType === 'all' || o.type === activeType) &&
      (o.title.toLowerCase().includes(query.toLowerCase()) ||
        o.org.toLowerCase().includes(query.toLowerCase()))
    )
    if (activeAccessFilters.has('easy_parking')) opps = opps.filter(o => o.parkingDifficulty === 'easy')
    if (activeAccessFilters.has('near_transit')) opps = opps.filter(o => o.travelMin <= 15)
    if (activeAccessFilters.has('low_cost')) opps = opps.filter(o => o.affordabilityScore >= 80)
    if (activeAccessFilters.has('accessible_routes')) opps = opps.filter(o => o.accessibilityScore >= 85)
    if (activeAccessFilters.has('student_friendly')) opps = opps.filter(o => o.tags.some(t => t.toLowerCase().includes('student') || t.toLowerCase().includes('part-time') || t.toLowerCase().includes('intern')))
    if (activeAccessFilters.has('within_10')) opps = opps.filter(o => o.travelMin <= 10)
    if (activeAccessFilters.has('remote')) opps = opps.filter(o => o.remote)
    return opps.sort((a, b) => b.accessibilityScore - a.accessibilityScore)
  }, [query, activeType, activeAccessFilters])

  const toggleSave = (id: number) =>
    setSaved(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground tracking-tight">Opportunity Discovery</h1>
        <p className="text-muted-foreground mt-1.5 text-base">
          Jobs, classes, events, and more — ranked by how accessible they actually are from where you are.
        </p>
      </div>

      {/* Search */}
      <div className="bg-card rounded-2xl border border-border p-5 space-y-3 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="Your location (e.g. Berkeley, CA)"
              className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by title or organization..."
              className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      </div>

      {/* Type filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {TYPE_FILTERS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveType(t.id)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
              activeType === t.id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Access filters */}
      <div className="bg-card rounded-2xl border border-border p-4 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Accessibility Filters</span>
          {activeAccessFilters.size > 0 && (
            <button
              onClick={() => setActiveAccessFilters(new Set())}
              className="text-xs text-red-600 font-semibold hover:text-red-700"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {ACCESS_FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => toggleAccessFilter(f.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                activeAccessFilters.has(f.id)
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'bg-background border-border text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-primary/5'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground font-medium">
          {filtered.length} result{filtered.length !== 1 ? 's' : ''} · Sorted by accessibility score
        </p>
        {(activeAccessFilters.size > 0 || activeType !== 'all') && (
          <button
            onClick={() => { setActiveAccessFilters(new Set()); setActiveType('all') }}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Reset all filters
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-muted-foreground opacity-40" />
          </div>
          <p className="font-semibold text-foreground mb-1">No opportunities found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(opp => {
            const Icon = ICONS[opp.type] || Briefcase
            const diff = DIFF[opp.parkingDifficulty]
            const isSaved = saved.includes(opp.id)
            const isExpanded = expandedId === opp.id
            const typeColor = TYPE_COLORS[opp.type] || 'bg-secondary text-muted-foreground'
            return (
              <div
                key={opp.id}
                className={`bg-card rounded-2xl border transition-all duration-200 ${
                  isExpanded ? 'border-primary/40 shadow-lg' : 'border-border hover:border-primary/25 hover:shadow-md'
                }`}
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${typeColor}`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <h3 className="font-display font-bold text-foreground text-base">{opp.title}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${typeColor}`}>{opp.type}</span>
                            {opp.remote && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold flex items-center gap-0.5">
                                <Wifi className="w-3 h-3" /> Remote
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-medium text-muted-foreground">{opp.org}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <ScoreBadge score={opp.accessibilityScore} label="Access" />
                          <button
                            onClick={() => toggleSave(opp.id)}
                            className={`p-2 rounded-xl transition-all ${isSaved ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:bg-secondary'}`}
                          >
                            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2.5 mb-3">
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MapPin className="w-3.5 h-3.5" />{opp.location}
                        </span>
                        {!opp.remote && (
                          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock className="w-3.5 h-3.5" />{opp.travelMin} min travel
                          </span>
                        )}
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                          <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />{opp.salary}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {opp.tags.map(tag => (
                          <span key={tag} className="text-xs px-2.5 py-0.5 bg-secondary text-muted-foreground rounded-full font-medium">{tag}</span>
                        ))}
                      </div>

                      {!opp.remote && (
                        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
                          <div className="flex items-start gap-2">
                            <Car className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                            <div>
                              <p className="text-xs font-semibold text-foreground">{opp.parkingNearby} spots nearby · {opp.parkingCost}</p>
                              <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full border ${diff.cls}`}>{diff.label}</span>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Train className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                            <div>
                              <p className="text-xs font-semibold text-foreground">{opp.recommendedTransport}</p>
                              <p className="text-xs text-muted-foreground">{opp.transitOption}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-3">
                        <p className="text-xs text-muted-foreground italic line-clamp-1 max-w-[60%]">{opp.whyRanked.split('.')[0]}.</p>
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : opp.id)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:opacity-80 transition-all shrink-0"
                        >
                          {isExpanded ? 'Collapse' : 'Full breakdown'}
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Panel */}
                {isExpanded && (
                  <div className="border-t border-border p-5 space-y-6 bg-slate-50/60 rounded-b-2xl">
                    <div>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Why Wayve Ranks This Highly</h4>
                      <p className="text-sm text-foreground leading-relaxed">{opp.whyRanked}</p>
                    </div>

                    {/* Score breakdown */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-card rounded-xl border border-border p-4 text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <Accessibility className="w-4 h-4 text-purple-600" />
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Accessibility</span>
                        </div>
                        <div className="text-2xl font-bold text-foreground">{opp.accessibilityScore}<span className="text-base font-normal text-muted-foreground">/100</span></div>
                        <div className="mt-2 h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500 rounded-full" style={{ width: `${opp.accessibilityScore}%` }} />
                        </div>
                      </div>
                      <div className="bg-card rounded-xl border border-border p-4 text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <Star className="w-4 h-4 text-amber-500" />
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Affordability</span>
                        </div>
                        <div className="text-2xl font-bold text-foreground">{opp.affordabilityScore}<span className="text-base font-normal text-muted-foreground">/100</span></div>
                        <div className="mt-2 h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${opp.affordabilityScore}%` }} />
                        </div>
                      </div>
                    </div>

                    {!opp.remote && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
                            <Car className="w-3.5 h-3.5" /> Parking Nearby
                          </h4>
                          <ul className="space-y-1.5">
                            {opp.nearbyParking.map((p, i) => (
                              <li key={i} className="text-sm text-foreground flex items-start gap-2">
                                <span className="text-primary font-bold mt-0.5 shrink-0">·</span>{p}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
                            <Train className="w-3.5 h-3.5" /> Transit Options
                          </h4>
                          <ul className="space-y-1.5">
                            {opp.transitDetails.map((t, i) => (
                              <li key={i} className="text-sm text-foreground flex items-start gap-2">
                                <span className="text-primary font-bold mt-0.5 shrink-0">·</span>{t}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Commute Summary</h4>
                      <div className="bg-card border border-border rounded-xl p-4">
                        <p className="text-sm text-foreground leading-relaxed">{opp.commuteSummary}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
                        <Accessibility className="w-3.5 h-3.5" /> Accessibility Information
                      </h4>
                      <p className="text-sm text-foreground leading-relaxed bg-purple-50 border border-purple-100 rounded-xl px-4 py-3">{opp.accessibilityDetails}</p>
                    </div>

                    <div className="flex gap-3 pt-1">
                      <button className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm">
                        <ChevronRight className="w-4 h-4" /> Apply / Learn More
                      </button>
                      <button
                        onClick={() => toggleSave(opp.id)}
                        className={`px-5 py-2.5 border rounded-xl text-sm font-semibold transition-all ${
                          isSaved ? 'bg-primary/10 border-primary/30 text-primary' : 'border-border text-muted-foreground hover:bg-secondary'
                        }`}
                      >
                        {isSaved ? 'Saved ✓' : 'Save'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
