/* oxlint-disable next/no-img-element */

import { Asterisk } from "lucide-react";
import type { TeamMember } from "@/lib/team";

type TeamMemberCardProps = {
  member: TeamMember;
  index: number;
  total: number;
  compact?: boolean;
  headingLevel?: "h2" | "h3";
  idPrefix?: string;
  eager?: boolean;
};

export function TeamMemberCard({
  member,
  index,
  total,
  compact = false,
  headingLevel = "h2",
  idPrefix = "member",
  eager = false,
}: TeamMemberCardProps) {
  const Heading = headingLevel;
  const headingId = `${idPrefix}-${index}`;
  const position = String(index + 1).padStart(2, "0");
  const count = String(total).padStart(2, "0");

  return (
    <article
      className={`crew-member crew-member--${index + 1}${compact ? " crew-member--compact" : ""}`}
      aria-labelledby={headingId}
    >
      <div className="crew-member__sheet">
        <div className="crew-member__top">
          <span>THE FUN FAIR CREW</span>
          <span>
            {position} / {count}
          </span>
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
              loading={eager ? "eager" : "lazy"}
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
          <Heading id={headingId}>{member.name}</Heading>
          {member.alias && (
            <span className="crew-member__alias">
              also known as {member.alias}
            </span>
          )}
          <p className="crew-member__description">{member.description}</p>
        </div>
      </div>
    </article>
  );
}
