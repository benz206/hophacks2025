"use client";

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';

type AssistantSummary = {
  name?: string;
  firstMessage?: string;
} | null;

type AgentMetadata = {
  documents?: AgentDocument[];
  [key: string]: unknown;
};

type AgentDocument = {
  id: string;
  name: string;
  path?: string;
  bucket?: string;
  geminiFileUri?: string;
  markdown: string;
  uploadedAt: string;
};

type AgentRow = {
  id: string;
  agent_id: string;
  assistant?: AssistantSummary;
  assistantError?: string;
  metadata?: AgentMetadata;
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
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmCallRow, setConfirmCallRow] = useState<AgentRow | null>(null);
  const [createUploading, setCreateUploading] = useState(false);
  const [createUploadedMarkdown, setCreateUploadedMarkdown] = useState<string | null>(null);
  const [createUploadPrompt, setCreateUploadPrompt] = useState<string>("");
  const [createSelectedFile, setCreateSelectedFile] = useState<File | null>(null);
  const [editUploadingFile, setEditUploadingFile] = useState(false);
  const [editUploadedMarkdown, setEditUploadedMarkdown] = useState<string | null>(null);
  const [editUploadPrompt, setEditUploadPrompt] = useState<string>("");
  const [editSelectedFile, setEditSelectedFile] = useState<File | null>(null);

  const sanitizePhoneInput = (val: string) => val.replace(/\D/g, '').slice(0, 10);
  const isValidPhone = (val: string) => /^\d{10}$/.test(val);

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
      toast.success('Agent deleted');
      await loadAgents();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Unknown error');
      toast.error(err instanceof Error ? err.message : 'Failed to delete agent');
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
      toast.success('Assistant created');
      // refresh list
      loadAgents();
      // close modal and reset form
      setCreateOpen(false);
      resetCreateForm();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Unknown error');
      toast.error(err instanceof Error ? err.message : 'Failed to create assistant');
    } finally {
      setLoading(false);
    }
  }

  async function extractFileToMarkdown(file: File, prompt: string, setBusy: (v: boolean) => void, setMd: (v: string) => void) {
    try {
      setBusy(true);
      setMd("");
      const fd = new FormData();
      fd.append('file', file);
      if (prompt) fd.append('prompt', prompt);
      const res = await fetch('/api/files/extract', { method: 'POST', body: fd });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || 'Failed to extract');
      }
      const j = await res.json();
      setMd(j.markdown || '');
      toast.success('File processed');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setBusy(false);
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
      toast.success('Call started');
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Unknown error');
      toast.error(err instanceof Error ? err.message : 'Failed to start call');
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
      toast.success('Agent updated');
      await loadAgents();
      setEditOpen(false);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Unknown error');
      toast.error(err instanceof Error ? err.message : 'Failed to update agent');
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
              {/* Create: Document Upload */}
              <div className="grid gap-1.5 mt-2">
                <Label htmlFor="create-upload-prompt">Extraction prompt (optional)</Label>
                <Input id="create-upload-prompt" placeholder="e.g., Extract key facts, entities, and summarize sections" value={createUploadPrompt} onChange={(e) => setCreateUploadPrompt(e.target.value)} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="create-file">Attach file</Label>
                <Input id="create-file" type="file" className="cursor-pointer" onChange={(e) => setCreateSelectedFile(e.target.files?.[0] ?? null)} />
              </div>
              <div className="flex justify-end">
                <Button type="button" variant="outline" onClick={async () => {
                  if (!createSelectedFile) {
                    toast.error('Please choose a file');
                    return;
                  }
                  await extractFileToMarkdown(createSelectedFile, createUploadPrompt, setCreateUploading, (md) => {
                    setCreateUploadedMarkdown(md);
                    // Insert into system prompt directly
                    setSystemPrompt((prev) => (prev ? `${prev}\n\n${md}` : md));
                  });
                }} disabled={createUploading || !createSelectedFile}>
                  {createUploading ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Uploading...
                    </>
                  ) : (
                    'Upload & Extract'
                  )}
                </Button>
              </div>
              {createUploadedMarkdown ? (
                <div className="mt-1">
                  <Label>Extracted Markdown</Label>
                  <div className="mt-2 rounded-md border bg-background p-3 max-h-48 overflow-auto text-sm whitespace-pre-wrap">
                    {createUploadedMarkdown}
                  </div>
                </div>
              ) : null}
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

      {/* Global uploader removed in favor of per-agent uploads */}

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
            <div key={a.id} className="rounded-lg border bg-card p-4 shadow-sm flex flex-col">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold text-foreground">{a.assistant?.name ?? 'Untitled'}</h3>
                <Button variant="secondary" size="sm" onClick={() => openEdit(a)} disabled={loading}>
                  Edit
                </Button>
              </div>
              <div className="flex-1 space-y-3 mt-2">
                <div className="space-y-2">
                  {(() => {
                    const value = destNumbers[a.agent_id] ?? '';
                    const valid = isValidPhone(value);
                    return (
                      <>
                        <Label htmlFor={`dest-${a.id}`} className="text-sm font-medium">Destination Number</Label>
                        <Input
                          id={`dest-${a.id}`}
                          placeholder="5551234567"
                          inputMode="numeric"
                          aria-invalid={value !== '' && !valid}
                          value={value}
                          onChange={(e) => {
                            const next = sanitizePhoneInput(e.target.value);
                            setDestNumbers((prev) => ({ ...prev, [a.agent_id]: next }));
                          }}
                          className="w-full"
                        />
                        {value !== '' && !valid ? (
                          <p className="text-sm text-destructive">Please enter a 10-digit phone number.</p>
                        ) : null}
                      </>
                    );
                  })()}
                </div>
                {/* Per-agent document upload */}
                <div className="space-y-2 mt-2">
                  <Label className="text-sm font-medium">Agent documents</Label>
                  <PerAgentUploader agentRow={a} />
                </div>
                {/* Show last extracted markdown summary (collapsed preview) */}
                {a.metadata?.lastExtractedMarkdown ? (
                  <div className="rounded-md border bg-background p-2 text-xs max-h-32 overflow-auto whitespace-pre-wrap">
                    {String(a.metadata.lastExtractedMarkdown).slice(0, 800)}{String(a.metadata.lastExtractedMarkdown).length > 800 ? '…' : ''}
                  </div>
                ) : null}
              </div>
              <div className="mt-4 flex items-center justify-between gap-2">
                <Button variant="destructive" size="sm" onClick={() => setConfirmDeleteId(a.id)} disabled={loading}>
                  {loading ? <Spinner size="sm" className="mr-2" /> : null}
                  Delete
                </Button>
                {(() => {
                  const value = destNumbers[a.agent_id] ?? '';
                  const valid = isValidPhone(value);
                  return (
                    <Button
                      size="sm"
                      onClick={() => setConfirmCallRow(a)}
                      disabled={loading || !valid}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {loading ? <Spinner size="sm" className="mr-2" /> : null}
                      Call
                    </Button>
                  );
                })()}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!confirmDeleteId} onOpenChange={(o) => { if (!o) setConfirmDeleteId(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete agent?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmDeleteId(null)} disabled={loading}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (confirmDeleteId) {
                  await handleDeleteAgent(confirmDeleteId);
                  setConfirmDeleteId(null);
                }
              }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm Call */}
      <Dialog open={!!confirmCallRow} onOpenChange={(o) => { if (!o) setConfirmCallRow(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start call?</DialogTitle>
          </DialogHeader>
          {confirmCallRow ? (
            <p className="text-sm text-muted-foreground">
              Call {confirmCallRow.assistant?.name ?? 'agent'} at {destNumbers[confirmCallRow.agent_id] ?? ''}?
            </p>
          ) : null}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmCallRow(null)} disabled={loading}>Cancel</Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={async () => {
                if (confirmCallRow) {
                  await handleRowCall(confirmCallRow);
                  setConfirmCallRow(null);
                }
              }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Calling...
                </>
              ) : (
                'Call'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
            {/* Edit: Document Upload */}
            <div className="grid gap-1.5 mt-2">
              <Label htmlFor="edit-upload-prompt">Extraction prompt (optional)</Label>
              <Input id="edit-upload-prompt" placeholder="e.g., Extract key facts, entities, and summarize sections" value={editUploadPrompt} onChange={(e) => setEditUploadPrompt(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="edit-file">Attach file</Label>
              <Input id="edit-file" type="file" className="cursor-pointer" onChange={(e) => setEditSelectedFile(e.target.files?.[0] ?? null)} />
            </div>
            <div className="flex justify-end">
              <Button type="button" variant="outline" onClick={async () => {
                if (!editSelectedFile) {
                  toast.error('Please choose a file');
                  return;
                }
                await extractFileToMarkdown(editSelectedFile, editUploadPrompt, setEditUploadingFile, (md) => {
                  setEditUploadedMarkdown(md);
                  // Insert into edit system prompt directly
                  setEditSystem((prev) => (prev ? `${prev}\n\n${md}` : md));
                });
              }} disabled={editUploadingFile || !editSelectedFile}>
                {editUploadingFile ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Uploading...
                  </>
                ) : (
                  'Upload & Extract'
                )}
              </Button>
            </div>
            {editUploadedMarkdown ? (
              <div className="mt-1">
                <Label>Extracted Markdown</Label>
                <div className="mt-2 rounded-md border bg-background p-3 max-h-48 overflow-auto text-sm whitespace-pre-wrap">
                  {editUploadedMarkdown}
                </div>
              </div>
            ) : null}
            {/* Destination number is per-call; not saved on assistant */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditOpen(false)} disabled={loading}>Cancel</Button>
              <Button onClick={() => editing && handleRowUpdate(editing)} disabled={loading}>
                {loading ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Saving...
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

function PerAgentUploader({ agentRow }: { agentRow: AgentRow }) {
  const [files, setFiles] = useState<FileList | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [busy, setBusy] = useState(false);

  async function run() {
    if (!files || files.length === 0) return;
    try {
      setBusy(true);
      const collected: AgentDocument[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files.item(i)!;
        const fd = new FormData();
        fd.append('file', file);
        if (prompt) fd.append('prompt', prompt);
        const res = await fetch('/api/files/extract', { method: 'POST', body: fd });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error || 'Failed to extract');
        }
        const j = await res.json();
        const doc: AgentDocument = {
          id: `${Date.now()}-${i}`,
          name: file.name,
          markdown: j.markdown || '',
          uploadedAt: new Date().toISOString(),
        };
        collected.push(doc);
      }

      const combined = collected.map((d) => d.markdown).join('\n\n');
      const resAssistant = await fetch(`/api/vapi/assistants/${agentRow.agent_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemprompt: combined })
      });
      if (!resAssistant.ok) {
        const jj = await resAssistant.json().catch(() => ({}));
        throw new Error(jj.error || 'Failed to update assistant prompt');
      }

      const existingDocs = Array.isArray(agentRow.metadata?.documents) ? agentRow.metadata?.documents as AgentDocument[] : [];
      const nextDocs = [...collected, ...existingDocs];
      const saveMeta = await fetch(`/api/agents/${agentRow.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metadata: { ...(agentRow.metadata ?? {}), documents: nextDocs, lastExtractedMarkdown: collected[0]?.markdown || '' } })
      });
      if (!saveMeta.ok) {
        const jj2 = await saveMeta.json().catch(() => ({}));
        throw new Error(jj2.error || 'Failed to save preview to agent');
      }
      toast.success('Assistant prompt updated with extracted text');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-2">
      <Input placeholder="Extraction prompt (optional)" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
      <Input type="file" multiple className="cursor-pointer" onChange={(e) => setFiles(e.target.files)} />
      <div className="flex justify-end">
        <Button size="sm" variant="outline" onClick={run} disabled={busy || !files || files.length === 0}>
          {busy ? (<><Spinner size="sm" className="mr-1" /> Processing...</>) : 'Upload & Extract'}
        </Button>
      </div>
      <div className="grid gap-2">
        {Array.isArray(agentRow.metadata?.documents) && (agentRow.metadata!.documents as AgentDocument[]).length > 0 ? (
          (agentRow.metadata!.documents as AgentDocument[]).map((doc) => (
            <div key={doc.id} className="rounded-md border bg-background p-2 text-xs">
              <div className="flex items-center justify-between gap-2">
                <div className="font-medium truncate cursor-pointer" title={doc.name}>{doc.name}</div>
                <div className="text-muted-foreground text-[10px]">{new Date(doc.uploadedAt).toLocaleString()}</div>
              </div>
              <div className="mt-2 max-h-32 overflow-auto whitespace-pre-wrap">
                {doc.markdown.slice(0, 1200)}{doc.markdown.length > 1200 ? '…' : ''}
              </div>
            </div>
          ))
        ) : (
          <div className="text-xs text-muted-foreground">No documents yet</div>
        )}
      </div>
    </div>
  );
}


