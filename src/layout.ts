// Pure sizing logic: the label width is shared by every row.
export function finiteNumber(value: number, fallback: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : fallback));
}

export function columnLayout(
  viewport: number,
  requested: number,
  unit: 'px' | 'percent',
  hidden: boolean,
  gap: number,
  minGauge = 240
) {
  const available = Math.max(0, viewport);
  const name = hidden
    ? 0
    : unit === 'percent'
      ? (available * finiteNumber(requested, 30, 0, 80)) / 100
      : finiteNumber(requested, 180, 0, 4000);
  const spacing = name > 0 ? finiteNumber(gap, 12, 0, 100) : 0;
  const gauge = Math.max(minGauge, available - name - spacing);
  return { name, gap: spacing, gauge, total: name + spacing + gauge };
}
