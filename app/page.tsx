"use client";
/* oxlint-disable next/no-img-element */

import Link from "next/link";
import {
  ArrowRight,
  Camera,
  Heart,
  MapPin,
  Sparkles,
  TicketCheck,
} from "lucide-react";
import { FoodCard } from "@/components/food-card";
import { EVENT_DETAILS } from "@/lib/content";
import { useApp } from "@/components/app-provider";
import { useFoods } from "@/lib/use-catalog";

export default function Home() {
  const { event } = useApp();
  const catalog = useFoods();
  const featuredFoods = catalog.foods.slice(0, 3);
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

      <section className="section site-container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">A first taste</p>
            <h2>Fairground favourites</h2>
          </div>
          <Link href="/foods" className="underlined-link">
            See the full menu <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>
        {catalog.isSample && (
          <p className="sample-note">
            A sample menu is shown while live availability reconnects.
          </p>
        )}
        <div className="food-grid food-grid--featured">
          {featuredFoods.map((food) => (
            <FoodCard key={food.stallFoodId} food={food} compact />
          ))}
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
              Two simple spaces for the things you want to remember—and the
              words you almost said.
            </p>
          </div>
          <div className="feature-panels">
            <article className="feature-panel feature-panel--memory">
              <Camera aria-hidden="true" />
              <p className="feature-number">01</p>
              <h3>Memory Booth</h3>
              <p>
                Take a photo at the fair, add a short caption, and leave it in
                the shared memory wall.
              </p>
              <Link href="/memories">
                Visit memories <ArrowRight aria-hidden="true" size={17} />
              </Link>
              <span className="feature-state">
                {event?.featureFlags?.memoriesEnabled
                  ? "Currently open"
                  : "Opening details coming soon"}
              </span>
            </article>
            <article className="feature-panel feature-panel--letters">
              <Heart aria-hidden="true" />
              <p className="feature-number">02</p>
              <h3>Crush Letters</h3>
              <p>
                Write an anonymous note for someone who made the day feel a
                little different.
              </p>
              <Link href="/crush-letters">
                Write a letter <ArrowRight aria-hidden="true" size={17} />
              </Link>
              <span className="feature-state">
                {event?.featureFlags?.crushLettersEnabled
                  ? "Accepting letters now"
                  : "Letters are currently closed"}
              </span>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
