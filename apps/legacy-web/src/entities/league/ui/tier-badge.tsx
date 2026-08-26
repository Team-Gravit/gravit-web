import Tier from './tier';

export default function TierBadge({ tier }: { tier: number }) {
  return (
    <div className="flex items-center gap-2">
      <Tier tierId={tier} size="xs" />
      <span className="text-text-1">브론즈 3</span>
    </div>
  );
}
