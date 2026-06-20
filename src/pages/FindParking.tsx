import { useState, useMemo } from 'react'
import {
  Search, MapPin, Clock, Car, Train, Bike, ChevronRight, ChevronDown,
  RotateCcw, Sparkles, Shield, DollarSign, AlertTriangle, Navigation,
  Accessibility, Zap, X
} from 'lucide-react'

type AvailabilityLevel = 'high' | 'medium' | 'low'
type ParkingType = 'Garage' | 'Street' | 'Surface Lot'
type SearchEntry = { destination: string; arrivalTime: string; mode: string }

type ParkingOption = {
  id: number; name: string; type: ParkingType
  spots: number; totalSpots: number; distanceMi: number; walkMin: number
  priceLabel: string; priceHr: number; availability: AvailabilityLevel
  confidence: number; accessible: boolean; evCharging: boolean
  wellLit: boolean; covered: boolean; bestFor: string[]
  permitRequired: string; recommendation: string
  predictedAvail: { time: string; pct: number }[]
  costBreakdown: string[]; walkingRoute: string
  risks: string[]; backupOption: string
}

const BERKELEY_OPTIONS: ParkingOption[] = [
  {
    id: 1, name: 'Lower Hearst Structure', type: 'Garage',
    spots: 42, totalSpots: 120, distanceMi: 0.2, walkMin: 4,
    priceLabel: '$3/hr', priceHr: 3, availability: 'high', confidence: 91,
    accessible: true, evCharging: false, wellLit: true, covered: true,
    bestFor: ['Closest', 'ADA Accessible'],
    permitRequired: 'Visitor permit required 7am–5pm weekdays',
    recommendation: 'Closest covered garage to central campus with ADA elevators and consistent high availability. Ideal for quick visits or medical appointments at the Tang Center.',
    predictedAvail: [{ time: 'Now', pct: 65 }, { time: '+30m', pct: 58 }, { time: '+1hr', pct: 52 }, { time: '+2hr', pct: 71 }],
    costBreakdown: ['$3/hr × 2 hrs = $6.00', 'Daily max cap: $18.00', 'Free with valid blue permit after 5pm'],
    walkingRoute: 'Exit via Hearst Ave ramp → signaled crosswalk → 4-min walk south to Sather Gate',
    risks: ['Heavy traffic during class changes (9am, 11am, 1pm)', 'Limited spots Tue/Thu 9–11am due to large lectures'],
    backupOption: 'RSF Garage (0.3 mi), typically 30+ spots open, EV charging on Level 1',
  },
  {
    id: 2, name: 'RSF Garage', type: 'Garage',
    spots: 38, totalSpots: 95, distanceMi: 0.3, walkMin: 6,
    priceLabel: '$2/hr (free w/ permit)', priceHr: 2, availability: 'high', confidence: 87,
    accessible: true, evCharging: true, wellLit: true, covered: true,
    bestFor: ['Student Permit', 'EV Charging', 'Most Reliable'],
    permitRequired: 'Red/Gold permit required 7am–5pm weekdays',
    recommendation: 'Best for student permit holders and EV drivers. Adjacent to the Recreational Sports Facility with a safe, well-lit route through campus.',
    predictedAvail: [{ time: 'Now', pct: 60 }, { time: '+30m', pct: 55 }, { time: '+1hr', pct: 68 }, { time: '+2hr', pct: 72 }],
    costBreakdown: ['$2/hr visitor rate', 'Student permit holders: Free 7am–5pm', 'EV charging: +$0.25/kWh'],
    walkingRoute: 'Exit south → Bancroft Way → north on Telegraph Ave → 6-min to Sproul Plaza',
    risks: ['Gym event nights fill Level 1 quickly after 5pm', 'Permit enforcement strictly Mon–Fri'],
    backupOption: 'Bancroft Structure (0.1 mi south), no EV charging but similar pricing',
  },
  {
    id: 3, name: 'Stadium Parking Garage', type: 'Garage',
    spots: 61, totalSpots: 300, distanceMi: 0.4, walkMin: 8,
    priceLabel: '$4/hr ($25 on game days)', priceHr: 4, availability: 'high', confidence: 78,
    accessible: true, evCharging: false, wellLit: true, covered: true,
    bestFor: ['Event Parking', 'Largest Capacity'],
    permitRequired: 'None, public pay parking',
    recommendation: 'Largest parking structure on the east side of campus. Best choice for Cal games, concerts, and large events when other garages fill quickly.',
    predictedAvail: [{ time: 'Now', pct: 80 }, { time: '+30m', pct: 75 }, { time: '+1hr', pct: 68 }, { time: '+2hr', pct: 55 }],
    costBreakdown: ['$4/hr standard rate', 'Event flat rate: $25 (cash or ParkMobile)', 'Daily max: $32'],
    walkingRoute: 'Exit via Gayley Rd → Stadium Rim Way → 8-min walk west to Campanile Way',
    risks: ['Prices surge 3× on Cal football game days', 'Road closures on Piedmont Ave during major events'],
    backupOption: 'Underhill Parking Garage (0.2 mi), quieter, $2.50/hr',
  },
  {
    id: 4, name: 'Underhill Parking Garage', type: 'Garage',
    spots: 29, totalSpots: 85, distanceMi: 0.5, walkMin: 10,
    priceLabel: '$2.50/hr', priceHr: 2.5, availability: 'medium', confidence: 85,
    accessible: true, evCharging: false, wellLit: true, covered: true,
    bestFor: ['Affordable Garage', 'ADA Accessible'],
    permitRequired: 'G/R/B permit 7am–5pm; metered evenings',
    recommendation: 'Quieter east-side option with consistently lower occupancy. Predictable pricing is ideal for 2–4 hour visits near College Ave.',
    predictedAvail: [{ time: 'Now', pct: 45 }, { time: '+30m', pct: 42 }, { time: '+1hr', pct: 50 }, { time: '+2hr', pct: 58 }],
    costBreakdown: ['$2.50/hr × 3 hrs = $7.50', 'Daily max: $20', 'Evening rate after 5pm: $1.50/hr'],
    walkingRoute: 'Exit east on Channing Way → north on College Ave → 10-min to campus via Durant Gate',
    risks: ['Street closures possible during large campus events', '1st Monday monthly maintenance 8–10am'],
    backupOption: 'Street parking on Durant Ave (0.1 mi), cheaper but 2-hr limit',
  },
  {
    id: 5, name: 'Bancroft Structure', type: 'Garage',
    spots: 35, totalSpots: 110, distanceMi: 0.3, walkMin: 6,
    priceLabel: '$3.50/hr', priceHr: 3.5, availability: 'medium', confidence: 82,
    accessible: false, evCharging: false, wellLit: true, covered: true,
    bestFor: ['South Campus Access'],
    permitRequired: 'Visitor pay-to-park; Level 1 permit-only',
    recommendation: 'Convenient for appointments at Haas School of Business, Sproul Hall, or the south entrance. Avoid Level 1, it is permit-only.',
    predictedAvail: [{ time: 'Now', pct: 48 }, { time: '+30m', pct: 44 }, { time: '+1hr', pct: 40 }, { time: '+2hr', pct: 52 }],
    costBreakdown: ['$3.50/hr visitor rate', 'Daily max: $22', 'No ADA spaces, use Lower Hearst instead'],
    walkingRoute: 'Exit on Bancroft Way → east 1 block → through Telegraph Plaza → 6-min to Sproul Hall',
    risks: ['Fills fast on Sproul protest or rally days', 'Level 1 permit enforcement is very strict'],
    backupOption: 'Lower Hearst Structure (0.1 mi), ADA accessible, slightly cheaper',
  },
  {
    id: 6, name: 'Telegraph/Channing Garage', type: 'Garage',
    spots: 54, totalSpots: 140, distanceMi: 0.6, walkMin: 12,
    priceLabel: '$2/hr', priceHr: 2, availability: 'high', confidence: 88,
    accessible: false, evCharging: false, wellLit: true, covered: true,
    bestFor: ['Cheapest Garage', 'Longer Stays'],
    permitRequired: 'None, public pay garage',
    recommendation: 'Most affordable covered garage near the Telegraph corridor. Great for longer visits to south campus, bookstores, and cafes.',
    predictedAvail: [{ time: 'Now', pct: 72 }, { time: '+30m', pct: 68 }, { time: '+1hr', pct: 62 }, { time: '+2hr', pct: 74 }],
    costBreakdown: ['$2/hr × 3 hrs = $6.00', 'Daily max: $14', 'No hourly minimum charge'],
    walkingRoute: 'Exit on Channing Way → north on Telegraph Ave → 12-min walk to Sather Gate',
    risks: ['Weekend closures possible for Telegraph Ave street fairs, check calendar'],
    backupOption: 'RSF Garage (0.3 mi north), $2/hr with EV charging, closer to campus core',
  },
  {
    id: 7, name: 'Downtown Berkeley BART Garage', type: 'Garage',
    spots: 89, totalSpots: 420, distanceMi: 0.8, walkMin: 16,
    priceLabel: '$2/hr (1st hr free w/ BART)', priceHr: 2, availability: 'high', confidence: 93,
    accessible: true, evCharging: true, wellLit: true, covered: true,
    bestFor: ['Most Reliable', 'Transit Hub', 'EV Charging'],
    permitRequired: 'None, public BART parking',
    recommendation: 'Highest confidence rating due to massive capacity, this garage almost never fills. BART validation gives the first hour free. Perfect when you need a guaranteed spot.',
    predictedAvail: [{ time: 'Now', pct: 79 }, { time: '+30m', pct: 75 }, { time: '+1hr', pct: 70 }, { time: '+2hr', pct: 80 }],
    costBreakdown: ['First hour free with BART validation', '$2/hr thereafter', 'Daily max: $16', 'EV charging: +$0.20/kWh'],
    walkingRoute: 'Exit on Center St → east on University Ave → 16-min walk to Sather Gate; or AC Transit 51B (5-min ride)',
    risks: ['Rare overflow on Cal football game days, otherwise consistently available year-round'],
    backupOption: 'Free street parking on Shattuck Ave available after 6pm and on Sundays',
  },
  {
    id: 8, name: 'Street Parking – Durant Ave', type: 'Street',
    spots: 3, totalSpots: 18, distanceMi: 0.2, walkMin: 4,
    priceLabel: '$1.25/hr (2-hr max)', priceHr: 1.25, availability: 'low', confidence: 62,
    accessible: false, evCharging: false, wellLit: true, covered: false,
    bestFor: ['Cheapest Option', 'Quick Stops'],
    permitRequired: 'None, metered public street parking',
    recommendation: 'Cheapest option if you can snag a spot. The 2-hour meter limit makes it best for short errands. Spots turn over frequently near the Ave corridor.',
    predictedAvail: [{ time: 'Now', pct: 17 }, { time: '+30m', pct: 22 }, { time: '+1hr', pct: 28 }, { time: '+2hr', pct: 33 }],
    costBreakdown: ['$1.25/hr × 2 hrs = $2.50 maximum', '2-hour limit enforced 9am–6pm Mon–Sat', 'Free evenings after 6pm and all day Sunday'],
    walkingRoute: 'Park anywhere on Durant between Telegraph and Bowditch → 4-min walk north to Sather Gate',
    risks: ['Only 17% chance of an open spot right now', 'Active meter enforcement Mon–Sat 9am–6pm', 'Street cleaning Thursdays 8–10am, $75 citation risk'],
    backupOption: 'Telegraph/Channing Garage (0.1 mi south), $2/hr covered, 72% availability',
  },
  {
    id: 9, name: 'Street Parking – Hearst Ave', type: 'Street',
    spots: 6, totalSpots: 22, distanceMi: 0.15, walkMin: 3,
    priceLabel: '$1.25/hr (2-hr max)', priceHr: 1.25, availability: 'medium', confidence: 70,
    accessible: false, evCharging: false, wellLit: false, covered: false,
    bestFor: ['Closest Street Option'],
    permitRequired: 'None, metered street parking',
    recommendation: 'Closest street parking to north campus. Good morning turnover. Not recommended after dark due to limited lighting along this stretch.',
    predictedAvail: [{ time: 'Now', pct: 27 }, { time: '+30m', pct: 31 }, { time: '+1hr', pct: 35 }, { time: '+2hr', pct: 40 }],
    costBreakdown: ['$1.25/hr × 2 hrs = $2.50', 'Free weekends and after 6pm', '2-hour limit Mon–Sat 9am–6pm'],
    walkingRoute: 'Park between Ellsworth and Shattuck → cross at Hearst/Euclid → 3-min to north gate',
    risks: ['Low lighting, not recommended after dark', 'Street cleaning Mondays 8–10am, $75 citation risk', 'Have a backup plan: moderate availability only'],
    backupOption: 'Lower Hearst Structure (0.1 mi east), covered, well-lit, ADA accessible',
  },
  {
    id: 10, name: 'Street Parking – College Ave', type: 'Street',
    spots: 11, totalSpots: 30, distanceMi: 0.5, walkMin: 10,
    priceLabel: '$1/hr (no time limit)', priceHr: 1, availability: 'high', confidence: 75,
    accessible: false, evCharging: false, wellLit: true, covered: false,
    bestFor: ['Cheapest Long Stay'],
    permitRequired: 'None, metered, no time limit enforced',
    recommendation: 'Best street option for stays over 2 hours. No time limit and the lowest hourly rate make this ideal for visitors planning 3–5 hours on campus.',
    predictedAvail: [{ time: 'Now', pct: 63 }, { time: '+30m', pct: 58 }, { time: '+1hr', pct: 54 }, { time: '+2hr', pct: 60 }],
    costBreakdown: ['$1/hr, no time limit', '$3 for 3 hours vs $10.50 in Bancroft Structure', 'Free Mon–Fri before 9am and after 8pm; free all day Sunday'],
    walkingRoute: 'Park between Ashby and Derby → north on College Ave → 10-min to Durant Gate via Bancroft Way',
    risks: ['Longer walk, not ideal in rain or for visitors with mobility needs', 'Early morning spots go fast (7–9am)'],
    backupOption: 'Underhill Parking Garage (0.2 mi west), covered, reliable, $2.50/hr',
  },
]

const MODES = [
  { value: 'standard', label: 'Standard' },
  { value: 'event', label: 'Event Parking' },
  { value: 'commute', label: 'Commute' },
  { value: 'student', label: 'Student' },
  { value: 'accessible', label: 'Accessible' },
]

const ARRIVAL_TIMES = [
  { value: 'now', label: 'Arriving Now' },
  { value: '15', label: 'In 15 min' },
  { value: '30', label: 'In 30 min' },
  { value: '60', label: 'In 1 hour' },
  { value: '120', label: 'In 2 hours' },
]

const FILTER_GROUPS = [
  {
    label: 'Sort By',
    filters: [
      { id: 'cheapest', label: 'Cheapest' },
      { id: 'closest', label: 'Closest' },
      { id: 'most_available', label: 'Most Available' },
    ],
  },
  {
    label: 'Type',
    filters: [
      { id: 'public_only', label: 'Public Only' },
      { id: 'no_street', label: 'Avoid Street' },
      { id: 'event', label: 'Event Parking' },
    ],
  },
  {
    label: 'Permit',
    filters: [
      { id: 'student', label: 'Student Permit' },
      { id: 'faculty', label: 'Faculty/Staff' },
    ],
  },
  {
    label: 'Features',
    filters: [
      { id: 'ada', label: 'ADA Accessible' },
      { id: 'ev', label: 'EV Charging' },
      { id: 'covered', label: 'Covered Garage' },
      { id: 'well_lit', label: 'Well-Lit Route' },
    ],
  },
]


function makeSeed(s: string) {
  return s.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
}

function isBerkeley(dest: string) {
  const d = dest.toLowerCase()
  return d.includes('berkeley') || d.includes('cal berkeley') || d.includes('uc berkeley')
}

function getGenericOptions(destination: string): ParkingOption[] {
  const n = makeSeed(destination)
  const name = destination.split(',')[0]
  return [
    {
      id: 1, name: `${name} Main Parking Garage`, type: 'Garage',
      spots: 15 + (n % 45), totalSpots: 80 + (n % 60), distanceMi: 0.2, walkMin: 4,
      priceLabel: `$${3 + (n % 5)}/hr`, priceHr: 3 + (n % 5), availability: 'high', confidence: 88,
      accessible: true, evCharging: false, wellLit: true, covered: true,
      bestFor: ['Closest', 'Most Reliable'],
      permitRequired: 'Visitor parking available, pay at kiosk',
      recommendation: `Closest covered option to ${name}. Consistent availability and ADA access make it the default recommendation.`,
      predictedAvail: [{ time: 'Now', pct: 65 }, { time: '+30m', pct: 60 }, { time: '+1hr', pct: 58 }, { time: '+2hr', pct: 72 }],
      costBreakdown: [`$${3 + (n % 5)}/hr visitor rate`, 'Daily max cap varies by lot'],
      walkingRoute: `Exit and follow signs toward ${name} main entrance, approximately 4-min walk`,
      risks: ['Busy during peak hours and events'],
      backupOption: 'Surface lot nearby, lower rate, further walk',
    },
    {
      id: 2, name: 'Street Parking (Nearest Block)', type: 'Street',
      spots: 2 + (n % 9), totalSpots: 15 + (n % 12), distanceMi: 0.1, walkMin: 2,
      priceLabel: `$${1 + (n % 3)}/hr`, priceHr: 1 + (n % 3), availability: 'low', confidence: 58,
      accessible: false, evCharging: false, wellLit: false, covered: false,
      bestFor: ['Cheapest'],
      permitRequired: 'Metered street parking, check posted signs',
      recommendation: 'Cheapest option if you can get a spot. Low availability means you need a solid backup.',
      predictedAvail: [{ time: 'Now', pct: 20 }, { time: '+30m', pct: 25 }, { time: '+1hr', pct: 30 }, { time: '+2hr', pct: 35 }],
      costBreakdown: [`$${1 + (n % 3)}/hr metered`, 'Check posted signs for time limits'],
      walkingRoute: 'Short 2-min walk along main street to destination',
      risks: ['Very limited availability', 'Active meter enforcement during business hours'],
      backupOption: 'Use the main parking garage for reliability',
    },
    {
      id: 3, name: 'Central Parking Lot', type: 'Surface Lot',
      spots: 30 + (n % 55), totalSpots: 100 + (n % 80), distanceMi: 0.3, walkMin: 6,
      priceLabel: `$${2 + (n % 4)}/hr`, priceHr: 2 + (n % 4), availability: 'medium', confidence: 76,
      accessible: true, evCharging: false, wellLit: true, covered: false,
      bestFor: ['Good Availability'],
      permitRequired: 'None, pay-to-park surface lot',
      recommendation: 'Reliable surface lot with good turnover. Well-lit but no cover, plan for weather.',
      predictedAvail: [{ time: 'Now', pct: 50 }, { time: '+30m', pct: 45 }, { time: '+1hr', pct: 55 }, { time: '+2hr', pct: 62 }],
      costBreakdown: [`$${2 + (n % 4)}/hr`, 'No daily maximum'],
      walkingRoute: '6-min walk to main entrance along designated pedestrian path',
      risks: ['No covered parking, bring an umbrella in poor weather'],
      backupOption: 'Main garage is the closest covered alternative',
    },
    {
      id: 4, name: 'Civic Parking Garage', type: 'Garage',
      spots: 8 + (n % 20), totalSpots: 50 + (n % 40), distanceMi: 0.6, walkMin: 12,
      priceLabel: `$${3 + (n % 5)}/hr`, priceHr: 3 + (n % 5), availability: 'high', confidence: 83,
      accessible: true, evCharging: true, wellLit: true, covered: true,
      bestFor: ['EV Charging', 'ADA Accessible'],
      permitRequired: 'None, public garage',
      recommendation: 'Further walk but great for EV drivers and anyone needing ADA access.',
      predictedAvail: [{ time: 'Now', pct: 70 }, { time: '+30m', pct: 65 }, { time: '+1hr', pct: 72 }, { time: '+2hr', pct: 78 }],
      costBreakdown: [`$${3 + (n % 5)}/hr`, 'EV charging included in rate'],
      walkingRoute: '12-min walk via main street, flat, paved route',
      risks: ['Longer walk may not suit time-sensitive arrivals'],
      backupOption: 'Main garage is closer but lacks EV charging',
    },
  ]
}

const AVAIL = {
  high: { badge: 'bg-green-100 text-green-700', bar: 'bg-green-500', label: 'High' },
  medium: { badge: 'bg-yellow-100 text-yellow-700', bar: 'bg-yellow-500', label: 'Med' },
  low: { badge: 'bg-red-100 text-red-700', bar: 'bg-red-500', label: 'Low' },
}

const BEST_FOR_COLORS: Record<string, string> = {
  'Closest': 'bg-blue-100 text-blue-700',
  'Closest Street Option': 'bg-blue-100 text-blue-700',
  'ADA Accessible': 'bg-purple-100 text-purple-700',
  'Affordable Garage': 'bg-purple-100 text-purple-700',
  'EV Charging': 'bg-cyan-100 text-cyan-700',
  'Student Permit': 'bg-amber-100 text-amber-700',
  'Most Reliable': 'bg-indigo-100 text-indigo-700',
  'Transit Hub': 'bg-sky-100 text-sky-700',
  'Event Parking': 'bg-orange-100 text-orange-700',
  'Largest Capacity': 'bg-orange-100 text-orange-700',
  'Cheapest Garage': 'bg-green-100 text-green-700',
  'Cheapest Option': 'bg-green-100 text-green-700',
  'Cheapest Long Stay': 'bg-green-100 text-green-700',
  'Cheapest': 'bg-green-100 text-green-700',
  'South Campus Access': 'bg-slate-100 text-slate-700',
  'Longer Stays': 'bg-teal-100 text-teal-700',
  'Quick Stops': 'bg-rose-100 text-rose-700',
  'Good Availability': 'bg-emerald-100 text-emerald-700',
  'Good Availability ': 'bg-emerald-100 text-emerald-700',
}

export default function FindParking() {
  const [destination, setDestination] = useState('')
  const [arrivalTime, setArrivalTime] = useState('now')
  const [mode, setMode] = useState('standard')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SearchEntry | null>(null)
  const [recent, setRecent] = useState<SearchEntry[]>([])
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set())

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!destination.trim()) return
    setLoading(true)
    setResult(null)
    setExpandedId(null)
    setActiveFilters(new Set())
    const entry: SearchEntry = { destination: destination.trim(), arrivalTime, mode }
    setTimeout(() => {
      setResult(entry)
      setRecent(prev => [entry, ...prev.filter(r => r.destination !== entry.destination)].slice(0, 5))
      setLoading(false)
    }, 1600)
  }

  const runRecent = (s: SearchEntry) => {
    setDestination(s.destination)
    setArrivalTime(s.arrivalTime)
    setMode(s.mode)
    setLoading(true)
    setResult(null)
    setExpandedId(null)
    setTimeout(() => { setResult(s); setLoading(false) }, 1600)
  }

  const toggleFilter = (id: string) => {
    setActiveFilters(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const rawOptions = useMemo(() => {
    if (!result) return []
    return isBerkeley(result.destination) ? BERKELEY_OPTIONS : getGenericOptions(result.destination)
  }, [result])

  const filteredOptions = useMemo(() => {
    let opts = [...rawOptions]
    if (activeFilters.has('ada')) opts = opts.filter(o => o.accessible)
    if (activeFilters.has('ev')) opts = opts.filter(o => o.evCharging)
    if (activeFilters.has('covered')) opts = opts.filter(o => o.covered)
    if (activeFilters.has('well_lit')) opts = opts.filter(o => o.wellLit)
    if (activeFilters.has('no_street')) opts = opts.filter(o => o.type !== 'Street')
    if (activeFilters.has('event')) opts = opts.filter(o => o.bestFor.some(b => b.toLowerCase().includes('event')))
    if (activeFilters.has('student')) opts = opts.filter(o =>
      o.permitRequired.toLowerCase().includes('student') ||
      o.bestFor.some(b => b.toLowerCase().includes('student'))
    )
    if (activeFilters.has('public_only')) opts = opts.filter(o =>
      o.permitRequired.toLowerCase().includes('none') ||
      o.permitRequired.toLowerCase().includes('visitor') ||
      o.permitRequired.toLowerCase().includes('public') ||
      o.permitRequired.toLowerCase().includes('metered')
    )
    if (activeFilters.has('cheapest')) opts = [...opts].sort((a, b) => a.priceHr - b.priceHr)
    else if (activeFilters.has('closest')) opts = [...opts].sort((a, b) => a.distanceMi - b.distanceMi)
    else if (activeFilters.has('most_available')) opts = [...opts].sort((a, b) => (b.spots / b.totalSpots) - (a.spots / a.totalSpots))
    return opts
  }, [rawOptions, activeFilters])

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground tracking-tight">Find Parking</h1>
        <p className="text-muted-foreground mt-1.5 text-base">
          AI-powered predictions for any destination, check availability, permits, and cost before you go.
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="bg-card rounded-2xl border border-border p-6 shadow-sm space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Destination</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={destination}
                onChange={e => setDestination(e.target.value)}
                placeholder="Try: University of California, Berkeley"
                className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Arrival Time</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <select
                value={arrivalTime}
                onChange={e => setArrivalTime(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
              >
                {ARRIVAL_TIMES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Search Mode</label>
            <div className="relative">
              <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <select
                value={mode}
                onChange={e => setMode(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
              >
                {MODES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {MODES.map(m => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMode(m.value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                mode === m.value
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'bg-background border-border text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={!destination.trim() || loading}
          className="w-full bg-primary hover:opacity-90 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-semibold py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2 shadow-sm"
        >
          <Search className="w-4 h-4" />
          {loading ? 'Finding best options...' : 'Find Parking'}
        </button>
      </form>

      {/* Loading */}
      {loading && (
        <div className="bg-card rounded-2xl border border-border p-14 text-center shadow-sm">
          <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin mx-auto mb-5" />
          <p className="font-semibold text-foreground text-base">
            Analyzing parking near <span className="text-primary">{destination}</span>
          </p>
          <p className="text-sm text-muted-foreground mt-1.5">Checking real-time availability, AI predictions, and permit requirements...</p>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-accent" />
              <h2 className="font-display text-xl font-bold text-foreground">
                {filteredOptions.length} Options Near {result.destination.split(',')[0]}
              </h2>
            </div>
            <button
              onClick={() => setResult(null)}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> New search
            </button>
          </div>

          {/* Filter Groups */}
          <div className="bg-card rounded-2xl border border-border p-4 space-y-3 shadow-sm">
            {FILTER_GROUPS.map(group => (
              <div key={group.label} className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide w-16 shrink-0">{group.label}</span>
                <div className="flex flex-wrap gap-2">
                  {group.filters.map(f => (
                    <button
                      key={f.id}
                      onClick={() => toggleFilter(f.id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
                        activeFilters.has(f.id)
                          ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                          : 'bg-background border-border text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-primary/5'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {activeFilters.size > 0 && (
              <div className="pt-1 border-t border-border flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{activeFilters.size} filter{activeFilters.size > 1 ? 's' : ''} active</span>
                <button
                  onClick={() => setActiveFilters(new Set())}
                  className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 transition-colors"
                >
                  <X className="w-3 h-3" /> Clear all
                </button>
              </div>
            )}
          </div>

          {filteredOptions.length === 0 ? (
            <div className="bg-card rounded-2xl border border-border p-12 text-center">
              <p className="text-muted-foreground mb-3">No options match your current filters.</p>
              <button onClick={() => setActiveFilters(new Set())} className="text-sm text-primary font-semibold hover:opacity-80">Clear all filters</button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOptions.map(opt => {
                const avail = AVAIL[opt.availability]
                const availPct = Math.round((opt.spots / opt.totalSpots) * 100)
                const isExpanded = expandedId === opt.id
                return (
                  <div
                    key={opt.id}
                    className={`bg-card rounded-2xl border transition-all duration-200 ${
                      isExpanded ? 'border-primary/40 shadow-lg' : 'border-border hover:border-primary/25 hover:shadow-md'
                    }`}
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <h3 className="font-display font-bold text-foreground text-base">{opt.name}</h3>
                            <span className="text-xs px-2 py-0.5 bg-secondary text-muted-foreground rounded-full font-medium">{opt.type}</span>
                            {opt.covered && <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full border border-slate-200">Covered</span>}
                            {opt.accessible && (
                              <span className="text-xs px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full border border-purple-200 flex items-center gap-0.5">
                                <Accessibility className="w-3 h-3" /> ADA
                              </span>
                            )}
                            {opt.evCharging && (
                              <span className="text-xs px-2 py-0.5 bg-cyan-50 text-cyan-700 rounded-full border border-cyan-200 flex items-center gap-0.5">
                                <Zap className="w-3 h-3" /> EV
                              </span>
                            )}
                            {opt.wellLit && <span className="text-xs px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full border border-amber-200">Well-Lit</span>}
                          </div>

                          <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm mb-3">
                            <span className="flex items-center gap-1.5 text-muted-foreground">
                              <MapPin className="w-3.5 h-3.5" />{opt.distanceMi} mi · {opt.walkMin}-min walk
                            </span>
                            <span className="flex items-center gap-1.5 font-semibold text-foreground">
                              <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />{opt.priceLabel}
                            </span>
                            <span className="flex items-center gap-1.5 text-muted-foreground">
                              <Shield className="w-3.5 h-3.5" />{opt.confidence}% confidence
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-1.5">
                            {opt.bestFor.map(tag => (
                              <span key={tag} className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${BEST_FOR_COLORS[tag] || 'bg-secondary text-muted-foreground'}`}>
                                ★ {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-3xl font-display font-bold text-foreground leading-none">{opt.spots}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">of {opt.totalSpots} spots</div>
                          <div className={`text-xs font-bold mt-2 px-2.5 py-1 rounded-full ${avail.badge}`}>{avail.label} Avail.</div>
                        </div>
                      </div>

                      <div className="mt-3.5">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Availability</span>
                          <span>{availPct}% open</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${avail.bar}`}
                            style={{ width: `${availPct}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                        <p className="text-xs text-muted-foreground truncate max-w-[65%]">{opt.permitRequired}</p>
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : opt.id)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:opacity-80 transition-all shrink-0"
                        >
                          {isExpanded ? 'Collapse' : 'Full details'}
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Panel */}
                    {isExpanded && (
                      <div className="border-t border-border p-5 space-y-6 bg-slate-50/60 rounded-b-2xl">
                        <div>
                          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Why Wayve Recommends This</h4>
                          <p className="text-sm text-foreground leading-relaxed">{opt.recommendation}</p>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">Predicted Availability, Next 2 Hours</h4>
                          <div className="grid grid-cols-4 gap-3">
                            {opt.predictedAvail.map(p => (
                              <div key={p.time} className="text-center">
                                <div className="text-xs font-medium text-muted-foreground mb-2">{p.time}</div>
                                <div className="h-20 bg-secondary rounded-xl overflow-hidden flex items-end">
                                  <div
                                    className={`w-full rounded-xl transition-all ${p.pct >= 60 ? 'bg-green-400' : p.pct >= 35 ? 'bg-yellow-400' : 'bg-red-400'}`}
                                    style={{ height: `${p.pct}%` }}
                                  />
                                </div>
                                <div className="text-sm font-bold mt-2 text-foreground">{p.pct}%</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Cost Breakdown</h4>
                            <ul className="space-y-1.5">
                              {opt.costBreakdown.map((line, i) => (
                                <li key={i} className="text-sm text-foreground flex items-start gap-2">
                                  <span className="text-primary font-bold mt-0.5 shrink-0">·</span>{line}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Walking Route</h4>
                            <p className="text-sm text-foreground leading-relaxed">{opt.walkingRoute}</p>
                          </div>
                        </div>

                        {opt.risks.length > 0 && (
                          <div>
                            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Risks &amp; Restrictions
                            </h4>
                            <div className="space-y-2">
                              {opt.risks.map((risk, i) => (
                                <div key={i} className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2.5 flex items-start gap-2">
                                  <span className="shrink-0 mt-0.5">⚠</span> {risk}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                          <h4 className="text-xs font-bold text-primary uppercase tracking-wide mb-1.5">If This Lot Is Full, Backup Option</h4>
                          <p className="text-sm text-foreground">{opt.backupOption}</p>
                        </div>

                        <div className="flex gap-3 pt-1">
                          <button className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm">
                            <Navigation className="w-4 h-4" /> Navigate Here
                          </button>
                          <button className="px-5 py-2.5 border border-border rounded-xl text-sm font-semibold text-muted-foreground hover:bg-secondary transition-colors">
                            Save
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Smart Alternatives */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            <h2 className="font-display text-lg font-bold text-foreground mb-1">Smart Alternatives</h2>
            <p className="text-sm text-muted-foreground mb-5">Not driving? Other ways to reach {result.destination.split(',')[0]}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { icon: Train, label: 'Transit', detail: 'BART / AC Transit · fastest option', badge: 'Recommended', badgeCls: 'bg-green-100 text-green-700' },
                { icon: Bike, label: 'Bike Share', detail: 'Bay Wheels available nearby · ~8 min', badge: 'Eco-Friendly', badgeCls: 'bg-cyan-100 text-cyan-700' },
                { icon: Navigation, label: 'Walk', detail: `${18 + makeSeed(result.destination) % 10} min from nearest BART station`, badge: 'Free', badgeCls: 'bg-slate-100 text-slate-600' },
              ].map((alt, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-background rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer group">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                    <alt.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-foreground">{alt.label}</p>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${alt.badgeCls}`}>{alt.badge}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{alt.detail}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Searches */}
      {!result && !loading && recent.length > 0 && (
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <h2 className="font-display text-lg font-bold text-foreground mb-4">Recent Searches</h2>
          <div className="space-y-1">
            {recent.map((s, i) => (
              <button
                key={i}
                onClick={() => runRecent(s)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors text-left group"
              >
                <div className="w-9 h-9 bg-secondary group-hover:bg-background rounded-xl flex items-center justify-center shrink-0 transition-colors">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{s.destination}</p>
                  <p className="text-xs text-muted-foreground">
                    {MODES.find(m => m.value === s.mode)?.label} · {ARRIVAL_TIMES.find(t => t.value === s.arrivalTime)?.label}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!result && !loading && recent.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <Car className="w-10 h-10 text-primary opacity-70" />
          </div>
          <p className="font-display text-xl font-bold text-foreground mb-2">Ready to find parking?</p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
            Search any destination, campus, hospital, office, stadium, or city, and get AI-powered parking predictions before you leave.
          </p>
          <button
            onClick={() => setDestination('University of California, Berkeley')}
            className="text-sm text-primary font-semibold hover:underline underline-offset-2"
          >
            Try the Berkeley demo →
          </button>
        </div>
      )}
    </div>
  )
}
