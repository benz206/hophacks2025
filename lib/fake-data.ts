export type CallStatus = "completed" | "missed" | "failed" | "ongoing";

export type CallDirection = "inbound" | "outbound";

export type Call = {
  id: string;
  assistantName: string;
  customerNumber: string;
  startedAt: string; // ISO timestamp
  durationSec: number;
  direction: CallDirection;
  status: CallStatus;
  sentiment: "positive" | "neutral" | "negative";
  costUsd: number;
  recordingUrl?: string;
  transcriptSummary?: string;
};

export type UsageSummary = {
  month: string; // e.g. "2025-09"
  totalMinutes: number;
  totalCalls: number;
  avgDurationSec: number;
  successRatePct: number; // 0-100
};

export type Profile = {
  organization: string;
  email: string;
  phoneNumber: string;
  notifications: {
    callSummaryEmails: boolean;
    weeklyReport: boolean;
    lowBalance: boolean;
  };
  api: {
    apiKeyMasked: string;
  };
};

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

export const fakeCalls: Call[] = [
  {
    id: "call_01HE3A",
    assistantName: "Support Bot",
    customerNumber: "+1 415-555-0118",
    startedAt: daysAgo(1),
    durationSec: 482,
    direction: "outbound",
    status: "completed",
    sentiment: "positive",
    costUsd: 0.96,
    recordingUrl: "#",
    transcriptSummary:
      "Resolved billing inquiry and confirmed plan change. Customer satisfied and thanked the agent.",
  },
  {
    id: "call_01HE3B",
    assistantName: "Sales Concierge",
    customerNumber: "+1 646-555-0199",
    startedAt: daysAgo(2),
    durationSec: 301,
    direction: "outbound",
    status: "completed",
    sentiment: "neutral",
    costUsd: 0.61,
    recordingUrl: "#",
    transcriptSummary: "Shared pricing and booked a demo for next Tuesday.",
  },
  {
    id: "call_01HE3C",
    assistantName: "Support Bot",
    customerNumber: "+1 202-555-0129",
    startedAt: daysAgo(0),
    durationSec: 0,
    direction: "inbound",
    status: "missed",
    sentiment: "neutral",
    costUsd: 0,
  },
  {
    id: "call_01HE3D",
    assistantName: "Sales Concierge",
    customerNumber: "+1 312-555-0136",
    startedAt: daysAgo(3),
    durationSec: 712,
    direction: "inbound",
    status: "completed",
    sentiment: "positive",
    costUsd: 1.42,
    transcriptSummary: "Qualified lead, discussed integration, sent follow-up email with docs.",
  },
  {
    id: "call_01HE3E",
    assistantName: "Support Bot",
    customerNumber: "+1 206-555-0174",
    startedAt: daysAgo(5),
    durationSec: 226,
    direction: "outbound",
    status: "failed",
    sentiment: "neutral",
    costUsd: 0.0,
  },
];

export const fakeUsage: UsageSummary = {
  month: new Date().toISOString().slice(0, 7),
  totalMinutes: Math.round(fakeCalls.reduce((m, c) => m + c.durationSec, 0) / 60),
  totalCalls: fakeCalls.length,
  avgDurationSec:
    Math.round(
      fakeCalls.filter((c) => c.durationSec > 0).reduce((m, c) => m + c.durationSec, 0) /
        Math.max(1, fakeCalls.filter((c) => c.durationSec > 0).length)
    ),
  successRatePct:
    Math.round(
      (fakeCalls.filter((c) => c.status === "completed").length / Math.max(1, fakeCalls.length)) * 100
    ),
};

export const fakeProfile: Profile = {
  organization: "Cogent Labs",
  email: "you@example.com",
  phoneNumber: "+1 202-555-0147",
  notifications: {
    callSummaryEmails: true,
    weeklyReport: true,
    lowBalance: false,
  },
  api: {
    apiKeyMasked: "sk_live_••••••••••••••••ABCD",
  },
};


