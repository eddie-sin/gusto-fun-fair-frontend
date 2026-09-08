import { Fragment } from 'react';

// Renders plain text that uses **bold** markers and blank-line paragraph breaks,
// without pulling in a full markdown parser for a handful of announcement blocks.
function renderInline(line: string, keyPrefix: string) {
  const parts = line.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((part, index) => part.startsWith('**') && part.endsWith('**')
    ? <strong key={`${keyPrefix}-${index}`}>{part.slice(2, -2)}</strong>
    : <Fragment key={`${keyPrefix}-${index}`}>{part}</Fragment>);
}

export function FormattedMessage({ text }: { text: string }) {
  const paragraphs = text.trim().split(/\n\s*\n/);
  return <>{paragraphs.map((paragraph, pIndex) => <p key={pIndex}>{paragraph.split('\n').map((line, lIndex, all) => <Fragment key={lIndex}>{renderInline(line, `${pIndex}-${lIndex}`)}{lIndex < all.length - 1 && <br />}</Fragment>)}</p>)}</>;
}
