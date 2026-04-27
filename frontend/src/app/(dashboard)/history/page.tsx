"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function HistoryPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Export History</h1>
        <p className="text-slate-400">View and redownload your previously generated viral shorts.</p>
      </div>

      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Recent Exports</CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center text-slate-500 py-20">
          <p>No exports found.</p>
        </CardContent>
      </Card>
    </div>
  )
}
