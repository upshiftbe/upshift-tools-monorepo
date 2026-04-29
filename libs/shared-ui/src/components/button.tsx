import * as React from "react";
import { cn } from "../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "dark";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius)] text-sm font-semibold ring-offset-background transition-[background-color,border-color,color,box-shadow,transform] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        {
          "bg-primary text-primary-foreground shadow-[var(--shadow-primary)] hover:bg-[var(--brand-accent-strong)] hover:shadow-[var(--shadow-primary-hover)] active:translate-y-px":
            variant === "default",
        },
        {
          "bg-foreground text-background shadow-sm hover:bg-foreground/90":
            variant === "dark",
        },
        {
          "bg-destructive text-destructive-foreground hover:bg-destructive/90":
            variant === "destructive",
        },
        {
          "border border-input bg-card hover:border-[var(--brand-accent-strong)]/40 hover:bg-accent hover:text-accent-foreground":
            variant === "outline",
        },
        {
          "bg-secondary text-secondary-foreground hover:bg-muted":
            variant === "secondary",
        },
        { "hover:bg-accent hover:text-accent-foreground": variant === "ghost" },
        {
          "text-primary underline-offset-4 hover:underline": variant === "link",
        },
        { "h-10 px-4 py-2": size === "default" },
        { "h-9 rounded-md px-3": size === "sm" },
        { "h-11 rounded-md px-8": size === "lg" },
        { "h-10 w-10": size === "icon" },
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Button.displayName = "Button";
export { Button };
