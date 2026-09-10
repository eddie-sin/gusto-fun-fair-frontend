import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Asterisk,
  Heart,
  Sparkles,
} from "lucide-react";
import { TeamMemberCard } from "@/components/team-member-card";
import { TEAM_MEMBERS } from "@/lib/team";

export const metadata: Metadata = {
  title: "Meet Our Team",
  description:
    "Six people, one Fun Fair. Meet the team behind the GUSTO Fun Fair website.",
};

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

        {TEAM_MEMBERS.map((member, index) => (
          <TeamMemberCard
            key={member.name}
            member={member}
            index={index}
            total={TEAM_MEMBERS.length}
            eager={index < 2}
          />
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
