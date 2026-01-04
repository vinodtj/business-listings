import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import Link from "next/link"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  href?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, href, ...props }, ref) => {
    if (asChild && href) {
      // When rendering as Link, only pass anchor-compatible props
      const linkProps: React.AnchorHTMLAttributes<HTMLAnchorElement> = {
        className: cn(buttonVariants({ variant, size, className })),
        ...(props.onClick && { onClick: props.onClick as any }),
        ...(props.onMouseEnter && { onMouseEnter: props.onMouseEnter as any }),
        ...(props.onMouseLeave && { onMouseLeave: props.onMouseLeave as any }),
        ...(props.id && { id: props.id }),
        ...(props['aria-label'] && { 'aria-label': props['aria-label'] }),
        ...(props.tabIndex !== undefined && { tabIndex: props.tabIndex }),
      }
      return (
        <Link
          href={href}
          {...linkProps}
        />
      )
    }
    
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref as any}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

