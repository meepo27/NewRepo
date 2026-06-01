'use client';

import { useState, useEffect } from 'react';
import { Plus, FileText, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { createNotification } from '@/lib/notificationService';

type DocType = 'passport' | 'visa' | 'travel_insurance' | 'hotel_booking' | 'flight_ticket' | 'travel_card' | 'vaccination';

interface TravelDoc {
  id: string;
  document_type: DocType;
  document_name: string;
  expiry_date: string | null;
  notes: string | null;
}

const DOC_LABELS: Record<DocType, string> = {
  passport: '🛂 Passport',
  visa: '📋 Visa',
  travel_insurance: '🛡️ Travel Insurance',
  hotel_booking: '🏨 Hotel Booking',
  flight_ticket: '✈️ Flight Ticket',
  travel_card: '💳 Travel Card',
  vaccination: '💉 Vaccination',
};

function expiryStatus(expiry: string | null): 'valid' | 'warning' | 'urgent' | 'none' {
  if (!expiry) return 'none';
  const months = (new Date(expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30);
  if (months < 0) return 'urgent';
  if (months < 3) return 'urgent';
  if (months < 6) return 'warning';
  return 'valid';
}

export default function DocumentsPage() {
  const [docs, setDocs] = useState<TravelDoc[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState<DocType>('passport');
  const [name, setName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase.from('travel_documents').select('*').eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .then(({ data }) => setDocs(data ?? []));
    });
  }, []);

  const handleSave = async () => {
    if (!name) return;
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }

    const { data } = await supabase.from('travel_documents').insert({
      user_id: user.id,
      document_type: type,
      document_name: name,
      expiry_date: expiry || null,
      notes: notes || null,
    }).select().single();

    if (data) {
      setDocs((prev) => [data as TravelDoc, ...prev]);
      // Check passport expiry against trips
      if (type === 'passport' && expiry) {
        await createNotification(user.id, 'passport_expiry',
          'Passport expiry checked',
          `Your passport expires on ${expiry}. Make sure it's valid for your upcoming trips.`,
          '/profile/documents'
        ).catch(() => {});
      }
      setShowForm(false);
      setName(''); setExpiry(''); setNotes('');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('travel_documents').delete().eq('id', id);
    setDocs((prev) => prev.filter((d) => d.id !== id));
  };

  const statusColors = {
    valid: 'text-green-400 border-green-500/30 bg-green-500/8',
    warning: 'text-amber-400 border-amber-500/30 bg-amber-500/8',
    urgent: 'text-red-400 border-red-500/30 bg-red-500/8',
    none: 'text-white/40 border-white/10 bg-white/4',
  };

  return (
    <div className="min-h-dvh bg-[#0A0F1E] px-4 py-6">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-white font-semibold text-xl">Document Vault</h1>
            <p className="text-white/40 text-sm mt-0.5">Track expiry dates for all travel documents</p>
          </div>
          <button onClick={() => setShowForm((p) => !p)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 text-black font-medium text-sm hover:bg-amber-400 transition-colors">
            <Plus size={14} /> Add
          </button>
        </div>

        {showForm && (
          <div className="bg-[#141929] border border-white/8 rounded-2xl p-5 mb-6 space-y-4">
            <h2 className="text-white font-medium">Add document</h2>
            <div className="space-y-1.5">
              <label className="text-white/50 text-xs">Document type</label>
              <select value={type} onChange={(e) => setType(e.target.value as DocType)}
                className="w-full bg-[#0A0F1E] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500/50 transition-colors">
                {(Object.keys(DOC_LABELS) as DocType[]).map((k) => (
                  <option key={k} value={k}>{DOC_LABELS[k]}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-white/50 text-xs">Document name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Indian Passport"
                className="w-full bg-[#0A0F1E] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500/50 transition-colors placeholder-white/30" />
            </div>
            <div className="space-y-1.5">
              <label className="text-white/50 text-xs">Expiry date (optional)</label>
              <input type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)}
                className="w-full bg-[#0A0F1E] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500/50 transition-colors" />
            </div>
            <div className="space-y-1.5">
              <label className="text-white/50 text-xs">Notes (optional)</label>
              <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Valid for 10 years"
                className="w-full bg-[#0A0F1E] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500/50 transition-colors placeholder-white/30" />
            </div>
            {type === 'passport' && (
              <a href="https://passportindia.gov.in/" target="_blank" rel="noopener noreferrer"
                className="text-amber-400 text-xs hover:text-amber-300 transition-colors">
                Renew Indian Passport →
              </a>
            )}
            <button onClick={handleSave} disabled={saving || !name}
              className="w-full py-2.5 rounded-xl bg-amber-500 text-black font-medium text-sm hover:bg-amber-400 transition-colors disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Document'}
            </button>
          </div>
        )}

        <div className="space-y-3">
          {docs.length === 0 && !showForm && (
            <div className="text-center py-16">
              <FileText className="w-10 h-10 text-white/20 mx-auto mb-3" />
              <p className="text-white/40">No documents added yet</p>
              <p className="text-white/30 text-sm mt-1">Add your passport, visa, and insurance details</p>
            </div>
          )}

          {docs.map((doc) => {
            const status = expiryStatus(doc.expiry_date);
            return (
              <div key={doc.id} className={cn('flex items-start justify-between p-4 rounded-xl border', statusColors[status])}>
                <div className="flex items-start gap-3">
                  <span className="text-lg mt-0.5">{DOC_LABELS[doc.document_type].split(' ')[0]}</span>
                  <div>
                    <p className="text-white font-medium text-sm">{doc.document_name}</p>
                    <p className="text-white/50 text-xs">{DOC_LABELS[doc.document_type].split(' ').slice(1).join(' ')}</p>
                    {doc.expiry_date && (
                      <p className={cn('text-xs mt-1 flex items-center gap-1', statusColors[status].split(' ')[0])}>
                        {status === 'urgent' ? <AlertTriangle size={10} /> : status === 'valid' ? <CheckCircle size={10} /> : null}
                        Expires {new Date(doc.expiry_date).toLocaleDateString()}
                      </p>
                    )}
                    {doc.notes && <p className="text-white/30 text-xs mt-1">{doc.notes}</p>}
                  </div>
                </div>
                <button onClick={() => handleDelete(doc.id)} className="text-white/20 hover:text-white/50 transition-colors">
                  <X size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
