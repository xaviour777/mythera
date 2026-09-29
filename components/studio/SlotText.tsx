import type { Slot } from '../../lib/content';

/** Renders a resolved content slot: the real value, or a review-only placeholder token. */
export function SlotText({ slot, className }: { slot: Slot | null; className?: string }) {
  if (!slot) return null;
  if (slot.kind === 'value') return <span className={className}>{slot.text}</span>;
  return (
    <span className={`placeholder-token ${className ?? ''}`} title="Placeholder — shown on preview builds only">
      {slot.token}
    </span>
  );
}
