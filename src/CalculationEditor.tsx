import React from 'react';
import { fieldReducers, StandardEditorProps } from '@grafana/data';
import { MultiSelect } from '@grafana/ui';

export function CalculationEditor({ value, onChange }: StandardEditorProps<string[]>) {
  return (
    <MultiSelect
      value={value}
      options={fieldReducers.list().map((r) => ({ value: r.id, label: r.name, description: r.description }))}
      onChange={(items) => onChange(items.flatMap((item) => (item.value ? [item.value] : [])))}
    />
  );
}
