'use client';

import { Heart, LockKeyhole, Send } from 'lucide-react';
import { SyntheticEvent, useState } from 'react';
import { useApp } from '@/components/app-provider';
import { apiRequest } from '@/lib/api';

export default function CrushLettersPage() {
  const { event, eventLoading } = useApp();
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const enabled = event?.featureFlags?.crushLettersEnabled === true;

  const submit = async (formEvent: SyntheticEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    const cleanName = recipientName.trim(); const cleanMessage = message.trim();
    if (!cleanName || cleanName.length > 100) return setError('Add a recipient name using no more than 100 characters.');
    if (!cleanMessage || cleanMessage.length > 1000) return setError('Write a message using no more than 1,000 characters.');
    setSubmitting(true); setError(''); setSuccess(false);
    try { await apiRequest('/crush-letters', { method: 'POST', body: JSON.stringify({ recipientName: cleanName, message: cleanMessage }) }); setRecipientName(''); setMessage(''); setSuccess(true); }
    catch (caught) { setError(caught instanceof Error ? caught.message : 'Your letter could not be sent.'); }
    finally { setSubmitting(false); }
  };

  return <main className="feature-page feature-page--letters"><div className="site-container feature-page__grid"><section className="feature-page__intro"><Heart aria-hidden="true" /><p className="eyebrow">Unsigned, but not unsaid</p><h1>Crush Letters</h1><p>Leave a kind anonymous note for someone at the fair. Every letter is reviewed before it can appear on the public wall.</p><div className="privacy-note"><LockKeyhole aria-hidden="true" size={20} /><span><strong>Your identity is not attached.</strong>No account, sender name or IP address is stored with the letter.</span></div></section>
    <section className="paper-form"><p className="eyebrow">Write your note</p><h2>Dear someone…</h2>{eventLoading ? <p>Checking whether letters are open…</p> : enabled ? <form onSubmit={submit} noValidate><label className="field"><span>Who is it for?</span><input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} maxLength={100} placeholder="A name or a small clue" required /><small>{recipientName.length}/100</small></label><label className="field"><span>Your message</span><textarea value={message} onChange={(e) => setMessage(e.target.value)} maxLength={1000} rows={7} placeholder="Say what you wanted to say…" required /><small>{message.length}/1000</small></label>{error && <p className="form-error" role="alert">{error}</p>}{success && <output className="form-success">Your letter has been sent for review.</output>}<button className="button button--full" disabled={submitting}>{submitting ? 'Sending…' : <><Send size={17} /> Send anonymously</>}</button><p className="form-fine-print">Keep it respectful. You can send up to 30 successful letters per shared network in 10 minutes.</p></form> : <div className="closed-message"><p>Letter submissions are currently closed.</p><span>The organisers can reopen them at any time. Approved letters already on the wall are unaffected.</span></div>}</section>
  </div></main>;
}
