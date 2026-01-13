"use client";

import { cn } from "@/lib/utils";
import { useMotionValue, motion, useMotionTemplate } from "framer-motion";
import React from "react";

export const HoverBorderGradient = ({
  children,
  containerClassName,
  className,
  as: Tag = "button",
  duration = 1,
  clockwise = true,
  ...props
}: React.PropsWithChildren<
  {
    as?: React.ElementType;
    containerClassName?: string;
    className?: string;
    duration?: number;
    clockwise?: boolean;
  } & React.HTMLAttributes<HTMLElement>
>) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  return (
    <Tag
      onMouseMove={(e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top } = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - left);
        mouseY.set(e.clientY - top);
      }}
      className={cn(
        "relative flex rounded-full border border-slate-800 content-center bg-slate-900/80 hover:bg-slate-800/80 transition duration-500 items-center flex-col flex-nowrap gap-10 h-min justify-center overflow-visible p-px box-decoration-clone w-fit",
        containerClassName
      )}
      {...props}
    >
      <div
        className={cn(
          "w-auto text-white z-10 bg-slate-900 px-4 py-2 rounded-[inherit]",
          className
        )}
      >
        {children}
      </div>
      <motion.div
        className="flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit]"
        style={{
          filter: "blur(2px)",
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
      >
        <motion.div
          className="absolute -inset-full"
          style={{
            background: useMotionTemplate`
              radial-gradient(100px circle at ${mouseX}px ${mouseY}px, rgba(99, 102, 241, 0.8), transparent 80%)
            `,
          }}
        />
      </motion.div>
    </Tag>
  );
};
