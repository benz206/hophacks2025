"use client";

import { useEffect, useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { Pencil, Trash2, Phone, Download } from 'lucide-react';

type AgentRow = {
  id: string;
  agent_id: string;
  created_at: string;
  updated_at: string;
  phone_number?: string;
  metadata?: {
    documents?: AgentDocument[];
    lastExtractedMarkdown?: string;
  };
};

type AgentDocument = {
  id: string;
  name: string;
  markdown: string;
  uploadedAt: string;
};

export default function AgentsPage() {
  const [name, setName] = useState("");
  const [firstmessage, setFirstMessage] = useState("");
  const [systemprompt, setSystemPrompt] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const [agents, setAgents] = useState<any[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [editName, setEditName] = useState("");
  const [editFirst, setEditFirst] = useState("");
  const [editSystem, setEditSystem] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [destNumbers, setDestNumbers] = useState<Record<string, string>>({});
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmCallRow, setConfirmCallRow] = useState<any | null>(null);
  const [assistantDetails, setAssistantDetails] = useState<Record<string, any>>({});
  const [loadingAssistant, setLoadingAssistant] = useState<string | null>(null);

  const sanitizePhoneInput = (val: string) => val.replace(/\D/g, '').slice(0, 10);
  const isValidPhone = (val: string) => /^\d{10}$/.test(val);

  function resetCreateForm() {
    setName("");
    setFirstMessage("");
    setSystemPrompt("");
    setPhoneNumber("");
  }

  async function loadAgents() {
    try {
      const res = await fetch('/api/agents', { method: 'GET' });
      if (!res.ok) throw new Error('Failed to fetch agents');
      const data = await res.json();
      setAgents(data.agents || []);
    } catch {
      // ignore list error in UI status; keep page functional
    } finally {
      setInitialLoading(false);
    }
  }

  async function fetchAssistantDetails(agentId: string) {
    if (assistantDetails[agentId]) return; // Already fetched
    
    setLoadingAssistant(agentId);
    try {
      const res = await fetch(`/api/vapi/assistants/${agentId}`);
      if (res.ok) {
        const { assistant } = await res.json();
        setAssistantDetails(prev => ({ ...prev, [agentId]: assistant }));
      }
    } catch (error) {
      console.error('Failed to fetch assistant details:', error);
    } finally {
      setLoadingAssistant(null);
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

  // Fetch assistant details when agents are loaded
  useEffect(() => {
    agents.forEach(agent => {
      if (!assistantDetails[agent.agent_id] && !loadingAssistant) {
        fetchAssistantDetails(agent.agent_id);
      }
    });
  }, [agents]);

  async function handleCreateAgent(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      // 1) Create Vapi Assistant
      const resAssistant = await fetch('/api/vapi/assistants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, firstmessage, systemprompt, phoneNumber })
      });
      if (!resAssistant.ok) throw new Error('Failed to create assistant');
      const { assistant } = await resAssistant.json();

      // 2) Save to Supabase
      const resSave = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: assistant.id, phoneNumber })
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

  async function handleRowCall(row: any) {
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

  async function handleRowUpdate(row: any) {
    const body: { name?: string; firstmessage?: string; systemprompt?: string; phoneNumber?: string } = {
      name: editName,
      firstmessage: editFirst,
      systemprompt: editSystem,
      phoneNumber: editPhone,
    };
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch(`/api/vapi/assistants/${row.agent_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, phoneNumber: editPhone })
      });
      if (!res.ok) throw new Error('Failed to update agent');
      
      // Update phone number in Supabase
      await fetch(`/api/agents/${row.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: editPhone })
      });
      
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

  async function openEdit(row: any) {
    try {
      setEditing(row);
      const res = await fetch(`/api/vapi/assistants/${row.agent_id}`);
      if (res.ok) {
        const { assistant } = await res.json();
        setEditName(assistant?.name ?? "");
        setEditFirst(assistant?.firstMessage ?? "");
        const systemMsg = assistant?.model?.messages?.find((m: any) => m?.role === 'system');
        setEditSystem(systemMsg?.content ?? "");
        setEditPhone(row.phone_number ?? "");
      } else {
        setEditName("");
        setEditFirst("");
        setEditSystem("");
        setEditPhone("");
      }
      setEditOpen(true);
    } catch {
      setEditName("");
      setEditFirst("");
      setEditSystem("");
      setEditPhone("");
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
                <Label htmlFor="system">What do you want agent to do?</Label>
                <Input id="system" placeholder="You are an insurance agent..." value={systemprompt} onChange={(e) => setSystemPrompt(e.target.value)} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="phone">Your Phone Number</Label>
                <Input 
                  id="phone" 
                  placeholder="5551234567" 
                  inputMode="numeric"
                  value={phoneNumber} 
                  onChange={(e) => setPhoneNumber(sanitizePhoneInput(e.target.value))} 
                />
                {phoneNumber && !isValidPhone(phoneNumber) && (
                  <p className="text-sm text-destructive">Please enter a 10-digit phone number.</p>
                )}
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

      {initialLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Spinner size="md" />
            <span>Loading agents...</span>
          </div>
        </div>
      ) : agents.length === 0 ? (
        <div className='flex items-center justify-center py-12'></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
          {agents.map((a) => {
            const assistant = assistantDetails[a.agent_id];
            const isLoading = loadingAssistant === a.agent_id;
            const destValue = destNumbers[a.agent_id] ?? '';
            const canCall = isValidPhone(destValue) && !loading;

            return (
              <div key={a.id} className="rounded-lg border bg-card p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  {/* Left Column - Information */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {isLoading ? (
                        <span className="inline-flex items-center gap-2">
                          <Spinner size="sm" />
                          <span>Loading...</span>
                        </span>
                      ) : (
                        assistant?.name ?? 'Untitled'
                      )}
                    </h3>
                    
                    {/* Assistant Details */}
                    {assistant && (
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Created:</span>
                          <span>{new Date(assistant.createdAt).toLocaleDateString()}</span>
                        </div>
                        {a.phone_number && (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Phone:</span>
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-mono">
                              {a.phone_number}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Top-right icon actions: edit, delete, call (phone at far right) */}
                  <div className="flex items-center gap-1.5 ml-auto">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openEdit(a)}
                      disabled={loading}
                      aria-label="Edit agent"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setConfirmDeleteId(a.id)}
                      disabled={loading}
                      aria-label="Delete agent"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-green-600 text-green-700 hover:bg-green-600/10"
                      onClick={() => setConfirmCallRow(a)}
                      disabled={!canCall}
                      aria-label={canCall ? "Call" : "Enter a valid destination number"}
                      title={canCall ? "Call" : "Enter a valid destination number"}
                    >
                      {loading ? <Spinner size="sm" className="mr-1" /> : <Phone className="mr-1.5 h-4 w-4" aria-hidden="true" />}
                      <span>Call</span>
                    </Button>
                  </div>
                </div>
                
              <div className="flex-1 mt-2">
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
                  <PerAgentUploader agentRow={a} />
                </div>

                {a.metadata?.lastExtractedMarkdown ? (
                  <div className="rounded-md border bg-background p-2 text-xs max-h-32 overflow-auto whitespace-pre-wrap">
                    {String(a.metadata.lastExtractedMarkdown).slice(0, 800)}{String(a.metadata.lastExtractedMarkdown).length > 800 ? '…' : ''}
                  </div>
                ) : null}
              </div>
            </div>
          );
          })}
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
              Call {assistantDetails[confirmCallRow.agent_id]?.name ?? 'agent'} at {destNumbers[confirmCallRow.agent_id] ?? ''}?
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
                <>
                  <Phone className="mr-2 h-4 w-4" aria-hidden="true" />
                  Call
                </>
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
            <div className="grid gap-1.5">
              <Label htmlFor="edit-phone">Phone Number</Label>
              <Input 
                id="edit-phone" 
                placeholder="5551234567" 
                inputMode="numeric"
                value={editPhone} 
                onChange={(e) => setEditPhone(sanitizePhoneInput(e.target.value))} 
              />
              {editPhone && !isValidPhone(editPhone) && (
                <p className="text-sm text-destructive">Please enter a 10-digit phone number.</p>
              )}
            </div>
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
  const [busy, setBusy] = useState(false);
  const [vapiFiles, setVapiFiles] = useState<any[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [confirmDeleteFile, setConfirmDeleteFile] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function run(selectedFiles?: FileList | null) {
    const toProcess = selectedFiles ?? files;
    if (!toProcess || toProcess.length === 0) return;
    try {
      setBusy(true);
      const collected: AgentDocument[] = [];
      for (let i = 0; i < toProcess.length; i++) {
        const file = toProcess.item(i)!;
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/vapi/files', { method: 'POST', body: fd });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error || 'Upload failed');
        }
        const uploaded = await res.json();
        const fileId: string | undefined = uploaded?.id;
        let fileRecord: any = uploaded;
        let markdown = '';

        // Poll for processing completion if needed
        try {
          if (fileId) {
            for (let attempt = 0; attempt < 10; attempt++) {
              if (fileRecord?.status === 'done' || fileRecord?.parsedTextUrl) break;
              if (fileRecord?.status === 'failed') {
                throw new Error('File processing failed');
              }
              await new Promise((r) => setTimeout(r, 1000));
              const statRes = await fetch(`/api/vapi/files/${encodeURIComponent(fileId)}`);
              if (statRes.ok) {
                fileRecord = await statRes.json();
              } else {
                break; // stop polling on error
              }
            }
          }

          const textUrl = fileRecord?.parsedTextUrl || uploaded?.parsedTextUrl;
          if (textUrl) {
            const t = await fetch(textUrl);
            if (t.ok) markdown = await t.text();
          }
        } catch { /* ignore */ }
        const doc: AgentDocument = {
          id: `${Date.now()}-${i}`,
          name: fileRecord?.originalName || uploaded?.originalName || file.name,
          markdown,
          uploadedAt: new Date().toISOString(),
        };
        collected.push(doc);
      }
      setFiles(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      await refreshVapiFiles();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setBusy(false);
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files;
    setFiles(selected);
    if (selected && selected.length > 0) {
      await run(selected);
    }
  }

  async function refreshVapiFiles() {
    try {
      const res = await fetch('/api/vapi/files');
      if (res.ok) {
        const j = await res.json();
        const list = Array.isArray(j?.results) ? j.results : Array.isArray(j) ? j : [];
        setVapiFiles(list);
      }
    } catch {}
  }

  useEffect(() => {
    refreshVapiFiles();
  }, []);

  return (
    <div className="grid gap-2">
      <Input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileChange} />
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Agent documents</Label>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            if (busy) return;
            if (fileInputRef.current) fileInputRef.current.click();
          }}
          disabled={busy}
        >
          {busy ? (<><Spinner size="sm" className="mr-1" /> Uploading...</>) : 'Upload'}
        </Button>
      </div>
      <div className="flex flex-col gap-2 max-h-56 overflow-auto">
        {Array.isArray(vapiFiles) && vapiFiles.length > 0 ? (
          vapiFiles.map((f) => (
            <div key={f.id} className="flex items-center justify-between rounded-md border bg-background p-2">
              <div className="min-w-0">
                <div className="truncate text-xs font-medium" title={f.originalName || f.name}>{f.originalName || f.name || f.id}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">Uploaded {new Date((f.createdAt || f.updatedAt || Date.now())).toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-2 ml-2 shrink-0">
                <Button asChild size="icon" variant="outline" className="h-7 w-7 rounded-md">
                  <a href={f.url || f.parsedTextUrl || '#'} target="_blank" rel="noreferrer" aria-label="Download">
                    <Download className="h-3.5 w-3.5" />
                  </a>
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-7 w-7 rounded-md"
                  aria-label="Delete"
                  disabled={deleting}
                  onClick={() => setConfirmDeleteFile(f)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-xs text-muted-foreground">No files</div>
        )}
      </div>
      <Dialog open={!!confirmDeleteFile} onOpenChange={(o) => { if (!o) setConfirmDeleteFile(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete file?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will permanently delete {confirmDeleteFile?.originalName || confirmDeleteFile?.name || 'this file'}.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmDeleteFile(null)} disabled={deleting}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (!confirmDeleteFile) return;
                try {
                  setDeleting(true);
                  const del = await fetch(`/api/vapi/files/${encodeURIComponent(confirmDeleteFile.id)}`, { method: 'DELETE' });
                  if (!del.ok) {
                    const j = await del.json().catch(() => ({}));
                    throw new Error(j.error || 'Failed to delete');
                  }
                  toast.success('File deleted');
                  setConfirmDeleteFile(null);
                  await refreshVapiFiles();
                } catch (e) {
                  toast.error(e instanceof Error ? e.message : 'Delete failed');
                } finally {
                  setDeleting(false);
                }
              }}
              disabled={deleting}
            >
              {deleting ? (<><Spinner size="sm" className="mr-2" /> Deleting…</>) : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Removed legacy agentRow.metadata documents preview to avoid confusion */}
    </div>
  );
}


