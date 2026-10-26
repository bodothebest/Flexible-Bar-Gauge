import React, { useLayoutEffect, useRef, useState } from 'react';
import { getDisplayValueAlignmentFactors, getFieldDisplayValues, PanelProps, VizOrientation } from '@grafana/data';
import { BarGaugeNamePlacement } from '@grafana/schema';
import { BarGauge, DataLinksContextMenu, useTheme2 } from '@grafana/ui';
import { defaults, Options } from './types';
import { columnLayout, finiteNumber } from './layout';

export function FlexibleBarGaugePanel(props: PanelProps<Options>) {
  const { data, fieldConfig, replaceVariables, timeZone, width, height } = props;
  const options = {
    ...defaults,
    ...props.options,
    reduceOptions: { ...defaults.reduceOptions, ...props.options.reduceOptions },
  };
  const theme = useTheme2();
  const viewport = useRef<HTMLDivElement>(null);
  const [clientWidth, setClientWidth] = useState(width);
  useLayoutEffect(() => {
    const node = viewport.current;
    if (!node) {
      return;
    }
    const update = () => setClientWidth(node.clientWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, [width, height]);

  const values = getFieldDisplayValues({
    data: data.series,
    fieldConfig,
    replaceVariables,
    timeZone,
    theme,
    reduceOptions: {
      ...options.reduceOptions,
      limit: finiteNumber(options.reduceOptions.limit ?? 100, 100, 1, 5000),
    },
  });
  // Strip titles in BOTH places so Grafana never reserves a second name column.
  const alignment = getDisplayValueAlignmentFactors(
    values.map((value) => ({
      ...value,
      display: { ...value.display, title: undefined },
    }))
  );
  const fontSize = finiteNumber(options.nameFontSize, 14, 8, 72);
  const valueFontSize = finiteNumber(options.valueFontSize, 18, 8, 72);
  const rowHeight = Math.max(valueFontSize * 1.5, finiteNumber(options.rowHeight, 36, 18, 300));
  // Long formatted values need enough space before the native gauge is rendered.
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (context) {
    context.font = `${valueFontSize}px ${theme.typography.fontFamily}`;
  }
  const formatted = `${alignment.prefix ?? ''}${alignment.text}${alignment.suffix ?? ''}`;
  const valueWidth = context?.measureText(formatted).width ?? formatted.length * valueFontSize;
  const columns = columnLayout(
    clientWidth,
    options.nameWidth,
    options.nameWidthUnit,
    options.namePlacement === 'hidden',
    options.columnGap,
    Math.max(240, valueWidth + 100)
  );

  return (
    <div ref={viewport} style={{ width, height, overflow: 'auto', color: theme.colors.text.primary }}>
      {values.length === 0 ? (
        <div role="status">No numeric values</div>
      ) : (
        <div
          style={{
            width: columns.total,
            display: 'flex',
            flexDirection: 'column',
            gap: finiteNumber(options.rowGap, 8, 0, 100),
          }}
        >
          {values.map((item, index) => {
            const name = item.display.title ?? item.name;
            const label = columns.name > 0 && (
              <div
                title={name}
                style={{
                  minWidth: 0,
                  width: columns.name,
                  textAlign: options.nameAlign,
                  fontSize,
                  lineHeight: 1.4,
                  overflow: 'hidden',
                  whiteSpace: options.nameOverflow === 'wrap' ? 'normal' : 'nowrap',
                  overflowWrap: 'anywhere',
                  textOverflow: options.nameOverflow === 'ellipsis' ? 'ellipsis' : 'clip',
                }}
              >
                {name}
              </div>
            );
            const renderRow = (onClick?: React.MouseEventHandler<HTMLElement>) => (
              <div
                style={{
                  display: 'grid',
                  alignItems: 'center',
                  columnGap: columns.gap,
                  gridTemplateColumns:
                    columns.name === 0
                      ? `${columns.gauge}px`
                      : options.namePlacement === 'right'
                        ? `${columns.gauge}px ${columns.name}px`
                        : `${columns.name}px ${columns.gauge}px`,
                  minHeight: rowHeight,
                }}
              >
                {options.namePlacement === 'left' && label}
                <div aria-label={name} style={{ width: columns.gauge, height: rowHeight }}>
                  <BarGauge
                    width={columns.gauge}
                    height={rowHeight}
                    theme={theme}
                    orientation={VizOrientation.Horizontal}
                    value={{ ...item.display, title: undefined }}
                    field={item.field}
                    display={
                      item.view && item.colIndex !== undefined
                        ? item.view.getFieldDisplayProcessor(item.colIndex)
                        : undefined
                    }
                    alignmentFactors={{ ...alignment, title: undefined }}
                    namePlacement={BarGaugeNamePlacement.Hidden}
                    text={{ valueSize: valueFontSize }}
                    displayMode={options.displayMode}
                    valueDisplayMode={options.valueMode}
                    showUnfilled={options.showUnfilled}
                    itemSpacing={options.displayMode === 'lcd' ? 2 : 10}
                    onClick={onClick}
                  />
                </div>
                {options.namePlacement === 'right' && label}
              </div>
            );
            return item.hasLinks && item.getLinks ? (
              <DataLinksContextMenu key={index} links={item.getLinks}>
                {({ openMenu }) => renderRow(openMenu)}
              </DataLinksContextMenu>
            ) : (
              <React.Fragment key={index}>{renderRow()}</React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
}
