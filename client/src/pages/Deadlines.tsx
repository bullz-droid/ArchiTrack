import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Calendar as CalendarIcon, Clock, AlertTriangle, ArrowRight, ChevronLeft, ChevronRight, Filter, Plus } from 'lucide-react';
import { format, isBefore, addDays, startOfDay, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Deadlines: React.FC = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects');
        setProjects(res.data.filter((p: any) => p.deadline).sort((a: any, b: any) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()));
      } catch (err: any) {
        console.error(err);
        toast.error('Failed to sync studio deadlines');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const getStatus = (date: string) => {
    const deadline = new Date(date);
    const today = startOfDay(new Date());
    const threeDaysAway = addDays(today, 3);

    if (isBefore(deadline, today)) return { label: 'Overdue', color: 'text-red-500 bg-red-50 dark:bg-red-900/10', icon: AlertTriangle };
    if (isBefore(deadline, threeDaysAway)) return { label: 'Critical', color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/10', icon: Clock };
    return { label: 'Scheduled', color: 'text-primary-500 bg-primary-50 dark:bg-primary-900/10', icon: CalendarIcon };
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const getDeadlinesForDay = (day: Date) => {
    return projects.filter((p: any) => isSameDay(new Date(p.deadline), day));
  };

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="h-px w-8 bg-primary-500"></span>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary-500">Milestones</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-[#111827] dark:text-white uppercase leading-none">
            Submission <span className="text-primary-600">Track</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium max-w-xl">
            Monitor critical design reviews, pin-ups, and final submissions.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 items-start">
        {/* Calendar Grid */}
        <div className="xl:col-span-2 space-y-8">
          <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <h2 className="text-3xl font-black tracking-tighter uppercase text-[#111827] dark:text-white">
              {format(currentDate, 'MMMM')} <span className="text-primary-600">{format(currentDate, 'yyyy')}</span>
            </h2>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setCurrentDate(subMonths(currentDate, 1))} 
                className="p-3 bg-gray-50 dark:bg-gray-900/50 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-gray-400 hover:text-primary-600 rounded-xl transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => setCurrentDate(new Date())} 
                className="px-4 py-2 bg-gray-50 dark:bg-gray-900/50 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-primary-600 rounded-xl transition-all"
              >
                Today
              </button>
              <button 
                onClick={() => setCurrentDate(addMonths(currentDate, 1))} 
                className="p-3 bg-gray-50 dark:bg-gray-900/50 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-gray-400 hover:text-primary-600 rounded-xl transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
            <div className="grid grid-cols-7 border-b border-gray-100 dark:border-gray-800">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 text-center bg-gray-50/50 dark:bg-gray-900/20">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-px bg-gray-100 dark:bg-gray-800">
              {days.map((day) => {
                const dayDeadlines = getDeadlinesForDay(day);
                const isToday = isSameDay(day, new Date());
                const isCurrentMonth = isSameMonth(day, currentDate);
                
                return (
                  <div 
                    key={day.toString()} 
                    className={`min-h-[140px] p-3 transition-all bg-white dark:bg-[#1E293B] hover:bg-gray-50/50 dark:hover:bg-gray-900/20 group/day ${isCurrentMonth ? '' : 'opacity-20'}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className={`text-[10px] font-black w-7 h-7 flex items-center justify-center rounded-lg transition-all ${isToday ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' : 'text-gray-400 group-hover/day:text-primary-600'}`}>
                        {format(day, 'd')}
                      </div>
                      {dayDeadlines.length > 0 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-600 animate-pulse" />
                      )}
                    </div>
                    <div className="space-y-1.5">
                      {dayDeadlines.map((p: any) => (
                        <Link 
                          key={p._id} 
                          to={`/projects/${p._id}`}
                          className="block px-2 py-1.5 bg-primary-50 dark:bg-primary-900/20 border-l-2 border-primary-500 text-[8px] font-bold uppercase tracking-tight text-primary-700 dark:text-primary-400 truncate hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors"
                        >
                          {p.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Timeline List */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-[#1E293B] p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black tracking-tighter uppercase text-[#111827] dark:text-white">Timeline</h3>
              <Filter size={18} className="text-gray-400" />
            </div>

            <div className="space-y-6">
              {loading ? (
                [1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-50 dark:bg-gray-900/50 rounded-2xl animate-pulse" />)
              ) : projects.length > 0 ? (
                projects.map((project: any) => {
                  const status = getStatus(project.deadline);
                  return (
                    <Link 
                      key={project._id} 
                      to={`/projects/${project._id}`}
                      className="group block p-5 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-transparent hover:border-primary-500/30 transition-all hover:bg-white dark:hover:bg-gray-800 hover:shadow-xl"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${status.color}`}>
                          <status.icon size={10} />
                          {status.label}
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{format(new Date(project.deadline), 'MMM dd')}</span>
                      </div>
                      <h4 className="font-bold text-[#111827] dark:text-white uppercase tracking-tight mb-2 group-hover:text-primary-600 transition-colors">{project.title}</h4>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-widest">{project.course || 'Unassigned Studio'}</p>
                    </Link>
                  );
                })
              ) : (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900/50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                    <CalendarIcon size={32} />
                  </div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">No submissions tracked</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-primary-600 p-8 rounded-3xl shadow-xl shadow-primary-600/20 text-white relative overflow-hidden group cursor-pointer">
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
              <Plus size={64} />
            </div>
            <h4 className="text-xl font-black tracking-tighter uppercase mb-2">New Deadline</h4>
            <p className="text-xs text-white/60 font-medium leading-relaxed mb-6">Create a new milestone for your current architectural projects.</p>
            <div className="flex items-center gap-2 text-white/80 group-hover:text-white transition-all">
              <span className="text-[9px] font-bold uppercase tracking-widest">Open Projects</span>
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deadlines;
