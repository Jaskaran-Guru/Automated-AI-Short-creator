"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface GenerateReportButtonProps {
    variant?: "premium" | "default" | "outline" | "ghost";
    className?: string;
    label?: string;
}

export function GenerateReportButton({ 
    variant = "premium", 
    className = "",
    label = "Generate New Report"
}: GenerateReportButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleGenerate = async () => {
        try {
            setIsLoading(true);
            const res = await fetch("/api/reports/generate", {
                method: "POST"
            });

            if (res.ok) {
                router.refresh();
            } else {
                console.error("Failed to generate report");
            }
        } catch (error) {
            console.error("Error generating report:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button 
            variant={variant} 
            className={className}
            onClick={handleGenerate}
            disabled={isLoading}
        >
            {isLoading ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
                <Plus className="w-5 h-5 mr-2" />
            )}
            {isLoading ? "Generating..." : label}
        </Button>
    );
}
