"use client";

import { CallsTable } from "@/components/dashboard/calls-table";
import { fakeCalls } from "@/lib/fake-data";

export default function CallsClient() {
  return <CallsTable calls={fakeCalls} />;
}


