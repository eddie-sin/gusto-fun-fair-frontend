import { Crown, LoaderCircle, LockKeyhole } from "lucide-react";
import { formatMoney } from "@/lib/api";
import type {
  FairResultStatus,
  FairResults,
  RankedItemResult,
  RankedStallItemsResult,
  RankedStallRevenueResult,
} from "@/lib/types";

type FairResultsSectionProps = {
  results?: FairResults;
};

const PLACEHOLDER_RANKS = [1, 2, 3];

function RankMark({ rank }: { rank: number }) {
  const accent = rank <= 3 ? ` fair-result-rank--${rank}` : "";
  return (
    <span className={`fair-result-rank${accent}`} aria-label={`Rank ${rank}`}>
      {String(rank).padStart(2, "0")}
    </span>
  );
}

function LockedRows() {
  return (
    <ol className="fair-result-list" aria-label="Results not yet revealed">
      {PLACEHOLDER_RANKS.map((rank) => (
        <li className="fair-result-row fair-result-row--locked" key={rank}>
          <RankMark rank={rank} />
          <span aria-label={`Rank ${rank} not yet revealed`}>???</span>
        </li>
      ))}
    </ol>
  );
}

function RevenueRows({ entries }: { entries: RankedStallRevenueResult[] }) {
  return (
    <ol className="fair-result-list">
      {entries.map((entry, index) => (
        <li className="fair-result-row" key={`${entry.rank}-${entry.stallName}-${index}`}>
          <RankMark rank={entry.rank} />
          <strong>{entry.stallName}</strong>
          <span className="fair-result-row__value">{formatMoney(entry.revenue)}</span>
        </li>
      ))}
    </ol>
  );
}

function ItemsSoldRows({ entries }: { entries: RankedStallItemsResult[] }) {
  return (
    <ol className="fair-result-list">
      {entries.map((entry, index) => (
        <li className="fair-result-row" key={`${entry.rank}-${entry.stallName}-${index}`}>
          <RankMark rank={entry.rank} />
          <strong>{entry.stallName}</strong>
          <span className="fair-result-row__value">{entry.itemsSold} sold</span>
        </li>
      ))}
    </ol>
  );
}

function BestItemRows({ entries }: { entries: RankedItemResult[] }) {
  return (
    <ol className="fair-result-list">
      {entries.map((entry, index) => (
        <li className="fair-result-row" key={`${entry.rank}-${entry.itemName}-${entry.stallName}-${index}`}>
          <RankMark rank={entry.rank} />
          <span className="fair-result-row__name">
            <strong>{entry.itemName}</strong>
            <small>{entry.stallName}</small>
          </span>
          {entry.itemsSold !== undefined && (
            <span className="fair-result-row__value">{entry.itemsSold} sold</span>
          )}
        </li>
      ))}
    </ol>
  );
}

function ResultsNotice({ status }: { status: Exclude<FairResultStatus, "READY"> }) {
  const calculating = status === "CALCULATING";
  return (
    <div className="closed-message fair-results__notice" role="status" aria-live="polite">
      {calculating ? (
        <LoaderCircle className="is-spinning" aria-hidden="true" />
      ) : (
        <LockKeyhole aria-hidden="true" />
      )}
      <div>
        <p>{calculating ? "Results are being calculated…" : "The results are still under wraps."}</p>
        <span>
          {calculating
            ? "The organisers are checking the final totals before announcing the winners."
            : "Results will be revealed once the official fair totals are finalized."}
        </span>
      </div>
    </div>
  );
}

export function FairResultsSection({ results }: FairResultsSectionProps) {
  const status = results?.status ?? "LOCKED";
  const ready = status === "READY" && results !== undefined;

  return (
    <section className="fair-results" aria-labelledby="fair-results-title" aria-busy={status === "CALCULATING"}>
      <div className="site-container">
        <div className="section-heading fair-results__heading">
          <div>
            <p className="eyebrow">07 / Fair results</p>
            <h2 id="fair-results-title">Who will take the crown?</h2>
          </div>
          <p>
            {ready
              ? "The official GUSTO Fun Fair 2026 results are in. Meet this year’s top stalls and most-loved items."
              : "The official winners will appear here once the organisers have finalized the fair totals."}
          </p>
        </div>

        {!ready && <ResultsNotice status={status} />}

        <div className="fair-results__grid">
          <article className="fair-result-card">
            <div className="fair-result-card__heading">
              <span>01</span>
              <Crown aria-hidden="true" size={20} strokeWidth={1.8} />
            </div>
            <p className="feature-state">Revenue leaders</p>
            <h3>Top 3 stalls by revenue</h3>
            {ready ? <RevenueRows entries={results.topStallsByRevenue} /> : <LockedRows />}
          </article>

          <article className="fair-result-card">
            <div className="fair-result-card__heading">
              <span>02</span>
              <Crown aria-hidden="true" size={20} strokeWidth={1.8} />
            </div>
            <p className="feature-state">Crowd favourites</p>
            <h3>Top 3 stalls by items sold</h3>
            {ready ? <ItemsSoldRows entries={results.topStallsByItemsSold} /> : <LockedRows />}
          </article>

          <article className="fair-result-card">
            <div className="fair-result-card__heading">
              <span>03</span>
              <Crown aria-hidden="true" size={20} strokeWidth={1.8} />
            </div>
            <p className="feature-state">Most ordered</p>
            <h3>Best-selling individual items</h3>
            {ready ? <BestItemRows entries={results.bestSellingItems} /> : <LockedRows />}
          </article>
        </div>
      </div>
    </section>
  );
}
