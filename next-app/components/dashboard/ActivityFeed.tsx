import { FileText, MessageSquare, PenTool, Users } from 'lucide-react'

const activities = [
  { id: 1, type: 'upload', user: 'Sarah Chen', action: 'uploaded new floor plans', project: 'Nexa Tower', time: '10 mins ago', icon: FileText, color: 'text-blue-500' },
  { id: 2, type: 'comment', user: 'Alex Rivera', action: 'commented on', project: 'Villa Marina Elevation', time: '2 hours ago', icon: MessageSquare, color: 'text-green-500' },
  { id: 3, type: 'revision', user: 'David Kim', action: 'requested revision for', project: 'Skyline Hub BOQ', time: '4 hours ago', icon: PenTool, color: 'text-orange-500' },
  { id: 4, type: 'team', user: 'Emma Stone', action: 'joined the team for', project: 'Nexa Tower', time: 'Yesterday', icon: Users, color: 'text-purple-500' },
]

export default function ActivityFeed() {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden flex flex-col h-full animate-fade-in" style={{ animationDelay: '200ms' }}>
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
      </div>
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-border before:via-border before:to-transparent">
          {activities.map((activity) => {
            const Icon = activity.icon
            return (
              <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-card bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <Icon className={`h-4 w-4 ${activity.color}`} />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-border/50 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm text-foreground">{activity.user}</span>
                    <span className="text-xs text-sidebar-foreground">{activity.time}</span>
                  </div>
                  <p className="text-sm text-sidebar-foreground">
                    {activity.action} <span className="font-medium text-primary cursor-pointer hover:underline">{activity.project}</span>
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
