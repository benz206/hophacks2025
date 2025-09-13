"use client";

import { useState } from 'react';

export default function AgentsPage() {
  const [name, setName] = useState("");
  const [firstmessage, setFirstMessage] = useState("");
  const [systemprompt, setSystemPrompt] = useState("");
  const [assistantId, setAssistantId] = useState<string | null>(null);
  const [phoneNumberId, setPhoneNumberId] = useState("");
  const [customerNumber, setCustomerNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

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

  return (
    <div style={{ maxWidth: 560, margin: '32px auto', padding: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>Agents</h1>
      <form onSubmit={handleCreateAgent} style={{ display: 'grid', gap: 12 }}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="First message"
          value={firstmessage}
          onChange={(e) => setFirstMessage(e.target.value)}
        />
        <textarea
          placeholder="System prompt"
          value={systemprompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          rows={4}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating…' : 'Create Agent'}
        </button>
      </form>

      {assistantId && (
        <div style={{ marginTop: 24, display: 'grid', gap: 12 }}>
          <div>Assistant ID: {assistantId}</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              placeholder="Phone Number ID"
              value={phoneNumberId}
              onChange={(e) => setPhoneNumberId(e.target.value)}
            />
            <button onClick={handlePatchPhoneNumber} disabled={loading}>
              Patch Phone Number
            </button>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              placeholder="Customer Number (+1...)"
              value={customerNumber}
              onChange={(e) => setCustomerNumber(e.target.value)}
            />
            <button onClick={handleCall} disabled={loading}>
              Call
            </button>
          </div>
        </div>
      )}

      {status && (
        <div style={{ marginTop: 16, color: '#444' }}>{status}</div>
      )}
    </div>
  );
}


