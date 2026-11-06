"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">View platform analytics and performance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Advertising Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Chart: Daily/Monthly ad clicks (Recharts)
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Chart: Streaming vs Download activity
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Placements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Placement {i}</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-3/4 bg-violet-600 rounded-full" />
                  <span className="text-muted-foreground">{100 - i * 15} clicks</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
