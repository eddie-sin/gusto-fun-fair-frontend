'use client';

import Image from 'next/image';
import { Heart, HeartCrack } from 'lucide-react';
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
  const [pending, setPending] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  return <div className="memory-gallery">
    {error && <p className="form-error" role="alert">{error}</p>}
    {!loading && memories.length === 0 && <div className="closed-message"><p>No approved photos yet.</p><span>Approved memories will appear here as Admin reviews them.</span></div>}
    <div className="memory-gallery-grid">
      {memories.map((memory) => <article key={memory.id} className="memory-card">
        <Image src={mediaUrl(memory.imageUrl)} alt={memory.caption || 'Approved event memory'} width={600} height={600} unoptimized />
        <div>
          <p>{memory.caption || 'No caption'}</p>
          <small>{formatDateTime(memory.createdAt)}</small>
          <div className="memory-reactions">
            <button type="button" className={`memory-reaction ${myReactions[memory.id] === 'LIKE' ? 'is-active' : ''}`} disabled={!token || pending === memory.id} onClick={() => react(memory, 'LIKE')} aria-pressed={myReactions[memory.id] === 'LIKE'}><Heart size={16} aria-hidden="true" />{memory.likes}</button>
            <button type="button" className={`memory-reaction ${myReactions[memory.id] === 'DISLIKE' ? 'is-active' : ''}`} disabled={!token || pending === memory.id} onClick={() => react(memory, 'DISLIKE')} aria-pressed={myReactions[memory.id] === 'DISLIKE'}><HeartCrack size={16} aria-hidden="true" />{memory.dislikes}</button>
          </div>
        </div>
      </article>)}
    </div>
    {nextCursor && <button className="button" onClick={() => load(nextCursor)} disabled={loading}>{loading ? 'Loading…' : 'Load more photos'}</button>}
  </div>;
}
