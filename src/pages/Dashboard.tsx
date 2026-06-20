import { useState } from 'react'
import {
  Clock, DollarSign, Leaf, Fuel, Search, Users, TrendingUp, Car,
  MapPin, Award, BarChart3, Zap, Target
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'

const monthlyData = [
  { month: 'Jan', timeSavedMin: 48, moneySaved: 28, co2Lbs: 3.1, searches: 6 },
  { month: 'Feb', timeSavedMin: 74, moneySaved: 41, co2Lbs: 4.8, searches: 9 },
  { month: 'Mar', timeSavedMin: 61, moneySaved: 34, co2Lbs: 3.9, searches: 7 },
  { month: 'Apr', timeSavedMin: 108, moneySaved: 58, co2Lbs: 6.7, searches: 13 },
  { month: 'May', timeSavedMin: 127, moneySaved: 71, co2Lbs: 7.9, searches: 16 },
  { month: 'Jun', timeSavedMin: 163, moneySaved: 89, co2Lbs: 10.2, searches: 21 },
]

const parkingLocations = [
  { name: 'Lower Hearst', uses: 14 },
  { name: 'BART Garage', uses: 11 },
  { name: 'RSF Garage', uses: 9 },
  { name: 'College Ave St.', uses: 7 },
  { name: 'Stadium Garage', uses: 6 },
]

const reportActivity = [
  { month: 'Jan', reports: 1, upvotes: 3 },
  { month: 'Feb', reports: 2, upvotes: 8 },
  { month: 'Mar', reports: 1, upvotes: 5 },
  { month: 'Apr', reports: 3, upvotes: 14 },
  { month: 'May', reports: 2, upvotes: 11 },
  { month: 'Jun', reports: 3, upvotes: 18 },
]

const TOOLTIP_STYLE = {
  borderRadius: '12px',
  border: '1px solid hsl(220,13%,90%)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  fontSize: 12,
}

function SectionHeader({ icon: Icon, title, subtitle, iconColor = 'text-primary' }: {
  icon: React.ElementType; title: string; subtitle: string; iconColor?: string
}) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  )
}

function MetricCard({
  icon: Icon, label, value, subtext, iconBg, trend,
}: {
  icon: React.ElementType; label: string; value: string; subtext: string; iconBg: string; trend?: string
}) {
  return (
    <div className="bg-card rounded-2xl border border-border p-5 hover:shadow-md transition-all">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${iconBg}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-display font-bold text-foreground">{value}</p>
      <p className="text-xs font-semibold text-muted-foreground mt-0.5">{label}</p>
      <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
      {trend && (
        <p className="text-xs font-semibold text-green-600 mt-1.5">↑ {trend}</p>
      )}
    </div>
  )
}

export default function Dashboard() {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month')

  const chartData = period === 'week'
    ? monthlyData.slice(-2)
    : period === 'month'
    ? monthlyData
    : monthlyData

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Page Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground tracking-tight">Your Impact</h1>
        <p className="text-muted-foreground mt-1.5 text-base">
          Every search you make saves time, money, and emissions. Here's the full picture.
        </p>
      </div>

      {/* Hero Summary */}
      <div className="bg-primary rounded-2xl p-7 text-primary-foreground shadow-lg">
        <div className="flex items-center gap-2.5 mb-6">
          <Award className="w-6 h-6 opacity-80" />
          <span className="font-semibold text-lg opacity-90">Your Cumulative Savings with Wayve</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-4xl font-display font-bold">3.4</p>
            <p className="text-xs font-semibold opacity-70 mt-1">HOURS SAVED</p>
            <p className="text-xs opacity-55 mt-0.5">204 minutes total</p>
          </div>
          <div>
            <p className="text-4xl font-display font-bold">$89</p>
            <p className="text-xs font-semibold opacity-70 mt-1">MONEY SAVED</p>
            <p className="text-xs opacity-55 mt-0.5">vs. guessing and circling</p>
          </div>
          <div>
            <p className="text-4xl font-display font-bold">18</p>
            <p className="text-xs font-semibold opacity-70 mt-1">LBS CO₂ AVOIDED</p>
            <p className="text-xs opacity-55 mt-0.5">equivalent to 2 trees/yr</p>
          </div>
          <div>
            <p className="text-4xl font-display font-bold">47</p>
            <p className="text-xs font-semibold opacity-70 mt-1">SEARCHES MADE</p>
            <p className="text-xs opacity-55 mt-0.5">across 6 months</p>
          </div>
        </div>
      </div>

      {/* ── Parking Impact ── */}
      <section>
        <SectionHeader
          icon={Car}
          title="Parking Impact"
          subtitle="How Wayve changed the way you park"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <MetricCard
            icon={Search} label="Total Searches" value="47"
            subtext="parking locations checked"
            iconBg="bg-primary/10 text-primary"
            trend="21 this month"
          />
          <MetricCard
            icon={Clock} label="Avg. Search Time" value="4.3 min"
            subtext="saved per search vs. driving around"
            iconBg="bg-blue-100 text-blue-700"
          />
          <MetricCard
            icon={MapPin} label="Miles Avoided" value="31 mi"
            subtext="of unnecessary circling eliminated"
            iconBg="bg-orange-100 text-orange-700"
            trend="8 mi this month"
          />
          <MetricCard
            icon={Target} label="Avg. Cost Reduction" value="$1.89"
            subtext="saved per parking trip"
            iconBg="bg-emerald-100 text-emerald-700"
          />
        </div>

        {/* Searches + time saved over time */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <div>
              <h3 className="font-display font-bold text-foreground">Searches &amp; Time Saved Over Time</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Monthly parking searches and cumulative minutes recovered</p>
            </div>
            <div className="flex gap-1">
              {(['week', 'month', 'year'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors capitalize ${
                    period === p ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="searchGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(230,65%,28%)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="hsl(230,65%,28%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="timeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(38,92%,50%)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(38,92%,50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,92%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(220,9%,46%)' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="searches" stroke="hsl(230,65%,28%)" strokeWidth={2} fill="url(#searchGrad)" name="Searches" />
              <Area type="monotone" dataKey="timeSavedMin" stroke="hsl(38,92%,50%)" strokeWidth={2} fill="url(#timeGrad)" name="Min saved" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Most used locations */}
        <div className="mt-4 bg-card rounded-2xl border border-border p-6 shadow-sm">
          <h3 className="font-display font-bold text-foreground mb-1">Most Used Parking Locations</h3>
          <p className="text-xs text-muted-foreground mb-5">Where Wayve has directed you most often</p>
          <div className="space-y-3">
            {parkingLocations.map((loc, i) => (
              <div key={loc.name} className="flex items-center gap-3">
                <span className="text-xs font-bold text-muted-foreground w-4 shrink-0">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-semibold text-foreground">{loc.name}</span>
                    <span className="text-xs font-semibold text-muted-foreground">{loc.uses} times</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(loc.uses / parkingLocations[0].uses) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Environmental Impact ── */}
      <section>
        <SectionHeader
          icon={Leaf}
          title="Environmental Impact"
          subtitle="Emissions and fuel you've kept out of the atmosphere"
          iconColor="text-green-600"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <MetricCard
            icon={Leaf} label="CO₂ Avoided" value="18 lbs"
            subtext="from less idle circling time"
            iconBg="bg-green-100 text-green-700"
            trend="↓ 10.2 lbs this month"
          />
          <MetricCard
            icon={Fuel} label="Fuel Saved" value="2.1 gal"
            subtext="not burned while searching"
            iconBg="bg-teal-100 text-teal-700"
          />
          <MetricCard
            icon={Zap} label="Idle Time Cut" value="31 min"
            subtext="engine idling eliminated"
            iconBg="bg-cyan-100 text-cyan-700"
          />
          <MetricCard
            icon={MapPin} label="Driving Avoided" value="31 mi"
            subtext="shorter routes = less pollution"
            iconBg="bg-emerald-100 text-emerald-700"
          />
        </div>

        {/* CO2 chart */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <h3 className="font-display font-bold text-foreground mb-1">CO₂ Reduction Over Time</h3>
          <p className="text-xs text-muted-foreground mb-5">Pounds of CO₂ avoided each month by smarter parking</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="co2Grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142,72%,29%)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(142,72%,29%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,92%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(220,9%,46%)' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`${v} lbs`, 'CO₂ avoided']} />
              <Area type="monotone" dataKey="co2Lbs" stroke="hsl(142,72%,29%)" strokeWidth={2.5} fill="url(#co2Grad)" name="CO₂ avoided (lbs)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ── Savings Breakdown ── */}
      <section>
        <SectionHeader
          icon={DollarSign}
          title="Savings Breakdown"
          subtitle="Every dollar and minute reclaimed from wasted parking time"
          iconColor="text-emerald-600"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <MetricCard
            icon={DollarSign} label="Total Money Saved" value="$89"
            subtext="vs. using unmarked lots or garages blind"
            iconBg="bg-emerald-100 text-emerald-700"
            trend="$71 more than Jan"
          />
          <MetricCard
            icon={Clock} label="Total Time Saved" value="204 min"
            subtext="3.4 hours not spent circling"
            iconBg="bg-blue-100 text-blue-700"
          />
          <MetricCard
            icon={Car} label="Avg. Cost/Trip" value="$1.89"
            subtext="saved per parking trip vs. average"
            iconBg="bg-indigo-100 text-indigo-700"
          />
          <MetricCard
            icon={TrendingUp} label="Best Month" value="$89"
            subtext="June 2025 — most active month"
            iconBg="bg-amber-100 text-amber-700"
          />
        </div>

        {/* Money + time chart */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <h3 className="font-display font-bold text-foreground mb-1">Money &amp; Time Saved Over Time</h3>
          <p className="text-xs text-muted-foreground mb-5">Monthly money saved ($) and time saved (minutes) from smarter parking</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="moneyGradDash" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142,72%,39%)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(142,72%,39%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="timeGradDash" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(220,80%,58%)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="hsl(220,80%,58%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,92%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(220,9%,46%)' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="moneySaved" stroke="hsl(142,72%,39%)" strokeWidth={2} fill="url(#moneyGradDash)" name="$ saved" />
              <Area type="monotone" dataKey="timeSavedMin" stroke="hsl(220,80%,58%)" strokeWidth={2} fill="url(#timeGradDash)" name="Min saved" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Key metrics breakdown */}
        <div className="mt-4 bg-card rounded-2xl border border-border p-6 shadow-sm">
          <h3 className="font-display font-bold text-foreground mb-5">Where the Savings Come From</h3>
          <div className="space-y-4">
            {[
              { label: 'Time saved per search (avg)', value: '4.3 min', pct: 72, note: 'vs. 12 min national average for parking' },
              { label: 'Cost reduction per trip (avg)', value: '$1.89', pct: 58, note: 'from smarter lot selection' },
              { label: 'Miles of circling eliminated', value: '31 mi', pct: 64, note: 'direct routing saves fuel & time' },
              { label: 'Free/cheaper spots found', value: '14 times', pct: 45, note: 'out of 47 total searches' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <span className="text-sm font-semibold text-foreground">{item.label}</span>
                    <span className="text-xs text-muted-foreground ml-2">{item.note}</span>
                  </div>
                  <span className="text-sm font-bold text-foreground shrink-0 ml-4">{item.value}</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Community Contributions ── */}
      <section>
        <SectionHeader
          icon={Users}
          title="Community Contributions"
          subtitle="Your reports help other drivers find parking faster"
          iconColor="text-amber-600"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <MetricCard
            icon={BarChart3} label="Reports Submitted" value="12"
            subtext="parking updates shared with the community"
            iconBg="bg-amber-100 text-amber-700"
            trend="3 this month"
          />
          <MetricCard
            icon={Users} label="Upvotes Received" value="59"
            subtext="other drivers found your reports helpful"
            iconBg="bg-orange-100 text-orange-700"
          />
          <MetricCard
            icon={MapPin} label="Areas Covered" value="5"
            subtext="distinct neighborhoods reported on"
            iconBg="bg-rose-100 text-rose-700"
          />
          <MetricCard
            icon={Award} label="Credibility Score" value="88/100"
            subtext="based on accuracy of your reports"
            iconBg="bg-primary/10 text-primary"
          />
        </div>

        {/* Report activity chart */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <h3 className="font-display font-bold text-foreground mb-1">Community Report Activity</h3>
          <p className="text-xs text-muted-foreground mb-5">Reports you submitted vs. upvotes received each month</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={reportActivity} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,92%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(220,9%,46%)' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="reports" name="Reports submitted" fill="hsl(230,65%,28%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="upvotes" name="Upvotes received" fill="hsl(38,92%,50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Community leaderboard position */}
        <div className="mt-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-8 h-8 text-amber-500" />
            <div>
              <h3 className="font-display font-bold text-foreground">Community Standing</h3>
              <p className="text-sm text-muted-foreground">You're in the top 15% of Wayve contributors</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Reports Rank', value: '#42', sub: 'out of 280 users' },
              { label: 'Accuracy Rate', value: '94%', sub: 'reports confirmed correct' },
              { label: 'Impact Score', value: '1,240', sub: 'drivers helped via your reports' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-display font-bold text-foreground">{s.value}</div>
                <div className="text-xs font-semibold text-muted-foreground mt-0.5">{s.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
