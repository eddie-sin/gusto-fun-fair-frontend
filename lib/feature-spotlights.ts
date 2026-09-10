export type FeatureSpotlightContent = {
  number: string;
  title: string;
  description: string;
  href: string;
  cta: string;
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

export const MEMORY_BOOTH_GUIDE = `🎉 **ပွဲနေ့လာခဲ့ကြနော်!**

ပွဲနေ့ရောက်ရင် **Regular Users** အားလုံးအတွက် 📸 **Photo တစ်ပုံရိုက်ပြီး Website ပေါ်မှာတင်နိုင်မယ့် အခွင့်အရေး** ရှိပါတယ်နော်!

ပွဲပြီးသွားတဲ့အချိန်မှာတောင် ဒီ Website ကို ပြန်ဝင်ပြီး **ကိုယ်ရိုက်ခဲ့တဲ့ပုံလေးတွေ၊ သူငယ်ချင်းတွေရဲ့ပုံလေးတွေကို ပြန်ကြည့်လို့ရမယ်** 👀✨
ပြီးတော့ ကြိုက်တဲ့ပုံလေးတွေကို ❤️ **React လေးတွေပေးပြီး Support လုပ်လို့လည်းရပါတယ်!**

🎟️ **Pre-order တင်ထားတဲ့သူတွေအတွက်တော့ Special Bonus ရှိတယ်နော်!**

ရရှိထားတဲ့ **Code** ကိုအသုံးပြုပြီး **Photo တစ်ပုံထပ်တင်နိုင်မှာ** ဖြစ်ပါတယ် 📸💜

🔒 **Photo Feature လောလောဆယ် ပိတ်ထားပါတယ်နော်!**

ဒီ Feature ကို **ပွဲနေ့တစ်ရက်တည်းသာ Specially ဖွင့်ပေးမှာ** ဖြစ်ပါတယ် 🎉📸

**ပွဲနေ့ရောက်မှ ပြန်လာခဲ့နော်!** 👀✨`;
