'use client';
/* oxlint-disable react/react-compiler */

import Link from 'next/link';
import { Brain, CheckCircle2, Crown, Medal, Sparkles, Timer, XCircle } from 'lucide-react';
import { SyntheticEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useApp } from '@/components/app-provider';
import { FloatingGuide } from '@/components/floating-guide';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { apiRequest } from '@/lib/api';
import type { QuizCodeValidation, QuizLeaderboardEntry, QuizStart, QuizSubmitResult } from '@/lib/types';

const QUESTION_COUNT = 5;
const TIME_LIMIT_MS = 50_000;
const ADVANCE_DELAY_MS = 350;
const QUIZ_TEST_KEY = process.env.NEXT_PUBLIC_QUIZ_TEST_KEY;

const QUIZ_GUIDE = `🎁 **Pre-order တင်ထားတဲ့သူတွေအတွက် Special Quiz ရှိတယ်နော်!** 🧠✨

🎉 **ပွဲနေ့ကျရင် လာခဲ့ကြဦးနော်!**
Pre-order တင်ပြီးရလာတဲ့ **Code** ကိုထည့်ပြီး **GUSTO နဲ့ပတ်သက်တဲ့ မေးခွန်း ၅ ခု** ကို **စက္ကန့် ၅၀ အတွင်း** အမြန်ဆုံးနဲ့ အကုန်မှန်အောင် ဖြေနိုင်သူတွေက **ဆုလက်ဆောင်လေးတွေ ရရှိမှာပါ!** 🏆🔥

🎁 **Prize List ကတော့ ပွဲနေ့မှပဲ Surprise အနေနဲ့ ကြေညာပေးသွားမှာပါနော်!** 🤫✨

⏳ **အခုတော့ Quiz ဖြေလို့မရသေးပါဘူးခင်ဗျာ။**
**ပွဲနေ့ရောက်မှပဲ ဖြေလို့ရမှာဖြစ်လို့ — လာခဲ့ကြဦးနော်!** 🎉💜`;

const formatSeconds = (ms: number) => (ms / 1000).toFixed(1);
const optionLetter = (index: number) => String.fromCharCode(65 + index);
const QUESTION_EMOJI = ['🧠', '🎯', '⚡', '🔥', '🏆'];

const rankTierClass = (rank: number) =>
  rank <= 3 ? `leaderboard-row--top leaderboard-row--rank${rank}` : rank <= 5 ? 'leaderboard-row--highlight' : '';

function Leaderboard({ entries, loading }: { entries: QuizLeaderboardEntry[]; loading: boolean }) {
  return <section className="leaderboard site-container"><p className="eyebrow">Fastest perfect scores</p><h2>🏆 Leaderboard</h2><p>The ten quickest candidates to answer all five questions correctly within the time limit.</p>
    {loading ? <p className="leaderboard-empty">Loading the leaderboard…</p> : entries.length === 0 ? <p className="leaderboard-empty">No one has completed the quiz in time yet. You could be first.</p> : <ol className="leaderboard-list">
      {entries.map((entry, index) => <li key={entry.rank} className={`leaderboard-row ${rankTierClass(entry.rank)}`} style={{ animationDelay: `${index * 70}ms` }}>
        <span className="leaderboard-rank">{entry.rank === 1 ? <span className="leaderboard-medal"><Crown aria-hidden="true" size={18} /></span> : entry.rank <= 3 ? <span className="leaderboard-medal"><Medal aria-hidden="true" size={16} /></span> : `#${entry.rank}`}</span>
        <span className="leaderboard-avatar" aria-hidden="true">{entry.name.trim().charAt(0).toUpperCase() || '?'}</span>
        <span className="leaderboard-name">{entry.name}</span>
        <span className="leaderboard-time">{formatSeconds(entry.elapsedMs)}s</span>
      </li>)}
    </ol>}
  </section>;
}

function TimerRing({ remainingMs }: { remainingMs: number }) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const ratio = Math.max(0, Math.min(1, remainingMs / TIME_LIMIT_MS));
  const tier = remainingMs <= 10_000 ? 'is-critical' : remainingMs <= 20_000 ? 'is-caution' : '';
  return <div className={`quiz-timer-ring ${tier}`} role="timer" aria-label={`${formatSeconds(remainingMs)} seconds remaining`}>
    <svg viewBox="0 0 64 64" width="64" height="64">
      <circle className="quiz-timer-ring__track" cx="32" cy="32" r={radius} />
      <circle className="quiz-timer-ring__fill" cx="32" cy="32" r={radius} strokeDasharray={circumference} strokeDashoffset={circumference * (1 - ratio)} />
    </svg>
    <span className="quiz-timer-ring__value">{formatSeconds(remainingMs)}s</span>
  </div>;
}

export default function QuizPage() {
  const { auth, event, eventLoading } = useApp();
  const featureEnabled = event?.featureFlags?.quizEnabled === true;
  const [code, setCode] = useState('');
  const [stage, setStage] = useState<'code' | 'ready' | 'active' | 'result'>('code');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState<QuizStart>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [flashIndex, setFlashIndex] = useState<number | null>(null);
  const [result, setResult] = useState<QuizSubmitResult>();
  const [remainingMs, setRemainingMs] = useState(TIME_LIMIT_MS);
  const [leaderboard, setLeaderboard] = useState<QuizLeaderboardEntry[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const startedAtRef = useRef(0);
  const submittingRef = useRef(false);
  const answersRef = useRef<(number | null)[]>([]);
  const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => { answersRef.current = answers; }, [answers]);
  useEffect(() => () => clearTimeout(advanceTimeoutRef.current), []);

  const loadLeaderboard = useCallback(async () => {
    setLeaderboardLoading(true);
    try { const data = await apiRequest<{ leaderboard: QuizLeaderboardEntry[] }>('/quiz/leaderboard', { dedupe: true }); setLeaderboard(data.leaderboard); }
    catch { /* The leaderboard is a bonus display; a failed refresh should not block the quiz. */ }
    finally { setLeaderboardLoading(false); }
  }, []);
  useEffect(() => { void loadLeaderboard(); }, [loadLeaderboard]);

  const checkCode = async (formEvent: SyntheticEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    if (!auth) return;
    const trimmed = code.trim();
    if (!trimmed) return setError('Enter your privilege code from an approved order.');
    setChecking(true); setError('');
    try {
      const validation = await apiRequest<QuizCodeValidation>('/quiz/validate-code', { method: 'POST', token: auth.token, body: JSON.stringify({ code: trimmed }) });
      if (validation.alreadyUsed) setError('This code has already been used for the Quiz.');
      else setStage('ready');
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'That code could not be checked.'); }
    finally { setChecking(false); }
  };

  // -1 marks a question the 50s timer ran out on before an answer was recorded;
  // the backend always scores it as wrong rather than accidentally crediting option 0.
  const submit = useCallback(async (finalAnswers: (number | null)[]) => {
    if (!auth || !attempt || submittingRef.current) return;
    submittingRef.current = true;
    clearTimeout(advanceTimeoutRef.current);
    try {
      const payload = finalAnswers.map((value) => value ?? -1);
      const outcome = await apiRequest<QuizSubmitResult>(`/quiz/${attempt.attemptId}/submit`, { method: 'POST', token: auth.token, body: JSON.stringify({ answers: payload }) });
      setResult(outcome); setStage('result');
      if (outcome.passed) void loadLeaderboard();
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'Your answers could not be submitted.'); setStage('result'); }
  }, [auth, attempt, loadLeaderboard]);

  const startQuiz = async (playCode: string) => {
    if (!auth) return;
    setChecking(true); setError('');
    try {
      const started = await apiRequest<QuizStart>('/quiz/start', { method: 'POST', token: auth.token, body: JSON.stringify({ code: playCode }) });
      setAttempt(started);
      setAnswers(Array.from({ length: QUESTION_COUNT }, () => null));
      setCurrentIndex(0);
      setFlashIndex(null);
      startedAtRef.current = Date.now();
      submittingRef.current = false;
      setRemainingMs(TIME_LIMIT_MS);
      setStage('active');
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'The quiz could not be started.'); }
    finally { setChecking(false); }
  };

  // Dev/testing only: mints a throwaway approved order + privilege code for
  // this account server-side (gated by QUIZ_TEST_KEY) so the code-entry step
  // can be skipped without a real preorder. Invisible unless
  // NEXT_PUBLIC_QUIZ_TEST_KEY is configured for this build.
  const skipCodeForTesting = async () => {
    if (!auth || !QUIZ_TEST_KEY) return;
    setChecking(true); setError('');
    try {
      const provisioned = await apiRequest<{ code: string }>('/quiz/test/provision-code', { method: 'POST', token: auth.token, headers: { 'x-quiz-test-key': QUIZ_TEST_KEY } });
      setCode(provisioned.code);
      await startQuiz(provisioned.code);
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'Could not skip code entry.'); setChecking(false); }
  };

  useEffect(() => {
    if (stage !== 'active') return;
    const timer = setInterval(() => {
      const left = TIME_LIMIT_MS - (Date.now() - startedAtRef.current);
      setRemainingMs(Math.max(0, left));
      if (left <= 0) { clearInterval(timer); void submit(answersRef.current); }
    }, 100);
    return () => clearInterval(timer);
  }, [stage, submit]);

  // Selecting an option records the answer, briefly highlights it, then jumps to
  // the next question — or submits automatically once the fifth is answered.
  const chooseAnswer = (optionIndex: number) => {
    if (flashIndex !== null || !attempt || submittingRef.current) return;
    setFlashIndex(optionIndex);
    const next = answers.map((value, index) => (index === currentIndex ? optionIndex : value));
    setAnswers(next);
    advanceTimeoutRef.current = setTimeout(() => {
      setFlashIndex(null);
      if (currentIndex + 1 < QUESTION_COUNT) setCurrentIndex((index) => index + 1);
      else void submit(next);
    }, ADVANCE_DELAY_MS);
  };

  const restart = () => { submittingRef.current = false; clearTimeout(advanceTimeoutRef.current); setStage('code'); setCode(''); setAttempt(undefined); setAnswers([]); setCurrentIndex(0); setFlashIndex(null); setResult(undefined); setError(''); };

  const activeQuestion = attempt?.questions[currentIndex];

  return <main className="feature-page feature-page--quiz"><div className="site-container feature-page__grid"><section className="feature-page__intro"><Brain aria-hidden="true" /><p className="eyebrow">Five questions, fifty seconds</p><h1>Fair Day Quiz</h1><p>Answer five quick questions correctly before the timer runs out and your name could top the leaderboard.</p><div className="privacy-note"><Timer aria-hidden="true" size={20} /><span><strong>One code, one attempt.</strong>Your privilege code is on any approved order and works once here or once for an extra Memory upload.</span></div>
      {!auth && <p className="quiz-intro-note">You need an account to play. <Link href="/login">Log in</Link> or <Link href="/register">create one</Link> first.</p>}
      {auth && <p className="quiz-intro-note">Don&apos;t have your code yet? Find it on an approved order under <Link href="/orders">My orders</Link>.</p>}
    </section>

    <section className="paper-form">
      {!auth ? <div className="closed-message"><p>Log in to play the quiz.</p><span>Your privilege code is tied to your account.</span><Link href="/login" className="button">Log in</Link></div>
        : eventLoading ? <p>Checking whether the quiz is open…</p>
        : !featureEnabled ? <div className="closed-message"><p>The quiz is not open right now.</p><span>Organisers switch this on for fair day — approved orders and your privilege code are unaffected.</span></div>
        : <>
        {stage === 'code' && <form onSubmit={checkCode} noValidate><p className="eyebrow">Enter your code</p><h2>Ready to play?</h2><label className="field"><span>Privilege code</span><input value={code} onChange={(e) => setCode(e.target.value)} placeholder="FF-PRIV-..." required /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button--full" disabled={checking}>{checking ? 'Checking…' : 'Check code'}</button>{QUIZ_TEST_KEY && <button type="button" className="button button--quiet" onClick={() => void skipCodeForTesting()} disabled={checking}>{checking ? 'Setting up…' : 'Skip code (test)'}</button>}</form>}

        {stage === 'ready' && <div><p className="eyebrow">You&apos;re in</p><h2>Get ready</h2><p>You will have <strong>50 seconds</strong> to answer <strong>5 random questions</strong>, one at a time. The timer starts the moment you press start, so make sure you&apos;re ready before you begin.</p>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button--full" onClick={() => void startQuiz(code.trim())} disabled={checking}>{checking ? 'Starting…' : 'Start quiz'}</button></div>}

        {stage === 'active' && <p className="quiz-waiting">The question is open in the popup — keep an eye on the timer.</p>}

        {stage === 'result' && result && <div className={`quiz-result ${result.passed ? 'quiz-result--pass' : ''}`}><span className="quiz-result-icon">{result.passed ? <CheckCircle2 aria-hidden="true" size={28} /> : <XCircle aria-hidden="true" size={28} />}</span><h3>{result.passed && <Sparkles aria-hidden="true" size={20} className="quiz-result-sparkle" />}{result.passed ? 'Perfect score!' : result.timedOut ? 'Time ran out' : 'Not quite'}</h3><p>You scored <strong>{result.score} / {QUESTION_COUNT}</strong> in {formatSeconds(result.elapsedMs)} seconds ({result.elapsedMs.toLocaleString()} ms).</p>{result.timedOut && !result.passed && <p>Your answers were scored, but the 50-second limit had already passed, so this attempt doesn&apos;t qualify for the leaderboard.</p>}{result.passed && <p>You made the leaderboard requirement — check below to see where you rank.</p>}
          {result.results && result.results.length > 0 && <ol className="quiz-result-breakdown">
            {result.results.map((entry, index) => <li key={entry.questionId} className={`quiz-result-row ${entry.correct ? 'is-correct' : 'is-wrong'}`}>
              <span className="quiz-result-row__icon">{entry.correct ? <CheckCircle2 aria-hidden="true" size={18} /> : <XCircle aria-hidden="true" size={18} />}</span>
              <div><p className="quiz-result-row__question">{index + 1}. {entry.question}</p>
                <p className="quiz-result-row__answer">Your answer: {entry.yourAnswer === -1 ? 'No answer (time ran out)' : `${optionLetter(entry.yourAnswer)}. ${entry.options[entry.yourAnswer]}`}{!entry.correct && <> — Correct answer: {optionLetter(entry.correctOption)}. {entry.options[entry.correctOption]}</>}</p>
              </div>
            </li>)}
          </ol>}
          <Link href="/orders" className="button button--quiet">Back to my orders</Link></div>}
        {stage === 'result' && !result && error && <div className="quiz-result"><XCircle aria-hidden="true" size={28} /><h3>Something went wrong</h3><p className="form-error">{error}</p><button className="button button--quiet" onClick={restart}>Try again</button></div>}
      </>}
    </section>
  </div>

    <Dialog open={stage === 'active'} onOpenChange={() => { /* the quiz cannot be dismissed early; it closes itself once submitted */ }}>
      <DialogContent className="quiz-dialog" showCloseButton={false}>
        <div className="quiz-dialog-top">
          <DialogHeader><span className="quiz-question-badge" aria-hidden="true">{QUESTION_EMOJI[currentIndex] ?? '❓'}</span><DialogTitle>Question {currentIndex + 1} of {QUESTION_COUNT}</DialogTitle><DialogDescription>Pick an option — the next question opens automatically.</DialogDescription></DialogHeader>
          <TimerRing remainingMs={remainingMs} />
        </div>
        <ol className="quiz-progress-dots" aria-hidden="true">{Array.from({ length: QUESTION_COUNT }, (_, index) => <li key={index} className={index < currentIndex ? 'is-done' : index === currentIndex ? 'is-current' : ''} />)}</ol>
        {activeQuestion && <div className="quiz-question" key={currentIndex}><h3>{activeQuestion.question}</h3><div className="quiz-options" role="radiogroup" aria-label={activeQuestion.question}>
          {activeQuestion.options.map((option, optionIndex) => <button type="button" key={optionIndex} className={`quiz-option ${flashIndex === optionIndex ? 'is-selected' : ''}`} style={{ animationDelay: `${optionIndex * 60}ms` }} onClick={() => chooseAnswer(optionIndex)} disabled={flashIndex !== null}><span className="quiz-option-marker">{optionLetter(optionIndex)}</span>{option}</button>)}
        </div></div>}
      </DialogContent>
    </Dialog>

    <Leaderboard entries={leaderboard} loading={leaderboardLoading} />
    <FloatingGuide icon={Brain} label="How the Quiz works" title="Fair Day Quiz" description="What the quiz is about and when it opens." message={QUIZ_GUIDE} />
  </main>;
}
