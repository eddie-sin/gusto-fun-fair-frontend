"use client";
/* oxlint-disable next/no-img-element */

import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Camera,
  Heart,
  MapPin,
  Sparkles,
  TicketCheck,
} from "lucide-react";
import { FairResultsSection } from "@/components/fair-results-section";
import { FeatureSpotlight } from "@/components/feature-spotlight";
import { TeamMemberCard } from "@/components/team-member-card";
import { EVENT_DETAILS } from "@/lib/content";
import { GUSTO_2026_FINAL_RESULTS } from "@/lib/fair-results";
import {
  LETTERS_SPOTLIGHT,
  MEMORY_BOOTH_SPOTLIGHT,
  QUIZ_SPOTLIGHT,
} from "@/lib/feature-spotlights";
import { useApp } from "@/components/app-provider";
import { TEAM_MEMBERS } from "@/lib/team";

export default function Home() {
  const { event } = useApp();
  return (
    <main>
      <section className="hero">
        <div className="site-container hero__grid">
          <div className="hero__copy">
            <p className="eyebrow">{EVENT_DETAILS.name}</p>
            <h1>
              Come hungry.
              <br />
              <em>Leave with stories.</em>
            </h1>
            <p className="hero__intro">
              Preorder your favourites, skip the guesswork on fair day, and keep
              one ticket for the whole order.
            </p>
            <div className="hero__actions">
              <Link href="/foods" className="button">
                Explore the menu <ArrowRight aria-hidden="true" size={18} />
              </Link>
              <Link href="/stalls" className="button button--quiet">
                Meet the stalls
              </Link>
            </div>
            <dl className="event-facts">
              <div>
                <dt>Date</dt>
                <dd>{EVENT_DETAILS.date}</dd>
              </div>
              <div>
                <dt>Time</dt>
                <dd>{EVENT_DETAILS.time}</dd>
              </div>
              <div>
                <dt>
                  <MapPin aria-hidden="true" size={15} /> Place
                </dt>
                <dd>{EVENT_DETAILS.place}</dd>
              </div>
            </dl>
          </div>
          <div className="hero__visual">
            <img
              src="/images/chicken-burger.webp"
              alt="A crispy chicken burger and seasoned fries at a carnival stall"
              fetchPriority="high"
            />
            <div className="hero-ticket" aria-hidden="true">
              <span>ADMIT ONE</span>
              <strong>11·09·26</strong>
              <span>GOOD FOOD</span>
            </div>
          </div>
        </div>
      </section>

      <section className="promise-strip">
        <div className="site-container promise-strip__grid">
          <div>
            <TicketCheck aria-hidden="true" />
            <span>
              <strong>One order, one code</strong>Your whole preorder stays
              together.
            </span>
          </div>
          <div>
            <Sparkles aria-hidden="true" />
            <span>
              <strong>Preorder prices</strong>Save before the fair begins.
            </span>
          </div>
          <div>
            <ArrowRight aria-hidden="true" />
            <span>
              <strong>Collect with ease</strong>Show your code when you arrive.
            </span>
          </div>
        </div>
      </section>

      <section className="home-crew" aria-labelledby="home-crew-title">
        <div className="site-container">
          <header className="home-crew__heading">
            <p className="crew-kicker">06 / THE MAKERS</p>
            <h2 id="home-crew-title">Meet the people behind the fair.</h2>
          </header>
          <div className="home-crew__grid">
            {TEAM_MEMBERS.map((member, index) => (
              <TeamMemberCard
                key={member.name}
                member={member}
                index={index}
                total={TEAM_MEMBERS.length}
                compact
                headingLevel="h3"
                idPrefix="home-member"
              />
            ))}
          </div>
          <div className="home-crew__footer">
            <Link href="/team" className="underlined-link">
              View team page <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="site-container">
          <div className="section-heading section-heading--light">
            <div>
              <p className="eyebrow">More than a menu</p>
              <h2>Keep a little piece of the day</h2>
            </div>
            <p>
              Fair-day experiences deserve more than a shortcut. Start with a
              shared place for the moments worth keeping.
            </p>
          </div>
          <FeatureSpotlight
            content={MEMORY_BOOTH_SPOTLIGHT}
            icon={Camera}
            variant="memories"
            status={
              event?.featureFlags?.memoriesEnabled
                ? "Currently open"
                : "Opening details coming soon"
            }
          />
          <FeatureSpotlight
            content={LETTERS_SPOTLIGHT}
            icon={Heart}
            variant="letters"
            status={
              event?.featureFlags?.crushLettersEnabled
                ? "Currently open"
                : "Opening details coming soon"
            }
          />
          <FeatureSpotlight
            content={QUIZ_SPOTLIGHT}
            icon={Brain}
            variant="quiz"
            status={
              event?.featureFlags?.quizEnabled
                ? "Currently open"
                : "Opening details coming soon"
            }
          />
        </div>
      </section>
      <FairResultsSection results={GUSTO_2026_FINAL_RESULTS} />
    </main>
  );
}
