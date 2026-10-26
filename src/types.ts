import type { ReduceDataOptions } from '@grafana/data';
import { BarGaugeDisplayMode, BarGaugeValueMode } from '@grafana/schema';

export interface Options {
  namePlacement: 'left' | 'right' | 'hidden';
  nameWidth: number;
  nameWidthUnit: 'px' | 'percent';
  nameAlign: 'left' | 'center' | 'right';
  nameOverflow: 'ellipsis' | 'clip' | 'wrap';
  nameFontSize: number;
  valueFontSize: number;
  rowHeight: number;
  rowGap: number;
  columnGap: number;
  displayMode: BarGaugeDisplayMode;
  valueMode: BarGaugeValueMode;
  showUnfilled: boolean;
  reduceOptions: ReduceDataOptions;
}

export const defaults: Options = {
  namePlacement: 'left',
  nameWidth: 180,
  nameWidthUnit: 'px',
  nameAlign: 'left',
  nameOverflow: 'ellipsis',
  nameFontSize: 14,
  valueFontSize: 18,
  rowHeight: 36,
  rowGap: 8,
  columnGap: 12,
  displayMode: BarGaugeDisplayMode.Gradient,
  valueMode: BarGaugeValueMode.Color,
  showUnfilled: true,
  reduceOptions: { calcs: ['lastNotNull'], values: false, limit: 100 },
};
