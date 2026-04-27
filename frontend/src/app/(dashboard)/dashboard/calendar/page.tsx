import { getCurrentWorkspace } from "@/lib/agency-context";
import { db } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Instagram,
  Youtube,
  Play
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function CalendarPage({
    searchParams
}: {
    searchParams: { month?: string; year?: string; clientId?: string }
}) {
  const workspace = await getCurrentWorkspace();
  if (!workspace) return <div>No workspace found.</div>;

  const now = new Date();
  const currentMonth = searchParams.month ? parseInt(searchParams.month) : now.getMonth();
  const currentYear = searchParams.year ? parseInt(searchParams.year) : now.getFullYear();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

  // Fetch all posts for this workspace/month
  const posts = await db.socialPost.findMany({
    where: {
      client: { workspaceId: workspace.id },
      scheduledFor: {
        gte: firstDayOfMonth,
        lte: lastDayOfMonth
      },
      ...(searchParams.clientId ? { clientId: searchParams.clientId } : {})
    },
    include: {
      client: true,
      account: true
    },
    orderBy: { scheduledFor: "asc" }
  });

  // Calendar logic
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDay = firstDayOfMonth.getDay();
  const calendarDays = [];

  // Add empty slots for days of previous month
  for (let i = 0; i < startingDay; i++) {
    calendarDays.push(null);
  }

  // Add actual days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const monthName = firstDayOfMonth.toLocaleString('default', { month: 'long' });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Content Calendar</h1>
          <p className="text-slate-400">Manage distribution schedules for all client brands.</p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" className="border-slate-800 rounded-xl">
                <Filter className="w-4 h-4 mr-2" />
                All Clients
            </Button>
            <div className="flex bg-slate-900/50 rounded-xl border border-slate-800 p-1">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                    <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="flex items-center px-4 font-bold text-white text-sm">
                    {monthName} {currentYear}
                </div>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
      </div>

      <Card className="bg-slate-900/50 border-slate-800 rounded-[2.5rem] overflow-hidden glass-panel">
        <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-900/30">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-4 text-center text-[10px] uppercase font-black tracking-[0.2em] text-slate-500">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 min-h-[800px]">
          {calendarDays.map((day, i) => {
            const datePosts = day ? posts.filter(p => new Date(p.scheduledFor).getDate() === day) : [];
            const isToday = day === now.getDate() && currentMonth === now.getMonth() && currentYear === now.getFullYear();

            return (
              <div key={i} className={`border-r border-b border-slate-800 p-2 min-h-[140px] transition-colors ${day ? 'bg-transparent hover:bg-white/5' : 'bg-slate-950/20'}`}>
                {day && (
                  <>
                    <div className="flex justify-between items-start mb-2 p-1">
                      <span className={`text-sm font-bold ${isToday ? 'bg-blue-500 text-white w-6 h-6 flex items-center justify-center rounded-full' : 'text-slate-400'}`}>
                        {day}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {datePosts.map(post => (
                        <div key={post.id} className="p-2 rounded-lg bg-slate-800/80 border border-white/5 group relative cursor-pointer hover:border-blue-500/50 transition-all">
                            <div className="flex items-center justify-between mb-1">
                                {post.account?.platform === 'INSTAGRAM' && <Instagram className="w-3 h-3 text-pink-500" />}
                                {post.account?.platform === 'TIKTOK' && <Play className="w-3 h-3 text-cyan-400" />}
                                {post.account?.platform === 'YOUTUBE' && <Youtube className="w-3 h-3 text-red-500" />}
                                <span className="text-[8px] font-black uppercase text-slate-500 truncate max-w-[50px]">{post.client?.name}</span>
                            </div>
                            <p className="text-[10px] text-white font-medium truncate leading-tight">{post.title || "Untitled Clip"}</p>
                            <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      <div className="mt-8 flex items-center gap-6 justify-center">
          <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-pink-500" />
              <span className="text-xs text-slate-500 font-medium">Instagram</span>
          </div>
          <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-xs text-slate-500 font-medium">TikTok</span>
          </div>
          <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-xs text-slate-500 font-medium">YouTube</span>
          </div>
      </div>
    </div>
  );
}
