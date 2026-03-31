"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
  q: string;
  a: string;
}

export default function ServiceFAQ({ items }: { items: FAQItem[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={i}
          className="rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
        >
          <button
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
          >
            <span className="text-[15px] font-medium text-slate-900">
              {item.q}
            </span>
            <motion.span
              animate={{ rotate: openIdx === i ? 45 : 0 }}
              transition={{ duration: 0.2 }}
              className="shrink-0 text-blue-600"
            >
              <Plus size={18} />
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {openIdx === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="border-t border-slate-100 px-5 pb-5 pt-4">
                  <div className="border-l-2 border-blue-500/40 pl-4 text-sm text-slate-600 leading-relaxed">
                    {item.a}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
