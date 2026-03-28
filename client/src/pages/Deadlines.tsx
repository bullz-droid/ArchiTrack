import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Calendar as CalendarIcon, Clock, AlertTriangle, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, isBefore, addDays, startOfDay, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { Link } from 'react-router-dom';

const Deadlines: React.FC = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects');
        setProjects(res.data.filter((p: any) => p.deadline).sort((a: any, b: any) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()));
      } catch (err) {
        console.error(err);
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

    if (isBefore(deadline, today)) return { label: 'Overdue', color: 'text-red-600 bg-red-50', icon: AlertTriangle };
    if (isBefore(deadline, threeDaysAway)) return { label: 'Upcoming', color: 'text-orange-600 bg-orange-50', icon: Clock };
    return { label: 'Scheduled', color: 'text-blue-600 bg-blue-50', icon: CalendarIcon };
  };

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const getDeadlinesForDay = (day: Date) => {
    return projects.filter((p: any) => isSameDay(new Date(p.deadline), day));
  };

  return (
    <div className="space-y-16">
      <header className="flex justify-between items-end border-b border-gray-100 pb-12">
        <div>
          <h1 className="text-6xl font-black tracking-tighter mb-4 text-archi-black uppercase">Studio Deadlines</h1>
          <p className="text-gray-400 text-lg font-light">Track your project submissions and architectural milestones.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-16">
        {/* Calendar Grid */}
        <div className="xl:col-span-2 space-y-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black tracking-tighter uppercase">{format(currentDate, 'MMMM yyyy')}</h2>
            <div className="flex gap-4">
              <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-3 border border-gray-100 hover:border-archi-black transition-all">
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-3 border border-gray-100 hover:border-archi-black transition-all">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-px bg-gray-100 border border-gray-100">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-center bg-white">
                {day}
              </div>
            ))}
            {days.map((day) => {
              const dayDeadlines = getDeadlinesForDay(day);
              const isToday = isSameDay(day, new Date());
              return (
                <div 
                  key={day.toString()} 
                  className={`min-h-[160px] p-4 transition-all bg-white group/day ${isSameMonth(day, currentDate) ? '' : 'opacity-30'}`}
                >
                  <div className={`text-[10px] font-black mb-4 flex items-center justify-center w-8 h-8 transition-colors ${isToday ? 'bg-archi-black text-white' : 'text-gray-300 group-hover/day:text-archi-black'}`}>
                    {format(day, 'd')}
                  </div>
                  <div className="space-y-2">
                    {dayDeadlines.map((p: any) => (
                      <Link 
                        key={p._id} 
                        to={`/projects/${p._id}`}
                        className="block px-3 py-2 bg-red-50 border-l-2 border-red-500 text-[9px] font-black uppercase tracking-tight text-red-700 truncate hover:bg-red-100 transition-colors"
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

        {/* Upcoming List */}
        <div className="space-y-12">
          <h2 className="text-3xl font-black tracking-tighter uppercase">Submission Queue</h2>
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map(i => <div key={i} className="h-32 bg-archi-gray animate-pulse" />)}
            </div>
          ) : projects.length > 0 ? (
            <div className="space-y-6">
              {projects.map((project: any) => {
                const status = getStatus(project.deadline);
                return (
                  <div key={project._id} className="group block bg-white border border-gray-100 p-8 transition-all hover:border-archi-black">
                    <div className="flex items-center gap-6 mb-6">
                      <div className="w-12 h-12 flex flex-col items-center justify-center bg-archi-gray group-hover:bg-archi-black transition-colors">
                        <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 group-hover:text-gray-500">{format(new Date(project.deadline), 'MMM')}</span>
                        <span className="text-lg font-black group-hover:text-white transition-colors">{format(new Date(project.deadline), 'd')}</span>
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-300">{project.course || 'Studio'}</span>
                        <h3 className="text-sm font-black leading-tight uppercase truncate">{project.title}</h3>
                      </div>
                      <Link to={`/projects/${project._id}`} className="p-3 border border-gray-50 group-hover:border-archi-black transition-all">
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                    <div className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] inline-flex items-center gap-2 ${status.color}`}>
                      <status.icon size={12} /> {status.label}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-24 border border-dashed border-gray-200 text-center bg-gray-50/50">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 mb-8">No upcoming submissions</p>
              <Link to="/projects" className="text-[10px] font-bold uppercase tracking-widest px-8 py-4 bg-archi-black text-white hover:bg-archi-dark-gray transition-colors">Initialize Projects</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Deadlines;
