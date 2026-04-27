"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Youtube, 
  Instagram, 
  Play, 
  AlertCircle,
  CheckCircle2,
  MoreVertical
} from "lucide-react";
import { motion } from "framer-motion";

interface SocialPost {
  id: string;
  title: string;
  scheduledFor: string;
  status: string;
  account: {
    platform: string;
    username: string;
  };
}

export default function CalendarPage() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts");
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } catch (err) {
        console.error("Failed to fetch posts");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "SCHEDULED": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "FAILED": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "PROCESSING": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "YOUTUBE": return <Youtube className="w-4 h-4 text-red-500" />;
      case "INSTAGRAM": return <Instagram className="w-4 h-4 text-pink-500" />;
      case "TIKTOK": return <Play className="w-4 h-4 text-white" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase letter-spacing-widest">Content Calendar</h1>
          <p className="text-slate-500 font-medium mt-1">Manage and track your automated publishing pipeline.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-2xl p-1">
            <Button variant="ghost" size="sm" className="rounded-xl px-4 font-bold">Week</Button>
            <Button variant="ghost" size="sm" className="rounded-xl px-4 font-bold bg-slate-800 text-white">Month</Button>
          </div>
          <Button variant="premium" className="rounded-2xl px-8 font-bold">
            <CalendarIcon className="w-4 h-4 mr-2" /> Queue Now
          </Button>
        </div>
      </div>

      <Card className="bg-slate-900/50 border-slate-800 glass-panel rounded-[3rem] overflow-hidden">
        <CardContent className="p-10">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-6">
              <h2 className="text-2xl font-black text-white uppercase">April 2026</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="p-2 h-auto rounded-xl border-slate-800">
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="sm" className="p-2 h-auto rounded-xl border-slate-800">
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <div className="flex gap-8">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Published</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Scheduled</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {isLoading ? (
              <div className="flex justify-center py-20 text-blue-500">
                <Clock className="w-10 h-10 animate-spin" />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20 bg-slate-950/50 rounded-[2rem] border border-dashed border-slate-800">
                <CalendarIcon className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No scheduled posts</h3>
                <p className="text-slate-500 max-w-sm mx-auto">Start scheduling your clips from the project results page to see them here.</p>
              </div>
            ) : (
              posts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all group"
                >
                  <div className="flex items-center gap-8">
                    <div className="text-center min-w-[60px]">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{new Date(post.scheduledFor).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                      <p className="text-2xl font-black text-white">{new Date(post.scheduledFor).getDate()}</p>
                    </div>
                    
                    <div className="w-16 h-16 bg-slate-800 rounded-2xl overflow-hidden relative">
                       <div className="absolute inset-0 flex items-center justify-center bg-blue-500/20">
                          <Play className="w-6 h-6 text-blue-400" />
                       </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{post.title}</h4>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          {getPlatformIcon(post.account.platform)}
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{post.account.username}</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-slate-800"></div>
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Clock className="w-3 h-3" />
                          <span className="text-[10px] font-black uppercase tracking-widest">{new Date(post.scheduledFor).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <Badge className={`uppercase text-[10px] font-black tracking-widest border px-3 py-1 ${getStatusColor(post.status)}`}>
                      {post.status}
                    </Badge>
                    <button className="text-slate-600 hover:text-white transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
