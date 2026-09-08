/* oxlint-disable next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Asterisk,
  Heart,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Meet Our Team",
  description:
    "Six people, one Fun Fair. Meet the team behind the GUSTO Fun Fair website.",
};

const TEAM = [
  {
    name: "Kaung Zaw Hein",
    role: "Project Manager & Backend",
    initials: "KZ",
    photo: "/images/kaung.png",
    photoClass: "kaung",
    photoWidth: 810,
    photoHeight: 1080,
    note: "Keeping us on track",
    description:
      "Connecting the big picture with all the little details that make the fair run smoothly.",
  },
  {
    name: "Shun Lak Thaw Tar",
    role: "Project Manager & Backend",
    initials: "SL",
    photo: "/images/Shun Lak Thaw Tar.jpg",
    photoClass: "shun",
    photoWidth: 959,
    photoHeight: 1280,
    note: "Making it all click",
    description:
      "Turning ideas into a plan, and that plan into the logic behind your Fun Fair experience.",
  },
  {
    name: "Aung Myint Myat",
    alias: "Joseph",
    role: "Backend",
    initials: "AM",
    photo: "/images/Joseph.jpg",
    photoClass: "joseph",
    photoWidth: 335,
    photoHeight: 722,
    note: "Behind the scenes",
    description:
      "Joining the dots between your clicks, your orders, and the information that keeps everything moving.",
  },
  {
    name: "No Ko",
    role: "Backend",
    initials: "NK",
    photo: "/images/Noko.jpg",
    photoClass: "noko",
    photoWidth: 962,
    photoHeight: 1280,
    note: "Details matter",
    description:
      "Looking after the foundations, so the fun on the surface has something solid underneath.",
  },
  {
    name: "Linn Khant Kyaw",
    role: "Frontend",
    initials: "LK",
    photo: "/images/Linn Khant Kyaw.jpg",
    photoClass: "linn",
    photoWidth: 961,
    photoHeight: 1280,
    note: "From idea to screen",
    description:
      "Giving the fair its digital face, one thoughtful layout and finishing touch at a time.",
  },
  {
    name: "Thant Sin Aung",
    alias: "Eddie",
    role: "Frontend & AWS DevOps",
    initials: "TS",
    photo: "/images/eddie.jpg",
    photoClass: "eddie",
    photoWidth: 720,
    photoHeight: 1280,
    note: "A little extra personality",
    description:
      "Bringing the pages to life with playful details and interactions that feel good to use.",
  },
];

export default function TeamPage() {
  return (
    <main className="crew-page">
      <div className="site-container crew-board">
        <header className="crew-intro">
          <Link href="/" className="crew-back">
            <ArrowLeft size={16} aria-hidden="true" /> Back to the fair
          </Link>
          <p className="crew-kicker">
            THE CODING CLUB <span aria-hidden="true">/</span> GUSTO
          </p>
          <h1>
            The people
            <br />
            behind
            <br />
            <em>the fun.</em>
            <Asterisk className="crew-title-star" aria-hidden="true" />
          </h1>
          <p className="crew-intro__text">
            Six different minds. One shared idea: make this a fair to remember.
          </p>
          <div className="crew-intro__signoff">
            <span className="crew-small-rule" aria-hidden="true" /> A little
            code, a lot of heart.
          </div>
        </header>

        {TEAM.map((member, index) => (
          <article
            key={member.name}
            className={`crew-member crew-member--${index + 1}`}
            aria-labelledby={`member-${index}`}
          >
            <div className="crew-member__sheet">
              <div className="crew-member__top">
                <span>THE FUN FAIR CREW</span>
                <span>0{index + 1} / 06</span>
              </div>
              <div
                className={`crew-portrait ${member.photo ? `crew-portrait--${member.photoClass}` : "crew-portrait--initials"}`}
              >
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={member.name}
                    width={member.photoWidth}
                    height={member.photoHeight}
                    loading={index < 2 ? "eager" : "lazy"}
                  />
                ) : (
                  <div className="crew-monogram" aria-hidden="true">
                    <span>{member.initials}</span>
                    <Asterisk size={44} strokeWidth={1.5} />
                  </div>
                )}
                <span className="crew-portrait__note">{member.note}</span>
              </div>
              <div className="crew-member__details">
                <p className="crew-member__role">{member.role}</p>
                <h2 id={`member-${index}`}>{member.name}</h2>
                {member.alias && (
                  <span className="crew-member__alias">
                    also known as {member.alias}
                  </span>
                )}
                <p className="crew-member__description">{member.description}</p>
              </div>
            </div>
          </article>
        ))}

        <aside className="crew-outro">
          <span className="crew-outro__mark" aria-hidden="true">
            <Heart size={28} strokeWidth={1.5} />
          </span>
          <p className="crew-kicker">MADE TOGETHER</p>
          <h2>
            Good things happen
            <br />
            with <em>good people.</em>
          </h2>
          <p>
            We made the website. You make the memories.
            <br />
            See you at the fair!
          </p>
          <Link href="/" className="crew-return">
            Back to the good stuff <ArrowUpRight size={19} aria-hidden="true" />
          </Link>
          <Sparkles
            className="crew-outro__spark"
            size={40}
            aria-hidden="true"
          />
        </aside>
      </div>
    </main>
  );
}
