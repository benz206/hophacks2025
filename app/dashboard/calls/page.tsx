export const metadata = { title: "Calls • Dashboard" };

export default function CallsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Calls</h1>
      </div>
      {/* Client table renders fake data */}
      <CallsClient />
    </div>
  );
}
import CallsClient from "./client";


