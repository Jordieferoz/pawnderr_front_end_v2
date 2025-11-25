"use client";

import { cn } from "@/lib/utils";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import * as React from "react";

export function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  );
}

export function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        `aspect-square size-5 shrink-0 rounded-full border border-black/20 transition-all duration-200 outline-none data-[state=checked]:border-[3px] data-[state=checked]:border-[#FFC632] focus-visible:ring-[3px] focus-visible:ring-[#FFC632]/40 disabled:cursor-not-allowed disabled:opacity-50`,
        className
      )}
      {...props}
    />
  );
}
