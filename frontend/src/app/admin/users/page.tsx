import { protectAdminPage } from "@/lib/admin-auth";
import { db } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  ShieldBan, 
  CreditCard, 
  Zap,
  ExternalLink
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
import Link from "next/link";

export default async function AdminUsersPage({
    searchParams
}: {
    searchParams: { q?: string, plan?: string }
}) {
  await protectAdminPage(["SUPER_ADMIN", "ADMIN", "SUPPORT"]);

  const users = await db.user.findMany({
    where: {
      OR: searchParams.q ? [
        { name: { contains: searchParams.q, mode: 'insensitive' } },
        { email: { contains: searchParams.q, mode: 'insensitive' } },
      ] : undefined
    },
    include: {
      memberships: {
        include: { workspace: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 50
  });

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 uppercase italic tracking-tighter">User Command Center</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Manage {users.length}+ active VIRAIL customers</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" className="border-slate-800 text-slate-400 rounded-xl">
                Export CSV
            </Button>
            <Button variant="premium" className="rounded-xl">
                Add Manual User
            </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input 
            placeholder="Search by name, email, or ID..." 
            className="pl-10 bg-slate-900/50 border-slate-800 rounded-xl h-12"
          />
        </div>
        <Button variant="outline" className="border-slate-800 text-slate-400 h-12 rounded-xl">
          <Filter className="w-4 h-4 mr-2" />
          Plan: All
        </Button>
      </div>

      <Card className="bg-slate-900/50 border-slate-800 rounded-[2rem] overflow-hidden glass-panel">
        <Table>
          <TableHeader className="bg-slate-950/50">
            <TableRow className="border-slate-800 hover:bg-transparent">
              <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px] py-6">User</TableHead>
              <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Workspaces</TableHead>
              <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Plan</TableHead>
              <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Usage</TableHead>
              <TableHead className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Signed Up</TableHead>
              <TableHead className="text-right text-slate-500 font-bold uppercase tracking-widest text-[10px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="border-slate-800/50 hover:bg-white/5 transition-colors group">
                <TableCell>
                  <div className="flex items-center gap-3 py-2">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/5 flex items-center justify-center font-bold text-red-500">
                      {user.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white flex items-center gap-2">
                        {user.name || "Unnamed User"}
                        {user.systemRole && <Badge variant="outline" className="text-[8px] bg-red-500/10 text-red-500 border-red-500/20">{user.systemRole}</Badge>}
                      </p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-slate-400 text-xs font-medium">
                  {user.memberships.length} active
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-slate-900/50 border-slate-700 text-[10px] font-black uppercase tracking-widest">
                    {user.memberships[0]?.workspace?.plan || "FREE"}
                  </Badge>
                </TableCell>
                <TableCell>
                   <div className="w-24">
                      <div className="flex justify-between text-[8px] font-bold text-slate-500 mb-1 uppercase tracking-tighter">
                          <span>{user.memberships[0]?.workspace?.minutesUsed || 0}m</span>
                          <span>/ {user.memberships[0]?.workspace?.minutesLimit || 0}m</span>
                      </div>
                      <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-red-500" 
                            style={{ width: `${Math.min(100, ((user.memberships[0]?.workspace?.minutesUsed || 0) / (user.memberships[0]?.workspace?.minutesLimit || 1)) * 100)}%` }} 
                          />
                      </div>
                   </div>
                </TableCell>
                <TableCell className="text-slate-400 text-xs font-medium">
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/admin/users/${user.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
                            <ExternalLink className="w-4 h-4" />
                        </Button>
                    </Link>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500">
                        <ShieldBan className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
                        <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
