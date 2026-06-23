import { Plus, Upload, Calendar, FileBox, UserPlus } from 'lucide-react'

const actions = [
  { name: 'Create Project', icon: Plus, desc: 'Start a new architectural project' },
  { name: 'Upload Drawings', icon: Upload, desc: 'Upload PDF, DWG, or IFC files' },
  { name: 'Schedule Site Visit', icon: Calendar, desc: 'Plan an upcoming inspection' },
  { name: 'Generate Report', icon: FileBox, desc: 'Create BOQ or risk analysis' },
  { name: 'Invite Team', icon: UserPlus, desc: 'Add collaborators to studio' },
]

export default function QuickActions() {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden flex flex-col h-full animate-fade-in" style={{ animationDelay: '300ms' }}>
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
      </div>
      <div className="p-4 grid grid-cols-1 gap-3">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <button key={action.name} className="flex items-center p-3 w-full text-left bg-background/50 hover:bg-black/5 dark:hover:bg-white/5 border border-border/50 rounded-lg transition-colors group">
              <div className="p-2 bg-primary/10 rounded-md group-hover:bg-primary group-hover:text-white transition-colors">
                <Icon className="h-5 w-5 text-primary group-hover:text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-foreground">{action.name}</p>
                <p className="text-xs text-sidebar-foreground mt-0.5">{action.desc}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
