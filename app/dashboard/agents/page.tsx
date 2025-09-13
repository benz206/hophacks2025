"use client";

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';

type AssistantSummary = {
  name?: string;
  firstMessage?: string;
} | null;

type AgentRow = {
  id: string;
  agent_id: string;
  assistant?: AssistantSummary;
  assistantError?: string;
};

export default function AgentsPage() {
  const [name, setName] = useState("");
  const [firstmessage, setFirstMessage] = useState("");
  const [systemprompt, setSystemPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const [agents, setAgents] = useState<AgentRow[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<AgentRow | null>(null);
  const [editName, setEditName] = useState("");
  const [editFirst, setEditFirst] = useState("");
  const [editSystem, setEditSystem] = useState("");
  const [destNumbers, setDestNumbers] = useState<Record<string, string>>({});

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
      console.log(data.agents);
    } catch {
      // ignore list error in UI status; keep page functional
    } finally {
      setInitialLoading(false);
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

      // 2) Save to Supabase
      const resSave = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: assistant.id })
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

  async function handleRowCall(row: AgentRow) {
    const agentId = row.agent_id;
    const number = destNumbers[row.agent_id];
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

  async function handleRowUpdate(row: AgentRow) {
    const body: { name?: string; firstmessage?: string; systemprompt?: string } = {
      name: editName,
      firstmessage: editFirst,
      systemprompt: editSystem,
    };
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch(`/api/vapi/assistants/${row.agent_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error('Failed to update agent');
      setStatus('Agent updated.');
      await loadAgents();
      setEditOpen(false);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  async function openEdit(row: AgentRow) {
    try {
      setEditing(row);
      const res = await fetch(`/api/vapi/assistants/${row.agent_id}`);
      if (res.ok) {
        const { assistant } = (await res.json()) as {
          assistant?: {
            name?: string;
            firstMessage?: string;
            model?: { messages?: Array<{ role?: string; content?: string }> };
          };
        };
        setEditName(assistant?.name ?? "");
        setEditFirst(assistant?.firstMessage ?? "");
        const systemMsg = assistant?.model?.messages?.find((m) => m?.role === 'system');
        setEditSystem(systemMsg?.content ?? "");
      } else {
        setEditName("");
        setEditFirst("");
        setEditSystem("");
      }
      setEditOpen(true);
    } catch {
      setEditName("");
      setEditFirst("");
      setEditSystem("");
      setEditOpen(true);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Agents</h1>
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
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Creating…
                    </>
                  ) : (
                    'Create Agent'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {status && (
        <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
          {status}
        </div>
      )}

      {initialLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Spinner size="md" />
            <span>Loading agents...</span>
          </div>
        </div>
      ) : agents.length === 0 ? (
        <div className="rounded-xl border p-5 bg-card text-sm text-muted-foreground">No agents yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {agents.map((a) => (
            <div key={a.id} className="rounded-lg border bg-card p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{a.assistant?.name ?? 'Untitled'}</h3>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`dest-${a.id}`} className="text-sm font-medium">Destination Number</Label>
                    <Input 
                      id={`dest-${a.id}`} 
                      placeholder="+1234567890" 
                      value={destNumbers[a.agent_id] ?? ''} 
                      onChange={(e) => setDestNumbers((prev) => ({ ...prev, [a.agent_id]: e.target.value }))}
                      className="w-full max-w-xs"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleDeleteAgent(a.id)} disabled={loading}>
                    {loading ? <Spinner size="sm" className="mr-2" /> : null}
                    Delete
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => openEdit(a)} disabled={loading}>
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => handleRowCall(a)} 
                    disabled={loading || !destNumbers[a.agent_id]}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {loading ? <Spinner size="sm" className="mr-2" /> : null}
                    Call
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit agent</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="edit-name">Name</Label>
              <Input id="edit-name" value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="edit-first">First message</Label>
              <Input id="edit-first" value={editFirst} onChange={(e) => setEditFirst(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="edit-system">System prompt</Label>
              <Input id="edit-system" value={editSystem} onChange={(e) => setEditSystem(e.target.value)} />
            </div>
            {/* Destination number is per-call; not saved on assistant */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditOpen(false)} disabled={loading}>Cancel</Button>
              <Button onClick={() => editing && handleRowUpdate(editing)} disabled={loading}>
                {loading ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Saving…
                  </>
                ) : (
                  'Save'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}


