"use client";

import { useEffect, useState } from 'react';
import { CallsTable } from "@/components/dashboard/calls-table";
import { Spinner } from "@/components/ui/spinner";
import { Call } from "@/lib/fake-data";

type CallRecord = {
  id: string;
  user_id: string;
  call_id: string;
  created_at: string;
};

export default function CallsClient() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCalls() {
      try {
        setLoading(true);
        setError(null);

        // Get user's call records from Supabase
        const res = await fetch('/api/calls');
        if (!res.ok) throw new Error('Failed to fetch calls');
        const { calls: callRecords } = await res.json();

        // Fetch detailed call data from Vapi for each call
        const detailedCalls = await Promise.all(
          callRecords.map(async (record: CallRecord) => {
            try {
              const callRes = await fetch(`/api/vapi/calls/${record.call_id}`);
              if (!callRes.ok) throw new Error('Failed to fetch call details');
              const { call } = await callRes.json();

              // Transform Vapi call data to match our Call type
              const durationSec = call.startedAt && call.endedAt 
                ? Math.floor((new Date(call.endedAt).getTime() - new Date(call.startedAt).getTime()) / 1000)
                : 0;

              return {
                id: record.id,
                assistantName: call.assistant?.name || 'Unknown Assistant',
                customerNumber: call.customer?.number || 'Unknown Number',
                startedAt: call.startedAt || record.created_at,
                durationSec: durationSec,
                direction: call.type === 'outboundPhoneCall' ? 'outbound' : 'inbound',
                status: call.status === 'ended' ? 'completed' : 
                       call.status === 'failed' ? 'failed' : 
                       call.status === 'ringing' ? 'ongoing' : 'ongoing',
                sentiment: call.analysis?.successEvaluation === 'true' ? 'positive' : 
                         call.analysis?.successEvaluation === 'false' ? 'negative' : 'neutral',
                costUsd: call.cost || 0,
                recordingUrl: call.recordingUrl,
                transcriptSummary: call.summary || call.analysis?.summary,
                // Store full Vapi data for detailed view
                vapiData: call
              } as Call & { vapiData?: any };
            } catch (err) {
              console.error(`Failed to fetch call ${record.call_id}:`, err);
              return null;
            }
          })
        );

        // Filter out failed calls
        setCalls(detailedCalls.filter((call): call is Call => call !== null));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load calls');
      } finally {
        setLoading(false);
      }
    }

    loadCalls();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Spinner size="md" />
          <span>Loading calls...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border p-5 bg-card text-sm text-destructive">
        Error: {error}
      </div>
    );
  }

  return <CallsTable calls={calls} />;
}


