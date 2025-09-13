"use client";

import * as React from "react";
import { Call } from "@/lib/fake-data";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CallsTableProps = {
  calls: Call[];
};

function StatusBadge({ status }: { status: Call["status"] }) {
  const map: Record<Call["status"], string> = {
    completed: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
    missed: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
    failed: "text-red-600 dark:text-red-400 bg-red-500/10",
    ongoing: "text-blue-600 dark:text-blue-400 bg-blue-500/10",
  };
  return <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs", map[status])}>{status}</span>;
}

export function CallsTable({ calls }: CallsTableProps) {
  const [query, setQuery] = React.useState("");
  const filtered = React.useMemo(() => {
    return calls.filter((c) =>
      [c.assistantName, c.customerNumber, c.status, c.direction].some((v) => v.toLowerCase().includes(query.toLowerCase()))
    );
  }, [calls, query]);

  return (
    <div className="rounded-xl border bg-card">
      <div className="p-3 border-b">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search calls…"
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-muted-foreground">
            <tr className="border-b">
              <th className="text-left p-3 font-medium">Assistant</th>
              <th className="text-left p-3 font-medium">Customer</th>
              <th className="text-left p-3 font-medium">Started</th>
              <th className="text-left p-3 font-medium">Duration</th>
              <th className="text-left p-3 font-medium">Direction</th>
              <th className="text-left p-3 font-medium">Status</th>
              <th className="text-right p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => {
              const minutes = Math.floor(c.durationSec / 60);
              const seconds = c.durationSec % 60;
              return (
                <tr key={c.id} className="border-b last:border-0">
                  <td className="p-3 whitespace-nowrap">{c.assistantName}</td>
                  <td className="p-3 whitespace-nowrap">{c.customerNumber}</td>
                  <td className="p-3 whitespace-nowrap">{new Date(c.startedAt).toLocaleString()}</td>
                  <td className="p-3 whitespace-nowrap">{c.durationSec > 0 ? `${minutes}:${String(seconds).padStart(2, "0")}` : "—"}</td>
                  <td className="p-3 whitespace-nowrap capitalize">{c.direction}</td>
                  <td className="p-3 whitespace-nowrap"><StatusBadge status={c.status} /></td>
                  <td className="p-3 whitespace-nowrap text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">View</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Call {c.id}</DialogTitle>
                          <DialogDescription>
                            {c.assistantName} → {c.customerNumber}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3 text-sm">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <div className="text-muted-foreground">Started</div>
                              <div>{new Date(c.startedAt).toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Duration</div>
                              <div>{c.durationSec > 0 ? `${minutes}:${String(seconds).padStart(2, "0")}` : "—"}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Direction</div>
                              <div className="capitalize">{c.direction}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Status</div>
                              <div><StatusBadge status={c.status} /></div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Sentiment</div>
                              <div className="capitalize">{c.sentiment}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Cost</div>
                              <div>${c.costUsd.toFixed(2)}</div>
                            </div>
                          </div>
                          {c.transcriptSummary ? (
                            <div>
                              <div className="text-muted-foreground mb-1">Summary</div>
                              <div className="rounded-md border bg-muted/30 p-3">{c.transcriptSummary}</div>
                            </div>
                          ) : null}
                          {c.recordingUrl ? (
                            <div>
                              <a href={c.recordingUrl} className="text-primary underline" target="_blank" rel="noreferrer">Open recording</a>
                            </div>
                          ) : null}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}


