import { getCurrentWorkspace } from "@/lib/agency-context";
import { db } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  UserPlus, 
  Mail, 
  MoreVertical, 
  Clock,
  Trash2,
  UserCheck
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

export default async function TeamPage() {
  const workspace = await getCurrentWorkspace();
  if (!workspace) return <div>No workspace found.</div>;

  const members = await db.workspaceMember.findMany({
    where: { workspaceId: workspace.id },
    include: {
      user: true
    },
    orderBy: { createdAt: "asc" }
  });

  const pendingInvites = await db.invite.findMany({
    where: { 
        workspaceId: workspace.id,
        acceptedAt: null,
        expiresAt: { gt: new Date() }
    }
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Team Management</h1>
          <p className="text-slate-400">Invite staff and manage permissions for your agency.</p>
        </div>
        <Button variant="premium" className="rounded-xl px-6 h-12">
          <UserPlus className="w-5 h-5 mr-2" />
          Invite Member
        </Button>
      </div>

      <div className="grid gap-8">
        {/* Active Members */}
        <Card className="bg-slate-900/50 border-slate-800 rounded-[2rem] overflow-hidden glass-panel">
          <div className="p-6 border-b border-slate-800 bg-slate-900/30 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold text-white uppercase tracking-widest text-xs">Active Members</h3>
          </div>
          <Table>
            <TableHeader className="bg-slate-950/30">
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-slate-500 font-bold uppercase tracking-tighter text-[10px]">User</TableHead>
                <TableHead className="text-slate-500 font-bold uppercase tracking-tighter text-[10px]">Role</TableHead>
                <TableHead className="text-slate-500 font-bold uppercase tracking-tighter text-[10px]">Joined</TableHead>
                <TableHead className="text-right text-slate-500 font-bold uppercase tracking-tighter text-[10px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id} className="border-slate-800/50 hover:bg-white/5 transition-colors group">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/5 flex items-center justify-center font-bold text-blue-400">
                        {member.user.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{member.user.name || "Unnamed User"}</p>
                        <p className="text-xs text-slate-500">{member.user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`
                      bg-slate-900/50 border-slate-700 font-bold text-[10px] uppercase tracking-widest
                      ${member.role === 'OWNER' ? 'text-purple-400 border-purple-500/30' : ''}
                      ${member.role === 'ADMIN' ? 'text-blue-400 border-blue-500/30' : ''}
                      ${member.role === 'EDITOR' ? 'text-emerald-400 border-emerald-500/30' : ''}
                    `}>
                      {member.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-400 text-xs">
                    {new Date(member.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Pending Invites */}
        {pendingInvites.length > 0 && (
          <Card className="bg-slate-900/50 border-slate-800 rounded-[2rem] overflow-hidden glass-panel border-dashed">
            <div className="p-6 border-b border-slate-800 bg-slate-900/30 flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              <h3 className="font-bold text-white uppercase tracking-widest text-xs">Pending Invitations</h3>
            </div>
            <div className="divide-y divide-slate-800">
                {pendingInvites.map((invite) => (
                    <div key={invite.id} className="p-6 flex items-center justify-between group hover:bg-white/5 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="bg-slate-800 p-3 rounded-xl">
                                <Mail className="w-5 h-5 text-slate-400" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white">{invite.email}</p>
                                <p className="text-[10px] text-yellow-500 uppercase font-black tracking-widest">Invited as {invite.role}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">Expires {new Date(invite.expiresAt).toLocaleDateString()}</span>
                            <Button variant="ghost" size="icon" className="text-red-500/50 hover:text-red-500 hover:bg-red-500/10">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
          </Card>
        )}

        {/* Audit Log / Recent Activity */}
        <Card className="bg-slate-900/50 border-slate-800 rounded-[2rem] overflow-hidden glass-panel">
          <div className="p-6 border-b border-slate-800 bg-slate-900/30 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold text-white uppercase tracking-widest text-xs">Recent Team Activity</h3>
          </div>
          <div className="p-0">
            {/* We would fetch actual audit logs here */}
            <div className="divide-y divide-slate-800">
                {[
                    { user: "Sarah Jenkins", action: "Scheduled Post", target: "Client: TechFlow", time: "2 mins ago" },
                    { user: "Marcus Thorne", action: "Created Client", target: "Client: PodCastX", time: "1 hour ago" },
                    { user: "David Chen", action: "Updated Brand Kit", target: "Client: ViralMedia", time: "3 hours ago" },
                ].map((log, i) => (
                    <div key={i} className="px-6 py-4 flex items-center justify-between group hover:bg-white/5 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                {log.user.charAt(0)}
                            </div>
                            <div>
                                <p className="text-xs text-white font-medium">
                                    <span className="font-bold">{log.user}</span> {log.action.toLowerCase()}
                                </p>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">{log.target}</p>
                            </div>
                        </div>
                        <span className="text-[10px] text-slate-600 font-bold">{log.time}</span>
                    </div>
                ))}
            </div>
          </div>
        </Card>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-slate-900/50 border-slate-800 p-6 rounded-3xl glass-panel">
                <Shield className="w-6 h-6 text-blue-500 mb-4" />
                <h4 className="text-white font-bold mb-2">Workspace Roles</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                    Owners and Admins can manage billing. Managers handle clients. Editors focus on video production.
                </p>
            </Card>
            <Card className="bg-slate-900/50 border-slate-800 p-6 rounded-3xl glass-panel">
                <UserCheck className="w-6 h-6 text-emerald-500 mb-4" />
                <h4 className="text-white font-bold mb-2">Seat Limits</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                    Your current plan allows for 10 team members. Upgrade to Agency Pro for unlimited seats.
                </p>
            </Card>
            <Card className="bg-slate-900/50 border-slate-800 p-6 rounded-3xl glass-panel">
                <Clock className="w-6 h-6 text-purple-500 mb-4" />
                <h4 className="text-white font-bold mb-2">Audit Logs</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                    Track every action taken by your team members for accountability and security.
                </p>
            </Card>
        </div>
      </div>
    </div>
  );
}
