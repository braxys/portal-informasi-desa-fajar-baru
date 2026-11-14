"use client";

import { Icon } from "@/components/shared/icons";

interface OrderControlsProps {
  label: string;
  canMoveUp: boolean;
  canMoveDown: boolean;
  pending: boolean;
  locked?: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function OrderControls({
  label,
  canMoveUp,
  canMoveDown,
  pending,
  locked = false,
  onMoveUp,
  onMoveDown,
}: OrderControlsProps) {
  const lockHint = locked
    ? "Reset filter dulu untuk mengubah urutan"
    : undefined;

  return (
    <div className="inline-flex items-center gap-0.5">
      <button
        type="button"
        onClick={onMoveUp}
        disabled={pending || locked || !canMoveUp}
        aria-label={`Naikkan ${label}`}
        title={lockHint ?? "Naikkan"}
        className="flex h-8 w-8 items-center justify-center rounded-md text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-25 sm:h-7 sm:w-7"
      >
        <Icon name="chevron-up" size={15} />
      </button>
      <button
        type="button"
        onClick={onMoveDown}
        disabled={pending || locked || !canMoveDown}
        aria-label={`Turunkan ${label}`}
        title={lockHint ?? "Turunkan"}
        className="flex h-8 w-8 items-center justify-center rounded-md text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-25 sm:h-7 sm:w-7"
      >
        <Icon name="chevron-down" size={15} />
      </button>
    </div>
  );
}
