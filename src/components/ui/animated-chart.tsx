"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { GlassCard } from "./glass-card";

const defaultData = [
  { name: "Mon", value: 65 },
  { name: "Tue", value: 78 },
  { name: "Wed", value: 90 },
  { name: "Thu", value: 72 },
  { name: "Fri", value: 85 },
  { name: "Sat", value: 95 },
  { name: "Sun", value: 88 },
];

interface AnimatedChartProps {
  title: string;
  type?: "area" | "bar" | "line";
  data?: typeof defaultData;
  color?: string;
}

export function AnimatedChart({
  title,
  type = "area",
  data = defaultData,
  color = "#6C63FF",
}: AnimatedChartProps) {
  const gradientId = `grad-${title.replace(/\s/g, "")}`;

  return (
    <GlassCard className="h-52">
      <h4 className="text-sm font-medium text-muted mb-3">{title}</h4>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="h-36"
      >
        <ResponsiveContainer width="100%" height="100%">
          {type === "area" ? (
            <AreaChart data={data}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" tick={{ fill: "#A1A1AA", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  background: "#1B2540",
                  border: "1px solid rgba(108,99,255,0.3)",
                  borderRadius: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                fill={`url(#${gradientId})`}
                strokeWidth={2}
              />
            </AreaChart>
          ) : type === "bar" ? (
            <BarChart data={data}>
              <XAxis dataKey="name" tick={{ fill: "#A1A1AA", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  background: "#1B2540",
                  border: "1px solid rgba(108,99,255,0.3)",
                  borderRadius: "12px",
                }}
              />
              <Bar dataKey="value" fill={color} radius={[6, 6, 0, 0]} />
            </BarChart>
          ) : (
            <LineChart data={data}>
              <XAxis dataKey="name" tick={{ fill: "#A1A1AA", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  background: "#1B2540",
                  border: "1px solid rgba(108,99,255,0.3)",
                  borderRadius: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                dot={{ fill: color, r: 3 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </motion.div>
    </GlassCard>
  );
}
