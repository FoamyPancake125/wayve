import { useState } from 'react'
import { Clock, DollarSign, Leaf, Fuel, Search, Users, TrendingUp, Award } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const impactData = [
  { month: 'Jan', timeSaved: 12, moneySaved: 28 },
  { month: 'Feb', timeSaved: 19, moneySaved: 41 },
  { month: 'Mar', timeSaved: 15, moneySaved: 34 },
  { month: 'Apr', timeSaved: 27, moneySaved: 58 },
  { month: 'May', timeSaved: 32, moneySaved: 71 },
  { month: 'Jun', timeSaved: 41, moneySaved: 89 },
]

const stats = [
  { label: 'Total Searches', value: '47', icon: Search, color: 'bg-primary/10 text-primary' },
  { label: 'Reports Shared', value: '12', icon: Users, color: 'bg-accent/10 text-amber-600' },
  { label: 'Time Saved', value: '3.4 hrs', icon: Clock, color: 'bg-green-100 text-green-700' },
  { label: 'Money Saved', value: '$89', icon: DollarSign, color: 'bg-emerald-100 text-emerald-700' },
  { label: 'Fuel Saved', value: '2.1 gal', icon: Fuel, color: 'bg-orange-100 text-orange-700' },
  { label: 'CO₂ Reduced', value: '18 lbs', icon: Leaf, color: 'bg-teal-100 text-teal-700' },
]

export default function Dashboard() {
  const [period, setPeriod] = useState('month')

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Your Impact</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Track how Wayve helps you save time, money, and the environment.
        </p>
      </div>

      <div className="bg-primary rounded-2xl p-6 text-primary-foreground">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 opacity-80" />
          <span className="text-sm font-semibold opacity-90">Cumulative savings from smarter parking decisions</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-3xl font-display font-bold">3.4</p>
            <p className="text-xs opacity-70 mt-0.5">hours saved</p>
          </div>
          <div>
            <p className="text-3xl font-display font-bold">$89</p>
            <p className="text-xs opacity-70 mt-0.5">money saved</p>
          </div>
          <div>
            <p className="text-3xl font-display font-bold">18</p>
            <p className="text-xs opacity-70 mt-0.5">lbs CO₂ reduced</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {stats.map(stat => (
          <div key={stat.label} className="bg-card rounded-xl border border-border p-4">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon className="w-4 h-4" />
            </div>
            <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h2 className="font-display font-semibold text-foreground">Impact Over Time</h2>
          </div>
          <div className="flex gap-1">
            {['week', 'month', 'year'].map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors capitalize ${
                  period === p
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={impactData}>
            <defs>
              <linearGradient id="timeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(230,65%,28%)" stopOpacity={0.15} />
                <stop offset="95%" stopColor="hsl(230,65%,28%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="moneyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(38,92%,50%)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(38,92%,50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,92%)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(220,9%,46%)' }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                borderRadius: '10px',
                border: '1px solid hsl(220,13%,90%)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                fontSize: 12,
              }}
            />
            <Area type="monotone" dataKey="timeSaved" stroke="hsl(230,65%,28%)" strokeWidth={2} fill="url(#timeGrad)" name="Min saved" />
            <Area type="monotone" dataKey="moneySaved" stroke="hsl(38,92%,50%)" strokeWidth={2} fill="url(#moneyGrad)" name="$ saved" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
        <h2 className="font-display font-semibold text-foreground mb-4">Real Value</h2>
        <div className="space-y-3">
          {[
            { label: 'Average time per parking search', value: '4.3 min saved', bar: 72 },
            { label: 'Average cost per trip', value: '$1.89 saved', bar: 58 },
            { label: 'Community reports you contributed', value: '12 reports', bar: 40 },
            { label: 'Carbon footprint reduction', value: '18 lbs CO₂', bar: 30 },
          ].map(item => (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className="text-sm font-semibold text-foreground">{item.value}</span>
              </div>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${item.bar}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
