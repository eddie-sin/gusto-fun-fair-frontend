export type FeatureSpotlightContent = {
  number: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  introEyebrow: string;
  keepsakeLabel: string;
  guideLabel: string;
  englishSteps: string[];
  burmeseSteps: string[];
  operationalNote: string;
};

export const MEMORY_BOOTH_SPOTLIGHT: FeatureSpotlightContent = {
  number: "01",
  title: "Memory Booth",
  description:
    "Take a photo at the fair, add a short caption, and leave it in the shared memory wall.",
  href: "/memories",
  cta: "Visit memories",
  introEyebrow: "A photograph to keep",
  keepsakeLabel: "KEEP THIS MOMENT",
  guideLabel: "MEMORY",
  englishSteps: [
    "Snap a photo during the fair.",
    "Write a short caption or memory.",
    "Upload it to the shared Memory Wall so everyone can look back on the day.",
    "Selected memories may be featured after the event.",
  ],
  burmeseSteps: [
    "ပွဲအတွင်း ဓာတ်ပုံရိုက်ပါ။",
    "အမှတ်တရစာတို သို့မဟုတ် caption ရေးပါ။",
    "Memory Wall ထဲသို့ upload တင်ပြီး အားလုံးနဲ့မျှဝေနိုင်ပါတယ်။",
    "ရွေးချယ်ထားသော အမှတ်တရများကို ပွဲပြီးနောက် highlight အနေနဲ့ ပြသနိုင်ပါတယ်။",
  ],
  operationalNote:
    "One upload per account on fair day. An approved preorder privilege code unlocks one extra photo, and everyone can revisit the wall and react after the event.",
};

export const LETTERS_SPOTLIGHT: FeatureSpotlightContent = {
  number: "02",
  title: "Letter to Whom",
  description:
    "Leave a kind anonymous note for someone at the fair. Every letter is reviewed before it can appear on the public wall.",
  href: "/crush-letters",
  cta: "Write a letter",
  introEyebrow: "Unsigned, but not unsaid",
  keepsakeLabel: "SEND WITHOUT A NAME",
  guideLabel: "LETTER",
  englishSteps: [
    "Write who it's for and what you want to say.",
    "Send it anonymously — no sender name or IP address is stored with the letter.",
    "Approved letters are added to the shared Letter Wall for everyone to read.",
    "Come back after the fair to read the notes left behind together.",
  ],
  burmeseSteps: [
    "ဘယ်သူ့ကို ရည်ရွယ်ထားတာလဲ၊ ဘာအကြောင်းလဲဆိုတာ ရေးထည့်ပါ။",
    "အမည်မဖော်ပဲ ပို့နိုင်ပါတယ် — ရေးသူအမည် သို့မဟုတ် IP address ကို မသိမ်းဆည်းပါ။",
    "အတည်ပြုပြီးသော စာများကို အားလုံးဖတ်နိုင်သော Letter Wall ပေါ်တွင် ပြသပေးမည်။",
    "ပွဲပြီးနောက် ချန်ထားခဲ့သော စာလေးတွေကို ပြန်ဖတ်နိုင်ပါတယ်။",
  ],
  operationalNote:
    "One free letter per account on fair day. An approved preorder privilege code unlocks two more, and the letter wall stays open to read after the event.",
};

export const QUIZ_SPOTLIGHT: FeatureSpotlightContent = {
  number: "03",
  title: "Fair Day Quiz",
  description:
    "Answer five quick questions about GUSTO correctly before the 50-second timer runs out and your name could top the leaderboard.",
  href: "/quiz",
  cta: "Play the quiz",
  introEyebrow: "Five questions, fifty seconds",
  keepsakeLabel: "BEAT THE CLOCK",
  guideLabel: "QUIZ",
  englishSteps: [
    "Enter the privilege code from an approved preorder.",
    "Start the timer when you're ready — you'll have 50 seconds.",
    "Answer all 5 questions correctly to qualify for the leaderboard.",
    "The fastest perfect scores win a prize, revealed as a surprise on fair day.",
  ],
  burmeseSteps: [
    "အတည်ပြုပြီးသော Pre-order မှ Privilege Code ကို ထည့်ပါ။",
    "အသင့်ဖြစ်ရင် Timer စတင်ပါ — စက္ကန့် ၅၀ ရှိပါမည်။",
    "Leaderboard တက်ရန် မေးခွန်း ၅ ခုလုံးကို မှန်အောင်ဖြေပါ။",
    "အမြန်ဆုံး အမှတ်ပြည့်ရသူများသည် ပွဲနေ့တွင် Surprise ဆုများ ရရှိမည်။",
  ],
  operationalNote:
    "One attempt per privilege code. Quiz play opens on fair day only, and the leaderboard shows the five quickest perfect scores.",
};

export const MEMORY_BOOTH_GUIDE = `🎉 **ပွဲနေ့လာခဲ့ကြနော်!**

ပွဲနေ့ရောက်ရင် **Regular Users** အားလုံးအတွက် 📸 **Photo တစ်ပုံရိုက်ပြီး Website ပေါ်မှာတင်နိုင်မယ့် အခွင့်အရေး** ရှိပါတယ်နော်!

ပွဲပြီးသွားတဲ့အချိန်မှာတောင် ဒီ Website ကို ပြန်ဝင်ပြီး **ကိုယ်ရိုက်ခဲ့တဲ့ပုံလေးတွေ၊ သူငယ်ချင်းတွေရဲ့ပုံလေးတွေကို ပြန်ကြည့်လို့ရမယ်** 👀✨
ပြီးတော့ ကြိုက်တဲ့ပုံလေးတွေကို ❤️ **React လေးတွေပေးပြီး Support လုပ်လို့လည်းရပါတယ်!**

🎟️ **Pre-order တင်ထားတဲ့သူတွေအတွက်တော့ Special Bonus ရှိတယ်နော်!**

ရရှိထားတဲ့ **Code** ကိုအသုံးပြုပြီး **Photo တစ်ပုံထပ်တင်နိုင်မှာ** ဖြစ်ပါတယ် 📸💜

🔒 **Photo Feature လောလောဆယ် ပိတ်ထားပါတယ်နော်!**

ဒီ Feature ကို **ပွဲနေ့တစ်ရက်တည်းသာ Specially ဖွင့်ပေးမှာ** ဖြစ်ပါတယ် 🎉📸

**ပွဲနေ့ရောက်မှ ပြန်လာခဲ့နော်!** 👀✨`;
