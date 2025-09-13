"use client";

import * as React from "react";
import { fakeProfile } from "@/lib/fake-data";
import { Button } from "@/components/ui/button";
import { AmbientGradient } from "@/components/ambient-gradient";

export function SettingsForm() {
  const [profile, setProfile] = React.useState(fakeProfile);
  const [saved, setSaved] = React.useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    const timer = setTimeout(() => setSaved(false), 1200);
    return () => clearTimeout(timer);
  }

  return (
    <form onSubmit={handleSave} className="relative grid gap-6 md:grid-cols-2">
      <div className="relative rounded-xl border bg-card p-5 overflow-hidden">
        <AmbientGradient variant="blue" className="opacity-60" />
        <div className="relative">
          <div className="text-sm font-medium">Organization</div>
          <input
            className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            value={profile.organization}
            onChange={(e) => setProfile({ ...profile, organization: e.target.value })}
          />
          <div className="mt-4 text-sm font-medium">Contact Email</div>
          <input
            className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
          <div className="mt-4 text-sm font-medium">Phone Number</div>
          <input
            className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            value={profile.phoneNumber}
            onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
          />
        </div>
      </div>

      <div className="relative rounded-xl border bg-card p-5 overflow-hidden">
        <AmbientGradient variant="sunset" className="opacity-60" />
        <div className="relative">
          <div className="text-sm font-medium">Notifications</div>
          <label className="mt-3 flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={profile.notifications.callSummaryEmails}
              onChange={(e) => setProfile({ ...profile, notifications: { ...profile.notifications, callSummaryEmails: e.target.checked } })}
            />
            Call summary emails
          </label>
          <label className="mt-3 flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={profile.notifications.weeklyReport}
              onChange={(e) => setProfile({ ...profile, notifications: { ...profile.notifications, weeklyReport: e.target.checked } })}
            />
            Weekly report
          </label>
          <label className="mt-3 flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={profile.notifications.lowBalance}
              onChange={(e) => setProfile({ ...profile, notifications: { ...profile.notifications, lowBalance: e.target.checked } })}
            />
            Low balance alerts
          </label>
        </div>
      </div>

      <div className="relative rounded-xl border bg-card p-5 overflow-hidden md:col-span-2">
        <AmbientGradient variant="violet" className="opacity-60" />
        <div className="relative">
          <div className="text-sm font-medium">API</div>
          <div className="mt-2 flex items-center gap-3">
            <code className="rounded-md border bg-muted/30 px-2 py-1 text-xs">{profile.api.apiKeyMasked}</code>
            <Button type="button" variant="outline" size="sm">Copy</Button>
          </div>
        </div>
      </div>

      <div className="md:col-span-2 flex justify-end">
        <Button type="submit">{saved ? "Saved" : "Save changes"}</Button>
      </div>
    </form>
  );
}


