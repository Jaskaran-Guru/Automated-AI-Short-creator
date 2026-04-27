import { protectAdminPage } from "@/lib/admin-auth";
import { db } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  LifeBuoy, 
  MessageSquare, 
  Clock, 
  User, 
  AlertTriangle,
  CheckCircle2,
  Filter,
  Search
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default async function AdminTicketsPage() {
  await protectAdminPage(["SUPER_ADMIN", "ADMIN", "SUPPORT"]);

  const tickets = await db.ticket.findMany({
    include: {
      user: true,
      assignedTo: true,
      _count: {
        select: { responses: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 uppercase italic tracking-tighter">Support Desk</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Customer Success & Resolution Terminal</p>
        </div>
        <div className="flex bg-slate-900/50 rounded-xl border border-slate-800 p-1">
            <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest px-4 h-8 text-blue-500 bg-blue-500/10 rounded-lg">Open</Button>
            <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest px-4 h-8 text-slate-500">Resolved</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-slate-900/50 border-slate-800 p-6 rounded-[2rem] glass-panel flex items-center gap-4">
            <div className="bg-blue-500/10 p-3 rounded-2xl">
                <MessageSquare className="w-6 h-6 text-blue-500" />
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Tickets</p>
                <h3 className="text-2xl font-black text-white">{tickets.length}</h3>
            </div>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800 p-6 rounded-[2rem] glass-panel flex items-center gap-4">
            <div className="bg-red-500/10 p-3 rounded-2xl">
                <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">High Priority</p>
                <h3 className="text-2xl font-black text-white">{tickets.filter(t => t.priority === 'HIGH' || t.priority === 'URGENT').length}</h3>
            </div>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800 p-6 rounded-[2rem] glass-panel flex items-center gap-4">
            <div className="bg-emerald-500/10 p-3 rounded-2xl">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Solved Today</p>
                <h3 className="text-2xl font-black text-white">24</h3>
            </div>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800 p-6 rounded-[2rem] glass-panel flex items-center gap-4">
            <div className="bg-purple-500/10 p-3 rounded-2xl">
                <Clock className="w-6 h-6 text-purple-500" />
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Avg. Response</p>
                <h3 className="text-2xl font-black text-white">1.2h</h3>
            </div>
        </Card>
      </div>

      <Card className="bg-slate-900/50 border-slate-800 rounded-[2rem] overflow-hidden glass-panel">
        <Table>
          <TableHeader className="bg-slate-950/50">
            <TableRow className="border-slate-800 hover:bg-transparent">
              <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px] py-6">Subject</TableHead>
              <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Customer</TableHead>
              <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Priority</TableHead>
              <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Category</TableHead>
              <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Assigned</TableHead>
              <TableHead className="text-right text-slate-500 font-bold uppercase tracking-widest text-[10px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id} className="border-slate-800/50 hover:bg-white/5 transition-colors cursor-pointer group">
                <TableCell className="py-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{ticket.subject}</span>
                    <span className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-tighter">ID: {ticket.id} â€¢ {ticket._count.responses} replies</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[8px] font-bold text-slate-500">
                        {ticket.user.name?.charAt(0) || "U"}
                    </div>
                    <span className="text-xs text-slate-400">{ticket.user.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`
                    text-[10px] font-black uppercase tracking-widest
                    ${ticket.priority === 'URGENT' ? 'bg-red-500/10 text-red-500 border-red-500/20' : ''}
                    ${ticket.priority === 'HIGH' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : ''}
                    ${ticket.priority === 'MEDIUM' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : ''}
                    ${ticket.priority === 'LOW' ? 'bg-slate-800 text-slate-500 border-slate-700' : ''}
                  `}>
                    {ticket.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                    <Badge variant="outline" className="bg-slate-900 border-slate-800 text-[10px] text-slate-500">
                        {ticket.category || "GENERAL"}
                    </Badge>
                </TableCell>
                <TableCell className="text-slate-500 text-xs font-bold">
                  {ticket.assignedTo?.name || "Unassigned"}
                </TableCell>
                <TableCell className="text-right">
                  <Badge className={`
                    text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full
                    ${ticket.status === 'OPEN' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-500'}
                  `}>
                    {ticket.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
