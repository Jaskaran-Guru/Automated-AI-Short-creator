"use client"

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  UserPlus, Mail, Shield, 
  Trash2, MoreVertical, Clock, CheckCircle2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

export default function TeamPage() {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [pendingInvites, setPendingInvites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/team');
      if (res.ok) {
        const data = await res.json();
        setMembers(data.members || []);
        setPendingInvites(data.pendingInvites || []);
      }
    } catch (err) {
      console.error("Failed to fetch team data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInvite = async () => {
    if (!inviteEmail) return;
    setIsInviting(true);
    try {
        // Mocking the invite process
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert(`Invitation sent to ${inviteEmail}!`);
        setIsInviteModalOpen(false);
        setInviteEmail("");
        fetchData(); // Refresh list
    } catch (err) {
        console.error(err);
    } finally {
        setIsInviting(false);
    }
  };

  if (loading) {
    return <div className="p-8 flex items-center justify-center min-h-[400px]"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Team Management</h1>
          <p className="text-slate-400 font-medium">Invite staff and manage permissions for your agency.</p>
        </div>
        <Button 
          variant="premium" 
          className="rounded-2xl px-8 py-6 font-bold shadow-lg shadow-blue-500/20"
          onClick={() => setIsInviteModalOpen(true)}
        >
          <UserPlus className="w-4 h-4 mr-2" /> Invite Member
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           {/* Members Table */}
          <Card className="bg-slate-900/50 border-slate-800 rounded-[2.5rem] overflow-hidden glass-panel">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500 py-6">Member</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500 py-6">Role</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500 py-6">Joined</TableHead>
                  <TableHead className="text-right py-6"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id} className="border-slate-800/50 hover:bg-white/5 transition-colors group">
                    <TableCell className="py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-bold text-blue-400 shadow-inner">
                          {member.user.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{member.user.name || "Unnamed User"}</p>
                          <p className="text-xs text-slate-500">{member.user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-6">
                      <Badge variant="outline" className={`
                        bg-slate-950 border-slate-800 font-black text-[9px] uppercase tracking-widest px-3 py-1
                        ${member.role === 'OWNER' ? 'text-purple-400 border-purple-500/30' : ''}
                        ${member.role === 'ADMIN' ? 'text-blue-400 border-blue-500/30' : ''}
                        ${member.role === 'EDITOR' ? 'text-emerald-400 border-emerald-500/30' : ''}
                      `}>
                        {member.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-400 text-[10px] font-bold uppercase py-6">
                      {new Date(member.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right py-6">
                      <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white rounded-xl">
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
            <Card className="bg-slate-900/50 border-slate-800 rounded-[2.5rem] overflow-hidden glass-panel border-dashed">
              <div className="p-8 border-b border-slate-800 bg-slate-900/30 flex items-center gap-3">
                <Clock className="w-5 h-5 text-yellow-500" />
                <h3 className="font-black text-white uppercase tracking-widest text-[10px]">Pending Invitations</h3>
              </div>
              <div className="divide-y divide-slate-800">
                  {pendingInvites.map((invite) => (
                      <div key={invite.id} className="p-8 flex items-center justify-between group hover:bg-white/5 transition-all">
                          <div className="flex items-center gap-6">
                              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                                  <Mail className="w-5 h-5 text-slate-500" />
                              </div>
                              <div>
                                  <p className="text-sm font-bold text-white">{invite.email}</p>
                                  <p className="text-[10px] text-yellow-500 uppercase font-black tracking-widest mt-1">Invited as {invite.role}</p>
                              </div>
                          </div>
                          <div className="flex items-center gap-6">
                              <span className="text-[10px] font-bold text-slate-500 uppercase">Expires {new Date(invite.expiresAt).toLocaleDateString()}</span>
                              <Button variant="ghost" size="icon" className="text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-xl">
                                  <Trash2 className="w-4 h-4" />
                              </Button>
                          </div>
                      </div>
                  ))}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-8">
           {/* Recent Activity */}
          <Card className="bg-slate-900/50 border-slate-800 rounded-[2.5rem] overflow-hidden glass-panel">
            <div className="p-8 border-b border-slate-800 bg-slate-900/30 flex items-center gap-3">
              <Shield className="w-5 h-5 text-blue-500" />
              <h3 className="font-black text-white uppercase tracking-widest text-[10px]">Security Activity</h3>
            </div>
            <div className="p-4 space-y-2">
                {[
                    { user: "Sarah Jenkins", action: "Scheduled Post", time: "2 mins ago" },
                    { user: "Alex Rivera", action: "Deleted Clip", time: "45 mins ago" },
                    { user: "Sarah Jenkins", action: "Invited Member", time: "3 hours ago" },
                ].map((log, i) => (
                    <div key={i} className="p-4 rounded-2xl hover:bg-white/5 transition-all flex items-start gap-4">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                        <div>
                            <p className="text-xs text-white"><span className="font-bold">{log.user}</span> {log.action}</p>
                            <p className="text-[9px] font-bold text-slate-500 uppercase mt-1 tracking-tighter">{log.time}</p>
                        </div>
                    </div>
                ))}
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-500/20 rounded-[2.5rem] p-8">
             <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-[1.5rem] bg-white flex items-center justify-center mb-6 shadow-2xl">
                   <UserPlus className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="text-lg font-black text-white uppercase mb-2 tracking-tight">Need more seats?</h4>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">Upgrade to the Agency Pro plan to manage unlimited team members and clients.</p>
                <Button variant="premium" className="w-full py-6 rounded-2xl font-bold uppercase tracking-widest text-xs">
                   View Scaling Plans
                </Button>
             </div>
          </Card>
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-800 p-10 rounded-[3rem] max-w-md w-full shadow-2xl shadow-blue-500/10"
          >
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Invite Member</h3>
              <button onClick={() => setIsInviteModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                <input 
                  type="email" 
                  placeholder="colleague@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition-all text-sm"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Workspace Role</label>
                <select className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition-all text-sm appearance-none">
                  <option value="EDITOR">Editor</option>
                  <option value="MANAGER">Manager</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div className="pt-6 flex gap-4">
                <Button onClick={() => setIsInviteModalOpen(false)} variant="ghost" className="flex-1 rounded-2xl py-6 font-bold uppercase tracking-widest text-[10px]">Cancel</Button>
                <Button 
                  onClick={handleInvite} 
                  variant="premium" 
                  className="flex-1 rounded-2xl py-6 font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-blue-500/20"
                  disabled={!inviteEmail || isInviting}
                >
                  {isInviting ? "Sending..." : "Send Invite"}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
