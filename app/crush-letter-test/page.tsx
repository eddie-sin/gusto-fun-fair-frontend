'use client';
/* oxlint-disable react/react-compiler */

import Link from 'next/link';
import {
  CheckCircle2,
  Heart,
  RefreshCw,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useApp } from '@/components/app-provider';
import { CrushLetterGallery } from '@/components/crush-letter-gallery';
import { apiRequest } from '@/lib/api';

type LetterAllowance = { allowance: number; used: number; remaining: number };

const testHeaders = (key: string) => ({ 'X-Crush-Letter-Test-Key': key });

export default function CrushLetterTestPage() {
  const { auth, event } = useApp();
  const [key, setKey] = useState('');
  const [activeKey, setActiveKey] = useState('');
  const [allowance, setAllowance] = useState<LetterAllowance>();
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');
  const [privilegeCode, setPrivilegeCode] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const savedKey = sessionStorage.getItem('crush-letter-test-key') || '';
    setKey(savedKey);
    setActiveKey(savedKey);
  }, []);

  const load = useCallback(async () => {
    if (!activeKey || !auth) return;
    setLoading(true); setError('');
    try {
      const result = await apiRequest<{ letters: LetterAllowance }>('/crush-letters/allowance', { token: auth.token, headers: testHeaders(activeKey) });
      setAllowance(result.letters);
      sessionStorage.setItem('crush-letter-test-key', activeKey);
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'The test connection could not be verified.'); }
    finally { setLoading(false); }
  }, [activeKey, auth]);

  useEffect(() => { if (auth?.token && activeKey) void load(); }, [activeKey, auth?.token, load]);

  const galleryHeaders = useMemo(() => (activeKey ? testHeaders(activeKey) : undefined), [activeKey]);
  const needsCode = (allowance?.remaining ?? 1) === 0 && (allowance?.allowance ?? 1) < 3;
  const usedUp = (allowance?.remaining ?? 1) === 0 && (allowance?.allowance ?? 1) >= 3;

  const submit = async (formEvent: SyntheticEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    if (!auth || !activeKey) return;
    const cleanName = recipientName.trim(); const cleanMessage = message.trim();
    if (!cleanName || !cleanMessage) return setError('Fill in both a recipient and a message.');
    setSubmitting(true); setError(''); setNotice('');
    try {
      await apiRequest('/crush-letters', {
        method: 'POST',
        token: auth.token,
        headers: testHeaders(activeKey),
        body: JSON.stringify({ recipientName: cleanName, message: cleanMessage, ...(privilegeCode.trim() ? { privilegeCode: privilegeCode.trim() } : {}) }),
      });
      setRecipientName(''); setMessage(''); setPrivilegeCode('');
      setNotice('Sent for Admin review, exactly like a real event-day letter.');
      await load();
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'The letter could not be sent.'); }
    finally { setSubmitting(false); }
  };

  return <main className="feature-page feature-page--letters memory-test-page">
    <div className="site-container">
      <section className="memory-test-heading">
        <Heart aria-hidden="true" />
        <p className="eyebrow">Private event-day simulation</p>
        <h1>Letter to Whom test</h1>
        <p>
          This page uses the real authenticated submission, Admin review, and public letter wall. The test key
          bypasses the event-day check below, so you can try the free letter and the privilege-code unlock exactly
          as they will behave on the event day. It does not enable Letter to Whom for ordinary visitors.
        </p>
      </section>
      {!auth ? (
        <section className="paper-form memory-test-panel">
          <h2>Log in to test</h2>
          <p>The submission contract requires a normal customer account.</p>
          <Link href="/login" className="button">Log in</Link>
        </section>
      ) : (
        <div className="memory-test-grid">
          <section className="paper-form memory-test-panel">
            <div className="test-panel-title"><ShieldCheck aria-hidden="true" /><div><p className="eyebrow">Step 1</p><h2>Activate this test</h2></div></div>
            <p>Enter the key configured as <strong>CRUSH_LETTER_TEST_KEY</strong> in the server environment.</p>
            <label className="field"><span>Private test key</span><input type="password" value={key} onChange={(e) => setKey(e.target.value)} placeholder="Paste the local test key" /></label>
            <button className="button button--full" onClick={() => setActiveKey(key)} disabled={!key || loading}><RefreshCw size={17} /> {loading ? 'Checking…' : 'Check test access'}</button>
            {allowance && <div className="test-status"><CheckCircle2 aria-hidden="true" /><span><strong>Simulated event-day access is on</strong>{allowance.remaining} of {allowance.allowance} letters remaining. The real event flag is currently {event?.featureFlags?.crushLettersEnabled ? 'enabled' : 'disabled'}.</span></div>}
          </section>
          <section className="paper-form memory-test-panel">
            <div className="test-panel-title"><Send aria-hidden="true" /><div><p className="eyebrow">Step 2</p><h2>Send a real letter</h2></div></div>
            {usedUp ? <p>All 3 letters have been used for this test account.</p> : <form onSubmit={submit} noValidate>
              <label className="field"><span>Who is it for?</span><input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} maxLength={100} placeholder="A name or a small clue" disabled={!allowance} required /></label>
              <label className="field"><span>Message</span><textarea value={message} onChange={(e) => setMessage(e.target.value)} maxLength={1000} rows={4} placeholder="Say what you wanted to say…" disabled={!allowance} required /></label>
              {needsCode && <label className="field"><span>Pre-order privilege code <small>unlocks 2 more letters</small></span><input value={privilegeCode} onChange={(e) => setPrivilegeCode(e.target.value)} placeholder="From an approved order" /></label>}
              {error && <p className="form-error" role="alert">{error}</p>}
              {notice && <output className="form-success">{notice}</output>}
              <button className="button button--full" disabled={!allowance || submitting}>{submitting ? 'Sending…' : <><Send size={17} /> Send anonymously</>}</button>
            </form>}
          </section>
        </div>
      )}
      <section className="memory-test-checklist">
        <p className="eyebrow">Step 3 · verify the full loop</p>
        <ol>
          <li>Send the free letter above, then open Admin → Crush Letters and approve it.</li>
          <li>Refresh the wall below to see it appear, exactly as visitors will on the event day.</li>
          <li>Send a second letter without a code to confirm it is blocked, then use an eligible pre-order code to unlock two more.</li>
        </ol>
      </section>
      <section className="memory-test-gallery">
        <p className="eyebrow">Approved letter wall from the real API</p>
        <CrushLetterGallery extraHeaders={galleryHeaders} />
      </section>
    </div>
  </main>;
}
