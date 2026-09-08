'use client';
/* oxlint-disable react/react-compiler */

import Link from 'next/link';
import { Brain, CheckCircle2, Timer, Trophy, XCircle } from 'lucide-react';
import { SyntheticEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useApp } from '@/components/app-provider';
import { FloatingGuide } from '@/components/floating-guide';
import { apiRequest } from '@/lib/api';
import type { QuizCodeValidation, QuizLeaderboardEntry, QuizStart, QuizSubmitResult } from '@/lib/types';

const QUESTION_COUNT = 5;
const TIME_LIMIT_MS = 50_000;

const QUIZ_GUIDE = `🎁 **Pre-order တင်ထားတဲ့သူတွေအတွက် Special Quiz ရှိတယ်နော်!** 🧠✨

🎉 **ပွဲနေ့ကျရင် လာခဲ့ကြဦးနော်!**
Pre-order တင်ထားတဲ့သူတွေအတွက် **ဆုလက်ဆောင်တွေနဲ့ Quiz အစီအစဉ်လေး** စီစဉ်ပေးထားပါတယ်။ 👀🎁

Pre-order တင်ပြီးရလာတဲ့ **Code** ကိုထည့်ပြီး **GUSTO နဲ့ပတ်သက်တဲ့ မေးခွန်း ၅ ခု** ကို **စက္ကန့် ၅၀ အတွင်း** အမြန်ဆုံးနဲ့ အကုန်မှန်အောင် ဖြေနိုင်သူတွေက **ဆုလက်ဆောင်လေးတွေ ရရှိမှာပါ!** 🏆🔥

🎁 **Prize List ကတော့ ပွဲနေ့မှပဲ Surprise အနေနဲ့ ကြေညာပေးသွားမှာပါနော်!** 🤫✨

⏳ **အခုတော့ Quiz ဖြေလို့မရသေးပါဘူးခင်ဗျာ။**
**ပွဲနေ့ရောက်မှပဲ ဖြေလို့ရမှာဖြစ်လို့ — လာခဲ့ကြဦးနော်!** 🎉💜`;

const formatSeconds = (ms: number) => (ms / 1000).toFixed(1);

function Leaderboard({ entries, loading }: { entries: QuizLeaderboardEntry[]; loading: boolean }) {
  return <section className="leaderboard site-container"><p className="eyebrow">Fastest perfect scores</p><h2>Leaderboard</h2><p>The five quickest candidates to answer all five questions correctly within the time limit.</p>
    {loading ? <p className="leaderboard-empty">Loading the leaderboard…</p> : entries.length === 0 ? <p className="leaderboard-empty">No one has completed the quiz in time yet. You could be first.</p> : <ol className="leaderboard-list">
      {entries.map((entry) => <li key={entry.rank} className={`leaderboard-row ${entry.rank === 1 ? 'leaderboard-row--first' : ''}`}><span className="leaderboard-rank">{entry.rank === 1 ? <Trophy aria-hidden="true" size={20} /> : `#${entry.rank}`}</span><span>{entry.name}</span><span className="leaderboard-time">{formatSeconds(entry.elapsedMs)}s</span></li>)}
    </ol>}
  </section>;
}

export default function QuizPage() {
  const { auth } = useApp();
  const [code, setCode] = useState('');
  const [stage, setStage] = useState<'code' | 'ready' | 'active' | 'result'>('code');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState<QuizStart>();
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [result, setResult] = useState<QuizSubmitResult>();
  const [remainingMs, setRemainingMs] = useState(TIME_LIMIT_MS);
  const [leaderboard, setLeaderboard] = useState<QuizLeaderboardEntry[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const startedAtRef = useRef(0);
  const submittingRef = useRef(false);
  const answersRef = useRef<(number | null)[]>([]);
  useEffect(() => { answersRef.current = answers; }, [answers]);

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

  const submit = useCallback(async (finalAnswers: (number | null)[]) => {
    if (!auth || !attempt || submittingRef.current) return;
    submittingRef.current = true;
    try {
      const payload = finalAnswers.map((value) => value ?? 0);
      const outcome = await apiRequest<QuizSubmitResult>(`/quiz/${attempt.attemptId}/submit`, { method: 'POST', token: auth.token, body: JSON.stringify({ answers: payload }) });
      setResult(outcome); setStage('result');
      if (outcome.passed) void loadLeaderboard();
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'Your answers could not be submitted.'); setStage('result'); }
  }, [auth, attempt, loadLeaderboard]);

  const startQuiz = async () => {
    if (!auth) return;
    setChecking(true); setError('');
    try {
      const started = await apiRequest<QuizStart>('/quiz/start', { method: 'POST', token: auth.token, body: JSON.stringify({ code: code.trim() }) });
      setAttempt(started);
      setAnswers(Array.from({ length: QUESTION_COUNT }, () => null));
      startedAtRef.current = Date.now();
      submittingRef.current = false;
      setRemainingMs(TIME_LIMIT_MS);
      setStage('active');
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'The quiz could not be started.'); }
    finally { setChecking(false); }
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

  const chooseAnswer = (questionIndex: number, optionIndex: number) => setAnswers((current) => current.map((value, index) => (index === questionIndex ? optionIndex : value)));
  const allAnswered = answers.length === QUESTION_COUNT && answers.every((value) => value !== null);
  const restart = () => { submittingRef.current = false; setStage('code'); setCode(''); setAttempt(undefined); setAnswers([]); setResult(undefined); setError(''); };

  return <main className="feature-page feature-page--quiz"><div className="site-container feature-page__grid"><section className="feature-page__intro"><Brain aria-hidden="true" /><p className="eyebrow">Five questions, fifty seconds</p><h1>Fair Day Quiz</h1><p>Answer five quick questions correctly before the timer runs out and your name could top the leaderboard.</p><div className="privacy-note"><Timer aria-hidden="true" size={20} /><span><strong>One code, one attempt.</strong>Your privilege code is on any approved order and works once here or once for an extra Memory upload.</span></div>
      {!auth && <p className="quiz-intro-note">You need an account to play. <Link href="/login">Log in</Link> or <Link href="/register">create one</Link> first.</p>}
      {auth && <p className="quiz-intro-note">Don&apos;t have your code yet? Find it on an approved order under <Link href="/orders">My orders</Link>.</p>}
    </section>

    <section className="paper-form">
      {!auth ? <div className="closed-message"><p>Log in to play the quiz.</p><span>Your privilege code is tied to your account.</span><Link href="/login" className="button">Log in</Link></div> : <>
        {stage === 'code' && <form onSubmit={checkCode} noValidate><p className="eyebrow">Enter your code</p><h2>Ready to play?</h2><label className="field"><span>Privilege code</span><input value={code} onChange={(e) => setCode(e.target.value)} placeholder="FF-PRIV-..." required /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button--full" disabled={checking}>{checking ? 'Checking…' : 'Check code'}</button></form>}

        {stage === 'ready' && <div><p className="eyebrow">You&apos;re in</p><h2>Get ready</h2><p>You will have <strong>50 seconds</strong> to answer <strong>5 random questions</strong>. The timer starts the moment you press start, so make sure you&apos;re ready before you begin.</p>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button--full" onClick={startQuiz} disabled={checking}>{checking ? 'Starting…' : 'Start quiz'}</button></div>}

        {stage === 'active' && attempt && <div className="quiz-active"><div className={`quiz-timer ${remainingMs <= 10_000 ? 'quiz-timer--warning' : ''}`}><span>Time remaining</span><strong>{formatSeconds(remainingMs)}s</strong></div>
          {attempt.questions.map((question, index) => <div className="quiz-question" key={question.questionId}><p className="quiz-progress">Question {index + 1} of {QUESTION_COUNT}</p><h3>{question.question}</h3><div className="quiz-options" role="radiogroup" aria-label={question.question}>{question.options.map((option, optionIndex) => <label key={optionIndex} className={`quiz-option ${answers[index] === optionIndex ? 'is-selected' : ''}`}><input type="radio" name={`question-${index}`} className="quiz-option-input" checked={answers[index] === optionIndex} onChange={() => chooseAnswer(index, optionIndex)} /><span className="quiz-option-marker">{String.fromCharCode(65 + optionIndex)}</span>{option}</label>)}</div></div>)}
          <div className="quiz-nav"><span>{answers.filter((value) => value !== null).length} of {QUESTION_COUNT} answered</span><button className="button" onClick={() => void submit(answers)} disabled={!allAnswered}>Submit answers</button></div>
        </div>}

        {stage === 'result' && result && <div className={`quiz-result ${result.passed ? 'quiz-result--pass' : ''}`}>{result.passed ? <CheckCircle2 aria-hidden="true" size={28} /> : <XCircle aria-hidden="true" size={28} />}<h3>{result.passed ? 'Perfect score!' : result.timedOut ? 'Time ran out' : 'Not quite'}</h3><p>You scored <strong>{result.score} / {QUESTION_COUNT}</strong> in {formatSeconds(result.elapsedMs)} seconds.</p>{result.timedOut && !result.passed && <p>Your answers were scored, but the 50-second limit had already passed, so this attempt doesn&apos;t qualify for the leaderboard.</p>}{result.passed && <p>You made the leaderboard requirement — check below to see where you rank.</p>}<Link href="/orders" className="button button--quiet">Back to my orders</Link></div>}
        {stage === 'result' && !result && error && <div className="quiz-result"><XCircle aria-hidden="true" size={28} /><h3>Something went wrong</h3><p className="form-error">{error}</p><button className="button button--quiet" onClick={restart}>Try again</button></div>}
      </>}
    </section>
  </div>
    <Leaderboard entries={leaderboard} loading={leaderboardLoading} />
    <FloatingGuide icon={Brain} label="How the Quiz works" title="Fair Day Quiz" description="What the quiz is about and when it opens." message={QUIZ_GUIDE} />
  </main>;
}
