'use client';

import { PartyPopper } from 'lucide-react';
import { FloatingGuide } from '@/components/floating-guide';

const GUIDE_MESSAGE = `🎉 **အားလုံးပဲ မင်္ဂလာပါခင်ဗျာ!**

ဒီနှစ် **GUSTO Fun Fair Event** မှာ ကျွန်တော်တို့ **GUSTO Coding Club** ကနေလည်း ပါဝင်အားဖြည့်ထားပါတယ်ဗျာ! 💻✨

Fun Fair အတွက် **Pre-order** တင်ချင်တယ်ဆိုရင် Website ကနေတစ်ဆင့် ဝင်ရောက်မှာယူနိုင်ပါတယ်နော်

ပြီးတော့ အရေးကြီးတာတစ်ခုက — **Pre-order Price က ပွဲနေ့မှာ ဝယ်တဲ့ဈေးထက် ပိုသက်သာပါတယ်ဗျာ!!!** 🔥

🛒 **Pre-order တင်နည်းကလည်း အရမ်းလွယ်ပါတယ် —**

**1️⃣ Account ဖွင့်မယ်**
**2️⃣ မှာယူချင်တဲ့ Food & Items လေးတွေ ရွေးမယ်**
**3️⃣ Cart 🛒 ထဲမှာ Order ကို ပြန်စစ်မယ်**
**4️⃣ ဖော်ပြထားတဲ့ KBZPay Account ကို ငွေလွှဲမယ်**
**5️⃣ ငွေလွှဲထားတဲ့ Transaction Screenshot / Transcript ကို ပြန်တင်မယ်**
**6️⃣ Admin Team က Review လုပ်ပြီးရင် ကိုယ့်ရဲ့ Unique Code လေး ပို့ပေးပါမယ်** 🎟️

⚠️ **Code လေးကို သေချာသိမ်းထားပေးနော်!**

ပွဲနေ့ရောက်ရင် အဲ့ဒီ **Code ကို Physical Ticket နဲ့ လဲလှယ်ပြီး အသုံးပြုနိုင်ပါတယ်။** 🎫✨

ဒါပေမယ့်... **ဪ! ဒီ Code က Ticket လဲဖို့အတွက်ပဲ မဟုတ်ဘူးနော် 👀**

Pre-order တင်ထားတဲ့သူတွေအတွက် **Special Features & Exclusive Activities** လေးတွေလည်း စီစဉ်ပေးထားပါတယ်ဗျို့! 🎁🔥

ဒါကြောင့် **Pre-order တင်ထားပြီး ပွဲနေ့မှာ အပျော်တွေအပြည့်နဲ့ လာခဲ့ကြနော်!** 😎

📅 **See you all at the GUSTO Fun Fair Event — September 11!** ✨💜

**Don't miss it! 🎉**`;

export function PreorderGuide() {
  return <FloatingGuide icon={PartyPopper} label="How pre-ordering works" title="How pre-ordering works" description="A quick step-by-step guide to preordering for the fair." message={GUIDE_MESSAGE} />;
}
