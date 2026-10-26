import { PanelPlugin } from '@grafana/data';
import { BarGaugeDisplayMode, BarGaugeValueMode } from '@grafana/schema';
import { FlexibleBarGaugePanel } from './FlexibleBarGaugePanel';
import { defaults, Options } from './types';
import { CalculationEditor } from './CalculationEditor';

export const plugin = new PanelPlugin<Options>(FlexibleBarGaugePanel).useFieldConfig().setPanelOptions((builder) => {
  const names = ['Names'];
  const bars = ['Bars'];
  const values = ['Values'];
  const visible = (o: Options) => o.namePlacement !== 'hidden';
  builder
    .addRadio({
      path: 'namePlacement',
      name: 'Position',
      category: names,
      defaultValue: defaults.namePlacement,
      settings: {
        options: [
          { value: 'left', label: 'Left' },
          { value: 'right', label: 'Right' },
          { value: 'hidden', label: 'Hidden' },
        ],
      },
    })
    .addRadio({
      path: 'nameWidthUnit',
      name: 'Width unit',
      category: names,
      defaultValue: defaults.nameWidthUnit,
      showIf: visible,
      settings: {
        options: [
          { value: 'px', label: 'Pixels' },
          { value: 'percent', label: 'Percent' },
        ],
      },
    })
    .addNumberInput({
      path: 'nameWidth',
      name: 'Column width',
      category: names,
      defaultValue: defaults.nameWidth,
      showIf: visible,
      description:
        'Pixels or percent of available panel width (percentage capped at 80). Narrow panels scroll horizontally.',
      settings: { min: 0, max: 4000 },
    })
    .addRadio({
      path: 'nameAlign',
      name: 'Alignment',
      category: names,
      defaultValue: defaults.nameAlign,
      showIf: visible,
      settings: {
        options: [
          { value: 'left', label: 'Left' },
          { value: 'center', label: 'Center' },
          { value: 'right', label: 'Right' },
        ],
      },
    })
    .addRadio({
      path: 'nameOverflow',
      name: 'Long names',
      category: names,
      defaultValue: defaults.nameOverflow,
      showIf: visible,
      settings: {
        options: [
          { value: 'ellipsis', label: 'Ellipsis' },
          { value: 'clip', label: 'Clip' },
          { value: 'wrap', label: 'Wrap' },
        ],
      },
    })
    .addNumberInput({
      path: 'nameFontSize',
      name: 'Name font size',
      category: names,
      defaultValue: defaults.nameFontSize,
      showIf: visible,
      settings: { min: 8, max: 72 },
    })
    .addNumberInput({
      path: 'columnGap',
      name: 'Gap to gauge',
      category: names,
      defaultValue: defaults.columnGap,
      showIf: visible,
      settings: { min: 0, max: 100 },
    })
    .addRadio({
      path: 'displayMode',
      name: 'Display mode',
      category: bars,
      defaultValue: defaults.displayMode,
      settings: {
        options: [
          { value: BarGaugeDisplayMode.Gradient, label: 'Gradient' },
          { value: BarGaugeDisplayMode.Basic, label: 'Basic' },
          { value: BarGaugeDisplayMode.Lcd, label: 'Retro LCD' },
        ],
      },
    })
    .addRadio({
      path: 'valueMode',
      name: 'Value display',
      category: bars,
      defaultValue: defaults.valueMode,
      settings: {
        options: [
          { value: BarGaugeValueMode.Color, label: 'Value color' },
          { value: BarGaugeValueMode.Text, label: 'Text color' },
          { value: BarGaugeValueMode.Hidden, label: 'Hidden' },
        ],
      },
    })
    .addBooleanSwitch({
      path: 'showUnfilled',
      name: 'Show unfilled area',
      category: bars,
      defaultValue: true,
      showIf: (o) => o.displayMode !== BarGaugeDisplayMode.Lcd,
    })
    .addNumberInput({
      path: 'rowHeight',
      name: 'Bar height',
      category: bars,
      defaultValue: defaults.rowHeight,
      settings: { min: 18, max: 300 },
    })
    .addNumberInput({
      path: 'rowGap',
      name: 'Row gap',
      category: bars,
      defaultValue: defaults.rowGap,
      settings: { min: 0, max: 100 },
    })
    .addNumberInput({
      path: 'valueFontSize',
      name: 'Value font size',
      category: bars,
      defaultValue: defaults.valueFontSize,
      settings: { min: 8, max: 72 },
    })
    .addRadio({
      path: 'reduceOptions.values',
      name: 'Show',
      category: values,
      defaultValue: false,
      settings: {
        options: [
          { value: false, label: 'Calculate' },
          { value: true, label: 'All values' },
        ],
      },
    })
    .addCustomEditor({
      id: 'calculations',
      path: 'reduceOptions.calcs',
      name: 'Calculations',
      category: values,
      defaultValue: defaults.reduceOptions.calcs,
      showIf: (o) => !o.reduceOptions?.values,
      editor: CalculationEditor,
    })
    .addTextInput({
      path: 'reduceOptions.fields',
      name: 'Fields (regex)',
      category: values,
      defaultValue: '',
      description: 'Empty selects numeric fields.',
    })
    .addNumberInput({
      path: 'reduceOptions.limit',
      name: 'Row limit',
      category: values,
      defaultValue: 100,
      showIf: (o) => !!o.reduceOptions?.values,
      settings: { min: 1, max: 5000 },
    });
});
