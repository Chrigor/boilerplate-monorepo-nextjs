"use client";

import { cn } from "../../lib/utils";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className, ...props}: ButtonProps) {
  return <button className={cn('bg-amber-400 p-2 rounded-sm cursor-pointer hover:brightness-90 transition-all', className)} {...props} />;
}

Button.displayName = "Button";
