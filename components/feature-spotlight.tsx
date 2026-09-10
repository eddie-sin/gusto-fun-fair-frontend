import Link from "next/link";
import { ArrowRight, type LucideIcon, Sparkles } from "lucide-react";
import type { FeatureSpotlightContent } from "@/lib/feature-spotlights";

type FeatureSpotlightProps = {
  content: FeatureSpotlightContent;
  icon: LucideIcon;
  status: string;
  variant: "memories" | "letters" | "quiz";
};

export function FeatureSpotlight({
  content,
  icon: Icon,
  status,
  variant,
}: FeatureSpotlightProps) {
  const titleId = `feature-spotlight-${content.number}`;

  return (
    <article
      className={`feature-spotlight feature-spotlight--${variant}`}
      aria-labelledby={titleId}
    >
      <section className="feature-spotlight__intro">
        <div className="feature-spotlight__topline">
          <span className="feature-spotlight__icon" aria-hidden="true">
            <Icon />
          </span>
          <span className="feature-spotlight__number">{content.number}</span>
        </div>
        <div className="feature-spotlight__copy">
          <p className="eyebrow">{content.introEyebrow}</p>
          <h3 id={titleId}>{content.title}</h3>
          <p>{content.description}</p>
          <Link href={content.href} className="feature-spotlight__link">
            {content.cta} <ArrowRight aria-hidden="true" size={18} />
          </Link>
          <span className="feature-state">{status}</span>
        </div>
        <div className="feature-spotlight__keepsake" aria-hidden="true">
          <span />
          <Sparkles />
          <small>{content.keepsakeLabel}</small>
        </div>
      </section>

      <aside className="feature-spotlight__guide">
        <div className="feature-spotlight__guide-heading">
          <span>FIELD NOTES</span>
          <span>{content.number} / {content.guideLabel}</span>
        </div>
        <section>
          <p className="eyebrow">How it works</p>
          <ol className="feature-spotlight__steps">
            {content.englishSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
        <section lang="my" className="feature-spotlight__burmese">
          <p className="eyebrow">မြန်မာလို</p>
          <ol className="feature-spotlight__steps">
            {content.burmeseSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
        <p className="feature-spotlight__note">{content.operationalNote}</p>
      </aside>
    </article>
  );
}
