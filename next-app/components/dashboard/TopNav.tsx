'use client'

import { Bell, Search, Menu, UserCircle } from 'lucide-react'

export default function TopNav() {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 sm:px-6 z-10 transition-colors duration-200">
      <div className="flex items-center flex-1">
        <button type="button" className="md:hidden p-2 -ml-2 mr-2 text-sidebar-foreground hover:bg-black/5 dark:hover:bg-white/5 rounded-lg">
          <Menu className="h-6 w-6" />
        </button>
        
        <div className="max-w-md w-full hidden sm:flex items-center relative">
          <Search className="h-5 w-5 absolute left-3 text-sidebar-foreground/60" />
          <input
            type="text"
            placeholder="Search projects, documents, or clients..."
            className="w-full bg-black/5 dark:bg-white/5 border-none rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-foreground"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-sidebar-foreground hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-card"></span>
        </button>
        
        <div className="flex items-center space-x-3 cursor-pointer pl-2 border-l border-border">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-medium text-foreground">Lead Architect</span>
            <span className="text-xs text-sidebar-foreground">Studio Admin</span>
          </div>
          <UserCircle className="h-8 w-8 text-sidebar-foreground/80" />
        </div>
      </div>
    </header>
  )
}
