"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "group relative flex flex-col overflow-hidden rounded-lg border bg-white text-slate-900 shadow-sm transition-all duration-300 ease-in-out hover:shadow-md",
  {
    variants: {
      variant: {
        default: "border-slate-100 p-6",
        featured: "border-slate-200/60 flex-col md:flex-row",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BlogPostCardProps
  extends VariantProps<typeof cardVariants> {
  className?: string;
  tag: string;
  date: string;
  title: string;
  description: string;
  imageUrl?: string;
  href: string;
  readMoreText?: string;
}

const BlogPostCard = React.forwardRef<HTMLDivElement, BlogPostCardProps>(
  (
    {
      className,
      variant,
      tag,
      date,
      title,
      description,
      imageUrl,
      href,
      readMoreText = "자세히 보기",
    },
    ref
  ) => {
    const cardHover = {
      hover: {
        y: -4,
        transition: { duration: 0.2, ease: "easeInOut" as const },
      },
    };

    const content = (
      <>
        {variant === "featured" && (
          <div className="relative aspect-[16/9] w-full overflow-hidden md:w-1/2 lg:w-3/5">
            <Image
              src={imageUrl || "/blog-default-thumbnail.png"}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
          </div>
        )}

        <div className="flex flex-1 flex-col justify-between p-6 md:p-8">
          <div>
            <div className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase">
              <span className="rounded-full bg-primary-50 px-3 py-1 text-primary">
                {tag}
              </span>
              <span className="text-slate-400">{date}</span>
            </div>

            <h3 className="mb-3 text-xl font-bold leading-tight text-slate-900 lg:text-2xl">
              <span className="bg-gradient-to-r from-primary to-primary bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_2px]">
                {title}
              </span>
            </h3>

            <p className="text-[14px] leading-[1.7] text-slate-500">
              {description}
            </p>
          </div>

          {variant === "featured" && (
            <div className="mt-6">
              <span className="relative inline-flex items-center gap-2 overflow-hidden rounded-lg bg-slate-900 px-5 py-2.5 text-[13px] font-semibold text-white transition-all group-hover:gap-3">
                <span className="relative z-10 flex items-center gap-2">
                  {readMoreText}
                  <ArrowRight className="h-4 w-4" />
                </span>
                <span
                  className="absolute inset-0 animate-[light-sweep_3s_ease-in-out_infinite] opacity-40"
                  style={{
                    background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)",
                    backgroundSize: "200% 100%",
                  }}
                />
              </span>
            </div>
          )}
        </div>
      </>
    );

    const isPlaceholder = !href;

    return (
      <motion.div
        ref={ref}
        className={cn(cardVariants({ variant, className }))}
        variants={cardHover}
        whileHover="hover"
      >
        {!isPlaceholder && (
          <Link
            href={href}
            className="absolute inset-0 z-10"
            aria-label={title}
          >
            <span className="sr-only">{title}</span>
          </Link>
        )}
        <div className="relative z-0 flex h-full w-full flex-col md:flex-row">
          {content}
        </div>
      </motion.div>
    );
  }
);

BlogPostCard.displayName = "BlogPostCard";
export { BlogPostCard };
