"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const BackgroundGradientAnimation = ({
  gradientBackgroundStart = "rgb(108, 0, 162)",
  gradientBackgroundEnd = "rgb(0, 17, 82)",
  firstColor = "99, 102, 241",
  secondColor = "168, 85, 247",
  thirdColor = "236, 72, 153",
  fourthColor = "59, 130, 246",
  fifthColor = "147, 51, 234",
  pointerColor = "140, 100, 255",
  size = "80%",
  blendingValue = "hard-light",
  children,
  className,
  interactive = true,
  containerClassName,
}: {
  gradientBackgroundStart?: string;
  gradientBackgroundEnd?: string;
  firstColor?: string;
  secondColor?: string;
  thirdColor?: string;
  fourthColor?: string;
  fifthColor?: string;
  pointerColor?: string;
  size?: string;
  blendingValue?: string;
  children?: React.ReactNode;
  className?: string;
  interactive?: boolean;
  containerClassName?: string;
}) => {
  return (
    <div
      className={cn(
        "h-screen w-screen relative overflow-hidden top-0 left-0 bg-[linear-gradient(40deg,var(--gradient-background-start),var(--gradient-background-end))]",
        containerClassName
      )}
      style={
        {
          "--gradient-background-start": gradientBackgroundStart,
          "--gradient-background-end": gradientBackgroundEnd,
          "--first-color": firstColor,
          "--second-color": secondColor,
          "--third-color": thirdColor,
          "--fourth-color": fourthColor,
          "--fifth-color": fifthColor,
          "--pointer-color": pointerColor,
          "--size": size,
          "--blending-value": blendingValue,
        } as React.CSSProperties
      }
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className={cn("h-full w-full relative", className)}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--first-color),0.8),rgba(var(--first-color),0))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(var(--second-color),0.8),rgba(var(--second-color),0))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(var(--third-color),0.8),rgba(var(--third-color),0))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_70%,rgba(var(--fourth-color),0.6),rgba(var(--fourth-color),0))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_60%,rgba(var(--fifth-color),0.6),rgba(var(--fifth-color),0))]" />
        {children}
      </motion.div>
    </div>
  );
};
