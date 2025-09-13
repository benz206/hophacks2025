"use client";

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

type AgentMetadata = { name?: string; firstmessage?: string; systemprompt?: string }
type Assistant = { name: string; firstMessage?: string }
type Agent = { id: string; agent_id: string; metadata?: AgentMetadata; assistant?: Assistant; assistantError?: string }

export default function AgentsPage() {
  const [name, setName] = useState("");
  const [firstmessage, setFirstMessage] = useState("");
  const [systemprompt, setSystemPrompt] = useState("");
  const [assistantId, setAssistantId] = useState<string | null>(null);
  const [phoneNumberId, setPhoneNumberId] = useState("");
  const [customerNumber, setCustomerNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [callNumbers, setCallNumbers] = useState<Record<string, string>>({});
  const [createOpen, setCreateOpen] = useState(false);

  function resetCreateForm() {
    setName("");
    setFirstMessage("");
    setSystemPrompt("");
  }

  async function loadAgents() {
    try {
      const res = await fetch('/api/agents', { method: 'GET' });
      if (!res.ok) throw new Error('Failed to fetch agents');
      const data = await res.json();
      setAgents(data.agents || []);
    } catch {
      // ignore list error in UI status; keep page functional
    }
  }

  async function handleDeleteAgent(rowId: string) {
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch(`/api/agents/${rowId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete agent');
      setStatus('Agent deleted.');
      await loadAgents();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAgents();
  }, []);

  async function handleCreateAgent(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      // 1) Create Vapi Assistant
      const resAssistant = await fetch('/api/vapi/assistants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, firstmessage, systemprompt })
      });
      if (!resAssistant.ok) throw new Error('Failed to create assistant');
      const { assistant } = await resAssistant.json();
      setAssistantId(assistant.id);

      // 2) Save to Supabase
      const resSave = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: assistant.id, metadata: { name, firstmessage, systemprompt } })
      });
      if (!resSave.ok) throw new Error('Failed to save agent');

      setStatus('Assistant created and saved.');
      // refresh list
      loadAgents();
      // close modal and reset form
      setCreateOpen(false);
      resetCreateForm();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  async function handlePatchPhoneNumber() {
    if (!assistantId || !phoneNumberId) return;
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch(`/api/vapi/phone-number/${phoneNumberId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assistantId })
      });
      if (!res.ok) throw new Error('Failed to patch phone number');
      setStatus('Phone number patched to assistant.');
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  async function handleCall() {
    if (!assistantId || !customerNumber) return;
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch('/api/vapi/calls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assistantId, customerNumber })
      });
      if (!res.ok) throw new Error('Failed to create call');
      setStatus('Outbound call created.');
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  async function handleRowCall(agentId: string) {
    const number = callNumbers[agentId];
    if (!agentId || !number) return;
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch('/api/vapi/calls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assistantId: agentId, customerNumber: number })
      });
      if (!res.ok) throw new Error('Failed to create call');
      setStatus('Outbound call created.');
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Agents</h1>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>New Agent</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create agent</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateAgent} className="grid gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Support Assistant" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="first">First message</Label>
                <Input id="first" placeholder="Hello! How can I help you today?" value={firstmessage} onChange={(e) => setFirstMessage(e.target.value)} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="system">System prompt</Label>
                <Input id="system" placeholder="You are a friendly phone support assistant..." value={systemprompt} onChange={(e) => setSystemPrompt(e.target.value)} />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setCreateOpen(false)} disabled={loading}>Cancel</Button>
                <Button type="submit" disabled={loading}>{loading ? 'Creating…' : 'Create Agent'}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Your agents</CardTitle>
        </CardHeader>
        <CardContent>
          {agents.length === 0 ? (
            <div className="text-sm text-muted-foreground">No agents yet.</div>
          ) : (
            <div className="grid gap-3">
              {agents.map((a) => (
                <div key={a.id} className="rounded-lg border p-3">
                  <div className="font-medium">{a?.metadata?.name ?? 'Untitled'}</div>
                  <div className="text-xs text-muted-foreground">Agent ID: {a.agent_id}</div>
                  <div className="mt-2">
                    <Button variant="outline" size="sm" onClick={() => handleDeleteAgent(a.id)} disabled={loading}>Delete</Button>
                  </div>
                  {a.assistant ? (
                    <div className="mt-1 text-sm">
                      <div>Vapi Assistant: {a.assistant.name}</div>
                      {a.assistant.firstMessage && (
                        <div className="text-muted-foreground">First: {a.assistant.firstMessage}</div>
                      )}
                    </div>
                  ) : (
                    <div className="mt-1 text-sm text-red-600">
                      Unable to load Vapi assistant{a.assistantError ? `: ${a.assistantError}` : ''}
                    </div>
                  )}
                  <div className="mt-3 flex items-end gap-2">
                    <div className="flex-1 grid gap-1.5">
                      <Label htmlFor={`customer-${a.id}`}>Customer Number</Label>
                      <Input
                        id={`customer-${a.id}`}
                        placeholder="+1234567890"
                        value={callNumbers[a.agent_id] ?? ''}
                        onChange={(e) => setCallNumbers((prev) => ({ ...prev, [a.agent_id]: e.target.value }))}
                      />
                    </div>
                    <Button onClick={() => handleRowCall(a.agent_id)} disabled={loading || !callNumbers[a.agent_id]}>Call</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {assistantId && (
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="text-sm">Assistant ID: {assistantId}</div>
            <div className="flex gap-2 items-end">
              <div className="flex-1 grid gap-1.5">
                <Label htmlFor="phoneId">Phone Number ID</Label>
                <Input id="phoneId" placeholder="phn_..." value={phoneNumberId} onChange={(e) => setPhoneNumberId(e.target.value)} />
              </div>
              <Button onClick={handlePatchPhoneNumber} disabled={loading}>Patch Phone Number</Button>
            </div>
            <div className="flex gap-2 items-end">
              <div className="flex-1 grid gap-1.5">
                <Label htmlFor="customer">Customer Number (+1...)</Label>
                <Input id="customer" placeholder="+1234567890" value={customerNumber} onChange={(e) => setCustomerNumber(e.target.value)} />
              </div>
              <Button onClick={handleCall} disabled={loading}>Call</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {status && (
        <div className="mt-4 text-sm text-muted-foreground">{status}</div>
      )}
    </div>
  );
}


