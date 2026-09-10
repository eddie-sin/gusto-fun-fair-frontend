'use client';

import { useCallback, useEffect, useState } from 'react';
import { apiRequest, formatDateTime } from '@/lib/api';

type Letter = { id: string; recipientName: string; message: string; createdAt: string };

export function CrushLetterGallery({ extraHeaders }: { extraHeaders?: Record<string, string> }) {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async (nextPage: number) => {
    setLoading(true); setError('');
    try {
      const result = await apiRequest<{ crushLetters: Letter[]; pagination: { totalPages: number } }>(`/crush-letters?page=${nextPage}&limit=12`, { headers: extraHeaders });
      setLetters(result.crushLetters);
      setTotalPages(result.pagination.totalPages);
      setPage(nextPage);
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'The letter wall could not be loaded.'); }
    finally { setLoading(false); }
  }, [extraHeaders]);

  useEffect(() => { void load(1); }, [load]);

  return <div className="letter-gallery">
    {error && <p className="form-error" role="alert">{error}</p>}
    {!loading && letters.length === 0 && <div className="closed-message"><p>No approved letters yet.</p><span>Approved letters will appear here as Admin reviews them.</span></div>}
    <div className="letter-gallery-grid">
      {letters.map((letter) => <article key={letter.id} className="letter-card">
        <div className="letter-card-to">
          <span className="letter-card-to-label">To</span>
          <span className="letter-card-to-name">{letter.recipientName}</span>
        </div>
        <p className="letter-card-message">{letter.message}</p>
        <small>{formatDateTime(letter.createdAt)}</small>
      </article>)}
    </div>
    {totalPages > 1 && <div className="pagination">
      <button className="button" disabled={loading || page <= 1} onClick={() => load(page - 1)}>Previous</button>
      <span>Page {page} of {totalPages}</span>
      <button className="button" disabled={loading || page >= totalPages} onClick={() => load(page + 1)}>Next</button>
    </div>}
  </div>;
}
