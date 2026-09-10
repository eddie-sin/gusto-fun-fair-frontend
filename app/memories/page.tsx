'use client';
/* oxlint-disable react/react-compiler */

import Link from 'next/link';
import { Camera, Clock3, ImagePlus, Upload } from 'lucide-react';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useApp } from '@/components/app-provider';
import { FloatingGuide } from '@/components/floating-guide';
import { MemoryGallery } from '@/components/memory-gallery';
import { apiRequest, formatDateTime } from '@/lib/api';
import { MEMORY_BOOTH_GUIDE } from '@/lib/feature-spotlights';

type SnapContext = { opensAt: string | null; closesAt: string | null; status: 'NOT_CONFIGURED' | 'UPCOMING' | 'OPEN' | 'CLOSED'; allowance?: number; used?: number; remaining?: number };

const MAX_CAPTION_WORDS = 25;
const wordCount = (value: string) => { const trimmed = value.trim(); return trimmed ? trimmed.split(/\s+/).length : 0; };

export default function MemoriesPage() {
  const { auth, event } = useApp();
  const [context, setContext] = useState<SnapContext>();
  const [caption, setCaption] = useState('');
  const [privilegeCode, setPrivilegeCode] = useState('');
  const [file, setFile] = useState<File>();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const featureEnabled = event?.featureFlags?.memoriesEnabled === true;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await apiRequest<{ snaps: SnapContext }>(auth ? '/memories/allowance' : '/memories/window', { token: auth?.token, dedupe: true });
      setContext(result.snaps);
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'Memory details could not be loaded.'); }
    finally { setLoading(false); }
  }, [auth]);
  useEffect(() => { void load(); }, [load]);

  const chooseFile = (changeEvent: ChangeEvent<HTMLInputElement>) => {
    const next = changeEvent.target.files?.[0]; setFile(undefined); setError('');
    if (!next) return;
    if (!['image/jpeg','image/png','image/webp'].includes(next.type)) return setError('Choose a JPEG, PNG or WebP image.');
    if (next.size > 7 * 1024 * 1024) return setError('The photo must be 7 MB or smaller.');
    setFile(next);
  };
  const upload = async () => {
    if (!auth || !file) return;
    if (caption.trim().length > 300) return setError('Your caption must be 300 characters or shorter.');
    if (wordCount(caption) > MAX_CAPTION_WORDS) return setError(`Your caption must be ${MAX_CAPTION_WORDS} words or fewer.`);
    const body = new FormData(); body.append('image', file); body.append('caption', caption.trim());
    if (privilegeCode.trim()) body.append('privilegeCode', privilegeCode.trim());
    setUploading(true); setError(''); setSuccess('');
    try { await apiRequest('/memories', { method: 'POST', token: auth.token, body }); setFile(undefined); setCaption(''); setPrivilegeCode(''); setSuccess('Your photo has been added to the memory wall.'); await load(); }
    catch (caught) { setError(caught instanceof Error ? caught.message : 'The photo could not be uploaded.'); }
    finally { setUploading(false); }
  };

  const open = featureEnabled && context?.status === 'OPEN';
  const usedFreeSlot = (context?.used ?? 0) >= 1;
  const atCap = (context?.used ?? 0) >= 2;
  return <main className="feature-page feature-page--memories"><div className="site-container feature-page__grid"><section className="feature-page__intro"><Camera aria-hidden="true" /><p className="eyebrow">A photograph to keep</p><h1>Memory Booth</h1><p>Share one moment from the fair with your account name and a short caption. A pre-order privilege code — yours or shared by a friend — unlocks a second photo.</p><div className="memory-window"><Clock3 aria-hidden="true" /><span><strong>{loading ? 'Checking the upload window…' : context?.status === 'OPEN' ? 'Photo uploads are open' : context?.status === 'UPCOMING' ? `Uploads open ${formatDateTime(context.opensAt || undefined)}` : context?.status === 'CLOSED' ? 'Photo uploads are closed' : 'Upload time has not been announced'}</strong>{context?.closesAt && context.status === 'OPEN' ? `Closes ${formatDateTime(context.closesAt)}` : 'The public memory wall will remain separate from this upload page.'}</span></div></section>
    <section className="paper-form"><p className="eyebrow">Add your moment</p><h2>One frame from the day</h2>{!featureEnabled ? <div className="closed-message"><p>Memories are currently closed.</p><span>The organisers will make this space available when it is ready.</span></div> : !auth ? <div className="closed-message"><p>Log in to upload a memory.</p><span>Your account name appears beside the photo.</span><Link href="/login" className="button">Log in</Link></div> : <>
      <div className="allowance-line"><span>Your remaining uploads</span><strong>{context?.remaining ?? '—'} of {context?.allowance ?? '—'}</strong></div>
      {!open && <p className="form-note" role="status">{context?.status === 'UPCOMING' ? `Uploads open ${formatDateTime(context.opensAt || undefined)} — the fields below will unlock then.` : context?.status === 'CLOSED' ? 'The upload window has closed for this event.' : 'An organiser hasn’t opened the upload window yet — the fields below are locked until they do.'}</p>}
      <label className={`upload-field ${!open || atCap ? 'is-disabled' : ''}`}><ImagePlus aria-hidden="true" /><strong>{file ? file.name : 'Choose a memory photo'}</strong><span>JPEG, PNG or WebP · up to 7 MB</span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseFile} disabled={!open || atCap} /></label>
      <label className="field"><span>Caption <small>optional</small></span><textarea value={caption} onChange={(e) => setCaption(e.target.value)} maxLength={300} rows={4} placeholder="What made this moment worth keeping?" disabled={!open} /><small className={wordCount(caption) > MAX_CAPTION_WORDS ? 'is-over-limit' : ''}>{wordCount(caption)}/{MAX_CAPTION_WORDS} words</small></label>
      {usedFreeSlot && !atCap && <label className="field"><span>Pre-order privilege code <small>unlocks your second photo</small></span><input value={privilegeCode} onChange={(e) => setPrivilegeCode(e.target.value)} placeholder="From any approved order — yours or a friend's" disabled={!open} /></label>}
      {error && <p className="form-error" role="alert">{error}</p>}{success && <output className="form-success">{success}</output>}
      <button className="button button--full" onClick={upload} disabled={!open || !file || uploading || atCap}>{uploading ? 'Uploading…' : <><Upload size={17} /> Share this memory</>}</button>
    </>}</section>
  </div>
    <div className="site-container memory-wall"><p className="eyebrow">The memory wall</p><h2>Moments from the fair</h2><p className="memory-wall-hint">Everyone can browse approved photos. Log in to react with a heart.</p><MemoryGallery token={auth?.token} /></div>
    <FloatingGuide icon={Camera} label="How Memory Booth works" title="Memory Booth" description="What the Memory Booth is about and when it opens." message={MEMORY_BOOTH_GUIDE} />
  </main>;
}
