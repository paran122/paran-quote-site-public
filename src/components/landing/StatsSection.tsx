"use client";

import { STATS } from "@/lib/constants";
import { useInView, useCountUp } from "@/lib/utils";

function StatItem({ value, suffix, label, start }: {
  value: number;
  suffix: string;
  label: string;
  start: boolean;
}) {
  const count = useCountUp(value, 2000, start);

  const display = value % 1 !== 0
    ? count.toFixed(1)
    : count.toLocaleString("ko-KR");

  return (
    <div className="text-center">
      <p className="text-[2.5rem] font-bold font-num text-slate-900 tracking-tight">
        {display}
        <span className="text-slate-400 text-lg ml-0.5">{suffix}</span>
      </p>
      <p className="mt-1 text-[13px] text-slate-500">{label}</p>
    </div>
  );
}

export default function StatsSection() {
  const { ref, inView } = useInView(0.3);

  return (
    <section className="bg-white py-16">
      <div
        ref={ref}
        className="max-w-content mx-auto px-6"
      >
        <div className="border border-slate-200 rounded-[10px] py-10 px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <StatItem
                key={stat.label}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                start={inView}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
