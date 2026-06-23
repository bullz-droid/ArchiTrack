'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FolderKanban, Users, FileText, Settings, LogOut, MessageSquare, CreditCard } from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const navItems = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/dashboard/projects', icon: FolderKanban },
  { name: 'Clients', href: '/dashboard/clients', icon: Users },
  { name: 'Document Hub', href: '/dashboard/documents', icon: FileText },
  { name: 'Collaboration', href: '/dashboard/collaboration', icon: MessageSquare },
  { name: 'Finance', href: '/dashboard/finance', icon: CreditCard },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-sidebar border-r border-border hidden md:flex flex-col h-full z-10 transition-colors duration-200">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
          ArchiTrack
        </h1>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-sidebar-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground'
              )}
            >
              <Icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0 transition-colors',
                  isActive ? 'text-primary' : 'text-sidebar-foreground group-hover:text-foreground'
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Link
          href="/auth"
          className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
          Sign out
        </Link>
      </div>
    </aside>
  )
}
