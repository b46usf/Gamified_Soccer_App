// app/components/chart.tsx
"use client";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";

import {
  ValueType,
  NameType,
  Payload,
} from "recharts/types/component/DefaultTooltipContent";

export type ChartData = {
  name: string;
  [key: string]: number | string;
};

export type ChartConfig = {
  dataKey: string;
  stroke: string;
  fill: string;
};

export interface ChartProps {
  data: ChartData[];
  config: ChartConfig[];
}

function getPayloadConfigFromPayload(
  config: ChartConfig[],
  payload: Payload<ValueType, NameType>,
  key: string
) {
  return config.find(
    (c) =>
      payload.payload &&
      typeof payload.payload === "object" &&
      "fill" in payload.payload &&
      (payload.payload as Record<string, unknown>).fill === c.fill &&
      c.dataKey === key
  );
}

const ChartTooltipContent = ({
  label,
  payload,
}: TooltipProps<ValueType, NameType>) => {
  return (
    <div className="rounded-md bg-background p-2 shadow">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-2 space-y-2">
        {payload?.map(
          (item: Payload<ValueType, NameType>, index: number) => {
            const config = getPayloadConfigFromPayload(
              CHART_COLOR,
              item,
              item.dataKey as string
            );

            if (!config) return null;

            return (
              <div key={index} className="flex items-center gap-2">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: config.fill }}
                />
                <span className="text-sm text-muted-foreground">
                  {item.name}:
                </span>
                <span className="text-sm font-medium text-foreground">
                  {item.value}
                </span>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};

const ChartLegendContent = ({
  payload,
}: {
  payload?: Payload<ValueType, NameType>[];
}) => {
  return (
    <ul className="flex flex-wrap items-center gap-4">
      {payload?.map(
        (item: Payload<ValueType, NameType>, index: number) => {
          const config = getPayloadConfigFromPayload(
            CHART_COLOR,
            item,
            item.dataKey as string
          );

          if (!config) return null;

          return (
            <li key={index} className="flex items-center gap-2">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: config.fill }}
              />
              <span className="text-sm text-muted-foreground">
                {item.value}
              </span>
            </li>
          );
        }
      )}
    </ul>
  );
};

// Default dummy color config
const CHART_COLOR: ChartConfig[] = [
  {
    dataKey: "uv",
    stroke: "#8884d8",
    fill: "#8884d8",
  },
  {
    dataKey: "pv",
    stroke: "#82ca9d",
    fill: "#82ca9d",
  },
];

export function Chart({ data, config }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" stroke="#888888" fontSize={12} />
        <YAxis stroke="#888888" fontSize={12} />
        <Tooltip content={<ChartTooltipContent />} />
        <Legend content={<ChartLegendContent />} />
        {config.map((entry) => (
          <Line
            key={entry.dataKey}
            type="monotone"
            dataKey={entry.dataKey}
            stroke={entry.stroke}
            fill={entry.fill}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
