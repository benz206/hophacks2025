"use client";

import * as React from "react";
import { Call } from "@/lib/fake-data";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

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
  const [assistantDetails, setAssistantDetails] = React.useState<Record<string, any>>({});
  const [loadingAssistant, setLoadingAssistant] = React.useState<string | null>(null);
  
  const filtered = React.useMemo(() => {
    return calls.filter((c) =>
      [c.customerNumber, c.status, c.direction].some((v) => v.toLowerCase().includes(query.toLowerCase()))
    );
  }, [calls, query]);

  const fetchAssistantDetails = async (assistantId: string) => {
    if (assistantDetails[assistantId]) return; // Already fetched
    
    setLoadingAssistant(assistantId);
    try {
      const res = await fetch(`/api/vapi/assistants/${assistantId}`);
      if (res.ok) {
        const { assistant } = await res.json();
        setAssistantDetails(prev => ({ ...prev, [assistantId]: assistant }));
      }
    } catch (error) {
      console.error('Failed to fetch assistant details:', error);
    } finally {
      setLoadingAssistant(null);
    }
  };

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
                  <td className="p-3 whitespace-nowrap">{c.customerNumber}</td>
                  <td className="p-3 whitespace-nowrap">{new Date(c.startedAt).toLocaleString()}</td>
                  <td className="p-3 whitespace-nowrap">{c.durationSec > 0 ? `${minutes}:${String(seconds).padStart(2, "0")}` : "—"}</td>
                  <td className="p-3 whitespace-nowrap capitalize">{c.direction}</td>
                  <td className="p-3 whitespace-nowrap"><StatusBadge status={c.status} /></td>
                  <td className="p-3 whitespace-nowrap text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const assistantId = (c as any).vapiData?.assistantId;
                            if (assistantId) {
                              fetchAssistantDetails(assistantId);
                            }
                          }}
                        >
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            Call from {assistantDetails[(c as any).vapiData?.assistantId]?.name || 'Assistant'} → {c.customerNumber}
                          </DialogTitle>
                          <DialogDescription>
                            {c.customerNumber}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 text-sm max-h-96 overflow-y-auto">
                          {/* Basic Info */}
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
                          </div>

                          {/* Analysis Summary */}
                          {(c as any).vapiData?.analysis?.summary && (
                            <div className="border-t pt-3">
                              <h4 className="font-medium mb-2">Analysis Summary</h4>
                              <div className="rounded-md border bg-muted/30 p-3 text-xs">
                                {(c as any).vapiData.analysis.summary}
                              </div>
                            </div>
                          )}

                          {/* Assistant Details */}
                          {(c as any).vapiData?.assistantId && (
                            <div className="border-t pt-3">
                              <h4 className="font-medium mb-2">Assistant Details</h4>
                              {loadingAssistant === (c as any).vapiData.assistantId ? (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Spinner size="sm" />
                                  <span>Loading assistant details...</span>
                                </div>
                              ) : assistantDetails[(c as any).vapiData.assistantId] ? (
                                <div className="space-y-2 text-xs">
                                  <div>
                                    <span className="text-muted-foreground">Name:</span> {assistantDetails[(c as any).vapiData.assistantId].name || 'Unknown'}
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">First Message:</span> {assistantDetails[(c as any).vapiData.assistantId].firstMessage || '—'}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-muted-foreground text-xs">Assistant details not available</div>
                              )}
                            </div>
                          )}

                          {/* Vapi-specific data */}
                          {(c as any).vapiData && (
                            <>
                              {/* Call Details */}
                              <div className="border-t pt-3">
                                <h4 className="font-medium mb-2">Call Details</h4>
                                <div className="grid grid-cols-2 gap-3 text-xs">
                                  <div>
                                    <div className="text-muted-foreground">Call ID</div>
                                    <div className="font-mono text-xs">{c.id}</div>
                                  </div>
                                  <div>
                                    <div className="text-muted-foreground">Ended Reason</div>
                                    <div className="capitalize">{(c as any).vapiData.endedReason?.replace(/-/g, ' ') || '—'}</div>
                                  </div>
                                  <div>
                                    <div className="text-muted-foreground">Provider</div>
                                    <div className="capitalize">{(c as any).vapiData.phoneCallProvider || '—'}</div>
                                  </div>
                                  <div>
                                    <div className="text-muted-foreground">Transport</div>
                                    <div className="uppercase">{(c as any).vapiData.phoneCallTransport || '—'}</div>
                                  </div>
                                </div>
                              </div>

                              {/* Full Transcript */}
                              {(c as any).vapiData.transcript && (
                                <div className="border-t pt-3">
                                  <h4 className="font-medium mb-2">Full Transcript</h4>
                                  <div className="rounded-md border bg-muted/30 p-3 text-xs font-mono whitespace-pre-wrap max-h-32 overflow-y-auto">
                                    {(c as any).vapiData.transcript}
                                  </div>
                                </div>
                              )}

                              {/* Messages */}
                              {(c as any).vapiData.messages && (c as any).vapiData.messages.length > 0 && (
                                <div className="border-t pt-3">
                                  <h4 className="font-medium mb-2">Conversation</h4>
                                  <div className="space-y-2 max-h-40 overflow-y-auto">
                                    {(c as any).vapiData.messages
                                      .filter((msg: any) => msg.role === 'bot' || msg.role === 'user')
                                      .map((msg: any, idx: number) => (
                                        <div key={idx} className={`text-xs p-2 rounded ${
                                          msg.role === 'bot' ? 'bg-blue-50 dark:bg-blue-950/20 ml-4' : 'bg-gray-50 dark:bg-gray-950/20 mr-4'
                                        }`}>
                                          <div className="font-medium text-muted-foreground mb-1">
                                            {msg.role === 'bot' ? 'AI Assistant' : 'Customer'}
                                            {msg.duration && (
                                              <span className="ml-2 text-xs">({(msg.duration / 1000).toFixed(1)}s)</span>
                                            )}
                                          </div>
                                          <div>{msg.message}</div>
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              )}
                            </>
                          )}

                          {/* Fallback for basic data */}
                          {!((c as any).vapiData) && c.transcriptSummary && (
                            <div>
                              <div className="text-muted-foreground mb-1">Summary</div>
                              <div className="rounded-md border bg-muted/30 p-3">{c.transcriptSummary}</div>
                            </div>
                          )}

                          {/* Recording Links */}
                          {c.recordingUrl && (
                            <div className="border-t pt-3">
                              <h4 className="font-medium mb-2">Recordings</h4>
                              <div className="space-y-2">
                                <a href={c.recordingUrl} className="text-primary underline text-xs block" target="_blank" rel="noreferrer">
                                  📹 Mono Recording
                                </a>
                                {(c as any).vapiData?.stereoRecordingUrl && (
                                  <a href={(c as any).vapiData.stereoRecordingUrl} className="text-primary underline text-xs block" target="_blank" rel="noreferrer">
                                    🎧 Stereo Recording
                                  </a>
                                )}
                              </div>
                            </div>
                          )}
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


