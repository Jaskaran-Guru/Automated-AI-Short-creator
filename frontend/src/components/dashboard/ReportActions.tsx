"use client";

import { Eye, Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";

export function ReportActions({ shareToken }: { shareToken: string | null }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (!shareToken) return;
    const url = `${window.location.origin}/reports/${shareToken}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!shareToken) {
    return (
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-xs text-slate-500">Not shared</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <Link href={`/reports/${shareToken}`} target="_blank">
        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </Button>
      </Link>
      <Button 
        variant="ghost" 
        size="sm" 
        className={copied ? "text-emerald-400" : "text-blue-400"}
        onClick={handleCopyLink}
      >
        {copied ? <Check className="w-4 h-4 mr-2" /> : <Share2 className="w-4 h-4 mr-2" />}
        {copied ? "Copied!" : "Copy Link"}
      </Button>
    </div>
  );
}
