'use client';

import { ChevronLeft, ChevronRight, Expand, Heart, HeartCrack, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { apiRequest, formatDateTime, mediaUrl } from '@/lib/api';

type Memory = { id: string; caption: string; imageUrl: string; createdAt: string; likes: number; dislikes: number };
type Reaction = 'LIKE' | 'DISLIKE' | null;

function reactionDelta(previous: Reaction, next: Reaction) {
  return {
    likes: (next === 'LIKE' ? 1 : 0) - (previous === 'LIKE' ? 1 : 0),
    dislikes: (next === 'DISLIKE' ? 1 : 0) - (previous === 'DISLIKE' ? 1 : 0),
  };
}

export function MemoryGallery({ token, extraHeaders }: { token?: string; extraHeaders?: Record<string, string> }) {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [myReactions, setMyReactions] = useState<Record<string, Reaction>>({});
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [pending, setPending] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const loadReactions = useCallback(async (rows: Memory[]) => {
    if (!token) return;
    const entries = await Promise.all(rows.map(async (memory) => {
      try {
        const result = await apiRequest<{ reaction: Reaction }>(`/memories/${memory.id}/reaction`, { token, headers: extraHeaders });
        return [memory.id, result.reaction] as const;
      } catch { return [memory.id, null] as const; }
    }));
    setMyReactions((current) => ({ ...current, ...Object.fromEntries(entries) }));
  }, [token, extraHeaders]);

  const load = useCallback(async (cursor?: string) => {
    setLoading(true); setError('');
    try {
      const result = await apiRequest<{ memories: Memory[]; nextCursor: string | null }>(`/memories?limit=12${cursor ? `&before=${cursor}` : ''}`, { headers: extraHeaders });
      setMemories((current) => cursor ? [...current, ...result.memories] : result.memories);
      setNextCursor(result.nextCursor);
      await loadReactions(result.memories);
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'The memory wall could not be loaded.'); }
    finally { setLoading(false); }
  }, [extraHeaders, loadReactions]);

  useEffect(() => { void load(); }, [load]);

  const react = async (memory: Memory, choice: 'LIKE' | 'DISLIKE') => {
    if (!token || pending) return;
    const previous = myReactions[memory.id] ?? null;
    const next: Reaction = previous === choice ? null : choice;
    const delta = reactionDelta(previous, next);
    setPending(memory.id); setError('');
    setMyReactions((current) => ({ ...current, [memory.id]: next }));
    setMemories((current) => current.map((row) => row.id === memory.id ? { ...row, likes: row.likes + delta.likes, dislikes: row.dislikes + delta.dislikes } : row));
    try {
      await apiRequest(`/memories/${memory.id}/reaction`, { method: 'PUT', token, headers: extraHeaders, body: JSON.stringify({ reaction: next }) });
    } catch (caught) {
      setMyReactions((current) => ({ ...current, [memory.id]: previous }));
      setMemories((current) => current.map((row) => row.id === memory.id ? { ...row, likes: row.likes - delta.likes, dislikes: row.dislikes - delta.dislikes } : row));
      setError(caught instanceof Error ? caught.message : 'That reaction could not be saved.');
    } finally { setPending(''); }
  };

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const step = useCallback((delta: number) => {
    setLightboxIndex((current) => current === null ? current : (current + delta + memories.length) % memories.length);
  }, [memories.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    document.body.style.overflow = 'hidden';
    const onKey = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === 'Escape') closeLightbox();
      else if (keyboardEvent.key === 'ArrowRight') step(1);
      else if (keyboardEvent.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [lightboxIndex, closeLightbox, step]);

  const reactionButtons = (memory: Memory) => {
    const liked = myReactions[memory.id] === 'LIKE';
    const disliked = myReactions[memory.id] === 'DISLIKE';
    return <div className="memory-reactions">
      <button type="button" className={`memory-reaction memory-reaction--like ${liked ? 'is-active' : ''}`} disabled={!token || pending === memory.id} onClick={() => react(memory, 'LIKE')} aria-pressed={liked}><Heart size={16} aria-hidden="true" />{memory.likes}</button>
      <button type="button" className={`memory-reaction memory-reaction--dislike ${disliked ? 'is-active' : ''}`} disabled={!token || pending === memory.id} onClick={() => react(memory, 'DISLIKE')} aria-pressed={disliked}><HeartCrack size={16} aria-hidden="true" />{memory.dislikes}</button>
    </div>;
  };

  const active = lightboxIndex !== null ? memories[lightboxIndex] : undefined;

  return <div className="memory-gallery">
    {error && <p className="form-error" role="alert">{error}</p>}
    {!loading && memories.length === 0 && <div className="closed-message"><p>No approved photos yet.</p><span>Approved memories will appear here as Admin reviews them.</span></div>}
    <div className="memory-gallery-grid">
      {memories.map((memory, index) => <article key={memory.id} className="memory-card" style={{ animationDelay: `${Math.min(index, 11) * 70}ms` }}>
        <button type="button" className="memory-card-media" onClick={() => setLightboxIndex(index)} aria-label={`View ${memory.caption || 'this memory'} full size`}>
          {!loadedImages[memory.id] && <span className="memory-card-shimmer" aria-hidden="true" />}
          {/* eslint-disable-next-line @next/next/no-img-element -- natural aspect ratio matters here: uploads are phone-shaped portraits, not fixed squares */}
          <img
            src={mediaUrl(memory.imageUrl)}
            alt={memory.caption || 'Approved event memory'}
            loading="lazy"
            decoding="async"
            className={loadedImages[memory.id] ? 'is-loaded' : ''}
            onLoad={() => setLoadedImages((current) => ({ ...current, [memory.id]: true }))}
          />
          <span className="memory-card-expand" aria-hidden="true"><Expand size={16} /></span>
        </button>
        <div>
          <p>{memory.caption || 'No caption'}</p>
          <small>{formatDateTime(memory.createdAt)}</small>
          {reactionButtons(memory)}
        </div>
      </article>)}
    </div>
    {nextCursor && <button className="button" onClick={() => load(nextCursor)} disabled={loading}>{loading ? 'Loading…' : 'Load more photos'}</button>}

    {active && <div className="memory-lightbox" role="dialog" aria-modal="true" aria-label="Memory photo viewer" onClick={closeLightbox}>
      <button type="button" className="memory-lightbox-close" onClick={closeLightbox} aria-label="Close"><X size={22} /></button>
      {memories.length > 1 && <button type="button" className="memory-lightbox-nav memory-lightbox-nav--prev" onClick={(clickEvent) => { clickEvent.stopPropagation(); step(-1); }} aria-label="Previous photo"><ChevronLeft size={24} /></button>}
      <figure className="memory-lightbox-frame" onClick={(clickEvent) => clickEvent.stopPropagation()}>
        <img src={mediaUrl(active.imageUrl)} alt={active.caption || 'Approved event memory'} />
        <figcaption>
          <p>{active.caption || 'No caption'}</p>
          <div className="memory-lightbox-meta"><small>{formatDateTime(active.createdAt)}</small>{reactionButtons(active)}</div>
        </figcaption>
      </figure>
      {memories.length > 1 && <button type="button" className="memory-lightbox-nav memory-lightbox-nav--next" onClick={(clickEvent) => { clickEvent.stopPropagation(); step(1); }} aria-label="Next photo"><ChevronRight size={24} /></button>}
    </div>}
  </div>;
}
