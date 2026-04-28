"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Zap, Info, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Notifications() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const notifications = [
        {
            id: 1,
            title: "Project Completed",
            message: "Your video 'Product Demo' is ready.",
            time: "2 mins ago",
            icon: CheckCircle2,
            color: "text-emerald-500"
        },
        {
            id: 2,
            title: "New Template Available",
            message: "The 'High-Retention' Hook Pack is now live.",
            time: "1 hour ago",
            icon: Zap,
            color: "text-blue-500"
        },
        {
            id: 3,
            title: "System Update",
            message: "We've improved the AI synthesis engine.",
            time: "5 hours ago",
            icon: Info,
            color: "text-slate-400"
        }
    ];

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="hover:text-white transition-colors relative"
            >
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full border-2 border-slate-950"></span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-4 w-80 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-50 glass-panel"
                    >
                        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                            <h3 className="text-sm font-black text-white uppercase tracking-widest">Notifications</h3>
                            <button className="text-[10px] text-blue-500 font-bold hover:underline">Mark all read</button>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.map((n) => (
                                    <div key={n.id} className="p-4 border-b border-slate-800/50 hover:bg-white/5 transition-colors cursor-pointer">
                                        <div className="flex gap-3">
                                            <div className={`mt-1 ${n.color}`}>
                                                <n.icon className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-bold text-white mb-1">{n.title}</p>
                                                <p className="text-[10px] text-slate-400 leading-relaxed mb-2">{n.message}</p>
                                                <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest">{n.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-10 text-center">
                                    <p className="text-xs text-slate-500">No new notifications</p>
                                </div>
                            )}
                        </div>
                        <div className="p-4 bg-slate-950/50 text-center">
                            <button className="text-[10px] text-slate-500 font-bold hover:text-white transition-colors">View all notifications</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
