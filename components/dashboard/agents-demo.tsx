"use client";

import * as React from "react";
import { demoAgents } from "@/lib/fake-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Pencil, Phone, Trash2 } from "lucide-react";

export default function AgentsDemo() {
  const [open, setOpen] = React.useState<null | string>(null);
  const [edit, setEdit] = React.useState<null | string>(null);
  const selected = demoAgents.find((a) => a.id === open) || null;
  const editing = demoAgents.find((a) => a.id === edit) || null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {demoAgents.map((a) => (
          <div key={a.id} className="rounded-lg border bg-card p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-semibold">{a.name}</div>
                <div className="text-xs text-muted-foreground mt-1">Created {new Date(a.createdAt).toLocaleDateString()}</div>
                {a.phoneNumber ? (
                  <div className="mt-1 inline-flex items-center rounded bg-emerald-500/10 text-emerald-600 px-2 py-0.5 text-xs font-medium">
                    {a.phoneNumber}
                  </div>
                ) : null}
              </div>
              <div className="flex items-center gap-1.5">
                <Button size="icon" variant="outline" onClick={() => setEdit(a.id)} aria-label="Edit">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" aria-label="Delete">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="mt-3 text-sm text-muted-foreground">{a.firstMessage}</div>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setOpen(a.id)}>
                <Phone className="mr-2 h-4 w-4" />
                Call
              </Button>
              <Button size="sm" onClick={() => setEdit(a.id)}>Edit</Button>
            </div>
          </div>
        ))}
      </div>

      {/* View sheet */}
      <Sheet open={!!selected} onOpenChange={(o) => { if (!o) setOpen(null); }}>
        <SheetContent side="right" className="w-[92vw] sm:w-[520px]">
          {selected ? (
            <>
              <SheetHeader>
                <SheetTitle>{selected.name}</SheetTitle>
              </SheetHeader>
              <div className="text-sm mt-2 space-y-3">
                <div>
                  <div className="text-muted-foreground">First message</div>
                  <div className="mt-0.5 rounded-md border bg-muted/30 p-2">{selected.firstMessage}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Phone number</div>
                  <div className="mt-0.5">{selected.phoneNumber || "—"}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Created</div>
                  <div className="mt-0.5">{new Date(selected.createdAt).toLocaleString()}</div>
                </div>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>

      {/* Edit sheet */}
      <Sheet open={!!editing} onOpenChange={(o) => { if (!o) setEdit(null); }}>
        <SheetContent side="right" className="w-[92vw] sm:w-[520px]">
          {editing ? (
            <>
              <SheetHeader>
                <SheetTitle>Edit {editing.name}</SheetTitle>
              </SheetHeader>
              <div className="grid gap-3 mt-2">
                <div className="grid gap-1.5">
                  <Label>Name</Label>
                  <Input defaultValue={editing.name} />
                </div>
                <div className="grid gap-1.5">
                  <Label>First message</Label>
                  <Input defaultValue={editing.firstMessage} />
                </div>
                <div className="grid gap-1.5">
                  <Label>Phone number</Label>
                  <Input defaultValue={editing.phoneNumber} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setEdit(null)}>Cancel</Button>
                  <Button>Save</Button>
                </div>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}


