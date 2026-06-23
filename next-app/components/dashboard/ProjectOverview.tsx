import { FolderKanban, CheckCircle, Clock, DollarSign } from 'lucide-react'

const stats = [
  { name: 'Active Projects', value: '12', icon: FolderKanban, trend: '+2 this month' },
  { name: 'Completed', value: '48', icon: CheckCircle, trend: '+4 this month' },
  { name: 'Pending Approval', value: '3', icon: Clock, trend: 'Action required' },
  { name: 'Revenue YTD', value: '$2.4M', icon: DollarSign, trend: '+18% vs last year' },
]

export default function ProjectOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
      {stats.map((stat, i) => {
        const Icon = stat.icon
        return (
          <div key={stat.name} className="bg-card rounded-xl p-6 border border-border shadow-sm transition-all hover:shadow-md" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-sidebar-foreground">{stat.name}</p>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icon className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold tracking-tight text-foreground">{stat.value}</h3>
              <p className="mt-1 text-xs text-sidebar-foreground/80">{stat.trend}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
