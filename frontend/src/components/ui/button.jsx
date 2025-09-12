import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";
import { cn } from "~/lib/utils"
import Loader from "./loader"; // <<< --- IMPORT THE LOADER

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        // --- IMPROVEMENT: Specific, themed styles ---
        default:
          "bg-blue-600 text-white shadow-md hover:bg-blue-700/90",
        destructive:
          "bg-red-600 text-white shadow-sm hover:bg-red-700/90",
        outline:
          "border border-slate-700 bg-transparent shadow-sm hover:bg-slate-800",
        secondary:
          "bg-slate-700 text-white shadow-sm hover:bg-slate-600/80",
        ghost: "hover:bg-slate-800",
        link: "text-blue-400 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// --- IMPROVEMENT: Added isLoading prop ---
const Button = React.forwardRef(({ className, variant, size, asChild = false, isLoading = false, children, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      disabled={isLoading} // Disable the button when loading
      {...props}
    >
      {/* Show loader if isLoading is true, otherwise show children */}
      {isLoading ? <Loader /> : children}
    </Comp>
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }