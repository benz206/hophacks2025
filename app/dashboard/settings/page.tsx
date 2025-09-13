export const metadata = { title: "Settings • Dashboard" };

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <SettingsForm />
    </div>
  );
}

import { SettingsForm } from "@/components/dashboard/settings-form";


