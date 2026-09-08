'use client';

import { Heart, LockKeyhole, Send } from 'lucide-react';
import { SyntheticEvent, useState } from 'react';
import { useApp } from '@/components/app-provider';
import { FloatingGuide } from '@/components/floating-guide';
import { RequireAuth } from '@/components/require-auth';
import { apiRequest } from '@/lib/api';

const LETTER_TO_WHOM_GUIDE = `💌 **ပွဲနေ့လာခဲ့ကြနော်!**

ပွဲနေ့ရောက်ရင် **ကိုယ်ပြောပြချင်တဲ့စကားလေးတွေ၊ ကြားစေချင်တဲ့သူဆီ ရောက်စေချင်တဲ့အကြောင်းအရာလေးတွေကို ဒီမှာရေးထားခဲ့လို့ရပါတယ်နော်** 💭✨

ဘယ်သူ့ကို ရည်ရွယ်ထားတာလဲ၊ ဘာအကြောင်းလဲဆိုတာ **ရေးထည့်လိုက်ရုံပဲ** — ကျန်တာကတော့ ဒီ Website က တာဝန်ယူပေးမှာပါ။ 👀

ပြီးတော့ **ကိုယ်ရေးထားတာ ဘယ်သူရေးမှန်း မသိစေရဖို့ ကျွန်တော်တို့ Privacy ကို အပြည့်အဝအာမခံပေးထားပါတယ်** 🤫🔒

ပွဲပြီးသွားရင်တောင် ဒီ Website ကို ပြန်ဝင်ပြီး
**အဲ့ဒီနေ့က ချန်ထားခဲ့တဲ့ စကားလေးတွေ၊ အမှတ်တရလေးတွေကို အတူတူ ပြန်ဖတ်ကြမယ်နော်။** 💜

🔒 **ဒီ Feature ကို လောလောဆယ် ပိတ်ထားပါတယ်နော်!**

**ပွဲနေ့တစ်ရက်တည်းသာ** Specially ဖွင့်ပေးမှာဖြစ်လို့ အဲ့ဒီနေ့မှ ပြန်လာခဲ့ပေးနော် 💌✨

**ပွဲနေ့မှာ ကိုယ်ပြောချင်တဲ့စကားလေးတွေ ချန်ထားခဲ့လို့ရပါပြီ!** 👀💜`;

export default function CrushLettersPage() {
  const { auth, event, eventLoading } = useApp();
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
    try { await apiRequest('/crush-letters', { method: 'POST', token: auth?.token, body: JSON.stringify({ recipientName: cleanName, message: cleanMessage }) }); setRecipientName(''); setMessage(''); setSuccess(true); }
    catch (caught) { setError(caught instanceof Error ? caught.message : 'Your letter could not be sent.'); }
    finally { setSubmitting(false); }
  };

  return <RequireAuth><main className="feature-page feature-page--letters"><div className="site-container feature-page__grid"><section className="feature-page__intro"><Heart aria-hidden="true" /><p className="eyebrow">Unsigned, but not unsaid</p><h1>Letter to Whom</h1><p>Leave a kind anonymous note for someone at the fair. Every letter is reviewed before it can appear on the public wall.</p><div className="privacy-note"><LockKeyhole aria-hidden="true" size={20} /><span><strong>Your identity is not attached.</strong>No sender name or IP address is stored with the letter.</span></div></section>
    <section className="paper-form"><p className="eyebrow">Write your note</p><h2>Dear someone…</h2>{eventLoading ? <p>Checking whether letters are open…</p> : enabled ? <form onSubmit={submit} noValidate><label className="field"><span>Who is it for?</span><input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} maxLength={100} placeholder="A name or a small clue" required /><small>{recipientName.length}/100</small></label><label className="field"><span>Your message</span><textarea value={message} onChange={(e) => setMessage(e.target.value)} maxLength={1000} rows={7} placeholder="Say what you wanted to say…" required /><small>{message.length}/1000</small></label>{error && <p className="form-error" role="alert">{error}</p>}{success && <output className="form-success">Your letter has been sent for review.</output>}<button className="button button--full" disabled={submitting}>{submitting ? 'Sending…' : <><Send size={17} /> Send anonymously</>}</button><p className="form-fine-print">Keep it respectful. You can send up to 30 successful letters per shared network in 10 minutes.</p></form> : <div className="closed-message"><p>Letter submissions are currently closed.</p><span>The organisers can reopen them at any time. Approved letters already on the wall are unaffected.</span></div>}</section>
  </div>
    <FloatingGuide icon={Heart} label="How Letter to Whom works" title="Letter to Whom" description="What this feature is about and when it opens." message={LETTER_TO_WHOM_GUIDE} />
  </main></RequireAuth>;
}
