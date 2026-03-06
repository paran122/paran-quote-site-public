"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import { useEffect, useState, useCallback } from "react";

const words = ["세미나", "컨퍼런스", "포럼", "축제", "교육"];
const suffix = "를 성공으로 이끕니다";

function useFlipWord(duration = 2500) {
  const [index, setIndex] = useState(0);
  const next = useCallback(() => setIndex((i) => (i + 1) % words.length), []);
  useEffect(() => {
    const id = setInterval(next, duration);
    return () => clearInterval(id);
  }, [next, duration]);
  return words[index];
}

/* ─────────────────────────────────────────────
   1. Cinematic Stagger — 글자가 하나씩 아래에서 튀어오르며 등장
   ───────────────────────────────────────────── */
export function TitleCinematicStagger() {
  const word = useFlipWord();
  const fullText = `${suffix}`;

  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.04, delayChildren: 0.1 },
    },
  };

  const letter: Variants = {
    hidden: { opacity: 0, y: 80, rotateX: -90, scale: 0.5 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: { type: "spring", damping: 12, stiffness: 200 },
    },
  };

  return (
    <h1 className="mb-4 text-4xl font-bold leading-tight text-white md:text-5xl md:leading-tight lg:text-6xl lg:leading-tight" style={{ perspective: "1000px" }}>
      <span className="font-mono font-light text-sky-400">{"{"}</span>{" "}
      <AnimatePresence mode="wait">
        <motion.span
          key={word}
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -40, filter: "blur(10px)" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-block text-sky-400"
        >
          {word}
        </motion.span>
      </AnimatePresence>{" "}
      <span className="font-mono font-light text-sky-400">{"}"}</span>
      <br />
      <motion.span
        key="stagger-suffix"
        className="inline-block text-white/90"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {fullText.split("").map((char, i) => (
          <motion.span key={i} variants={letter} className="inline-block" style={{ willChange: "transform" }}>
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.span>
    </h1>
  );
}

/* ─────────────────────────────────────────────
   2. Glitch Reveal — 글리치 효과와 함께 나타남
   ───────────────────────────────────────────── */
export function TitleGlitchReveal() {
  const word = useFlipWord();
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setCycle((c) => c + 1), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <h1 className="relative mb-4 text-4xl font-bold leading-tight text-white md:text-5xl md:leading-tight lg:text-6xl lg:leading-tight">
      <span className="font-mono font-light text-sky-400">{"{"}</span>{" "}
      <AnimatePresence mode="wait">
        <motion.span
          key={word}
          className="relative inline-block text-sky-400"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.4 }}
        >
          <motion.span
            className="absolute inset-0 text-red-400/60"
            animate={{ x: [0, -3, 3, -1, 0], y: [0, 2, -2, 1, 0] }}
            transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 3 }}
          >
            {word}
          </motion.span>
          <motion.span
            className="absolute inset-0 text-cyan-400/60"
            animate={{ x: [0, 3, -3, 1, 0], y: [0, -2, 2, -1, 0] }}
            transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 3, delay: 0.05 }}
          >
            {word}
          </motion.span>
          <span className="relative">{word}</span>
        </motion.span>
      </AnimatePresence>{" "}
      <span className="font-mono font-light text-sky-400">{"}"}</span>
      <br />
      <motion.span
        key={`suffix-${cycle}`}
        className="inline-block overflow-hidden text-white/90"
        initial={{ width: 0 }}
        animate={{ width: "auto" }}
        transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
      >
        <span className="inline-block whitespace-nowrap">
          {suffix.split("").map((char, i) => (
            <motion.span
              key={`${cycle}-${i}`}
              className="inline-block"
              initial={{ opacity: 0, filter: "blur(12px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.04 }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </span>
      </motion.span>
    </h1>
  );
}

/* ─────────────────────────────────────────────
   3. Wave Cascade — 파도처럼 위아래로 물결치며 등장
   ───────────────────────────────────────────── */
export function TitleWaveCascade() {
  const word = useFlipWord();
  const allChars = `${suffix}`;

  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.06, delayChildren: 0.4 },
    },
  };

  const letter: Variants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 8, stiffness: 150 },
    },
  };

  const wordVariants: Variants = {
    hidden: { opacity: 0, scale: 1.5, filter: "blur(20px)" },
    visible: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 0.6, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.5, filter: "blur(20px)" },
  };

  return (
    <h1 className="mb-4 text-4xl font-bold leading-tight text-white md:text-5xl md:leading-tight lg:text-6xl lg:leading-tight">
      <span className="font-mono font-light text-sky-400">{"{"}</span>{" "}
      <AnimatePresence mode="wait">
        <motion.span
          key={word}
          className="inline-block text-sky-400"
          variants={wordVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {word}
        </motion.span>
      </AnimatePresence>{" "}
      <span className="font-mono font-light text-sky-400">{"}"}</span>
      <br />
      <motion.span
        className="inline-block text-white/90"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {allChars.split("").map((char, i) => (
          <motion.span key={i} variants={letter} className="inline-block">
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.span>
    </h1>
  );
}

/* ─────────────────────────────────────────────
   4. Typewriter Decode — 랜덤 문자가 빠르게 바뀌다가 원래 글자로 디코딩
   ───────────────────────────────────────────── */
function useScramble(text: string, duration = 1500) {
  const [display, setDisplay] = useState(text);
  const chars = "가나다라마바사아자차카타파하행사기획을성공으로이끕니다";

  useEffect(() => {
    const steps = 20;
    const interval = duration / steps;
    let step = 0;
    const id = setInterval(() => {
      step++;
      const progress = step / steps;
      const result = text
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          if (i / text.length < progress) return char;
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");
      setDisplay(result);
      if (step >= steps) clearInterval(id);
    }, interval);
    return () => clearInterval(id);
  }, [text, duration]);

  return display;
}

export function TitleTypewriterDecode() {
  const word = useFlipWord();
  const decoded = useScramble(suffix, 1200);

  const wordVariants: Variants = {
    hidden: { opacity: 0, rotateY: 90 },
    visible: { opacity: 1, rotateY: 0, transition: { duration: 0.5, ease: "easeInOut" } },
    exit: { opacity: 0, rotateY: -90 },
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  return (
    <h1 className="mb-4 text-4xl font-bold leading-tight text-white md:text-5xl md:leading-tight lg:text-6xl lg:leading-tight">
      <span className="font-mono font-light text-sky-400">{"{"}</span>{" "}
      <AnimatePresence mode="wait">
        <motion.span
          key={word}
          className="inline-block text-sky-400"
          variants={wordVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{ perspective: "800px", display: "inline-block" }}
        >
          {word}
        </motion.span>
      </AnimatePresence>{" "}
      <span className="font-mono font-light text-sky-400">{"}"}</span>
      <br />
      <motion.span
        className="inline-block font-mono text-white/90"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {decoded.split("").map((char, i) => (
          <span
            key={i}
            className="inline-block"
            style={{
              color: char === suffix[i] ? "rgba(255,255,255,0.9)" : "rgba(96,165,250,0.7)",
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </motion.span>
    </h1>
  );
}

/* ─────────────────────────────────────────────
   5. Split Fly In — 글자가 사방에서 회전하며 날아와 제자리에 착지
   ───────────────────────────────────────────── */
export function TitleSplitFlyIn() {
  const word = useFlipWord();
  const allChars = `${suffix}`;

  const wordVariants: Variants = {
    hidden: { opacity: 0, scale: 0, rotate: -180 },
    visible: { opacity: 1, scale: 1, rotate: 0, transition: { type: "spring", damping: 15, stiffness: 200 } },
    exit: { opacity: 0, scale: 0, rotate: 180 },
  };

  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.07, delayChildren: 0.3 },
    },
  };

  const flyIn = (i: number): Variants => ({
    hidden: {
      x: (i % 2 === 0 ? -1 : 1) * (100 + (i * 37) % 200),
      y: (i % 3 === 0 ? -1 : 1) * (80 + (i * 53) % 150),
      rotate: ((i * 73) % 360) - 180,
      scale: 0,
      opacity: 0,
    },
    visible: {
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
      opacity: 1,
      transition: { type: "spring", damping: 12, stiffness: 100 },
    },
  });

  return (
    <h1 className="mb-4 text-4xl font-bold leading-tight text-white md:text-5xl md:leading-tight lg:text-6xl lg:leading-tight">
      <span className="font-mono font-light text-sky-400">{"{"}</span>{" "}
      <AnimatePresence mode="wait">
        <motion.span
          key={word}
          className="inline-block text-sky-400"
          variants={wordVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {word}
        </motion.span>
      </AnimatePresence>{" "}
      <span className="font-mono font-light text-sky-400">{"}"}</span>
      <br />
      <motion.span
        className="inline-block text-white/90"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {allChars.split("").map((char, i) => (
          <motion.span key={i} variants={flyIn(i)} className="inline-block">
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.span>
    </h1>
  );
}

/* ─────────────────────────────────────────────
   Animation Selector 컴포넌트
   ───────────────────────────────────────────── */
const animations = [
  { name: "Cinematic", component: TitleCinematicStagger },
  { name: "Glitch", component: TitleGlitchReveal },
  { name: "Wave", component: TitleWaveCascade },
  { name: "Decode", component: TitleTypewriterDecode },
  { name: "Fly In", component: TitleSplitFlyIn },
];

export function HeroTitleSelector({
  selected,
  onChange,
}: {
  selected: number;
  onChange: (i: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {animations.map((anim, i) => (
        <button
          key={anim.name}
          onClick={() => onChange(i)}
          className={`rounded-full border px-3 py-1 font-mono text-xs transition-all ${
            selected === i
              ? "border-sky-400 bg-sky-400/20 text-sky-300 shadow-lg shadow-sky-400/20"
              : "border-white/20 bg-white/5 text-white/50 hover:border-white/40 hover:text-white/70"
          }`}
        >
          {i + 1}. {anim.name}
        </button>
      ))}
    </div>
  );
}

export function AnimatedTitle({ index }: { index: number }) {
  const Comp = animations[index]?.component ?? TitleCinematicStagger;
  return <Comp key={index} />;
}

export { animations };
