import ProjectOverview from '../../components/dashboard/ProjectOverview'
import ActivityFeed from '../../components/dashboard/ActivityFeed'
import QuickActions from '../../components/dashboard/QuickActions'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome back, Architect</h1>
        <p className="text-sidebar-foreground mt-1">Here is what is happening with your studio today.</p>
      </div>

      <ProjectOverview />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
        <div className="lg:col-span-2 h-full">
          <ActivityFeed />
        </div>
        <div className="h-full">
          <QuickActions />
        </div>
      </div>
    </div>
  )
}
