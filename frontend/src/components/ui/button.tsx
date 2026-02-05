import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-black text-lg transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border-4 border-black shadow-[6px_6px_0px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#000000]",
  {
    variants: {
      variant: {
        default: "bg-yellow-400 text-black hover:bg-yellow-500 rounded-full",
        destructive:
          "bg-red-400 text-black hover:bg-red-500 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 rounded-full",
        outline:
          "border-4 border-black bg-white text-black hover:bg-gray-100 rounded-full",
        secondary:
          "bg-purple-400 text-black hover:bg-purple-500 rounded-full",
        ghost:
          "border-none shadow-none hover:translate-x-0 hover:translate-y-0 hover:shadow-none bg-transparent text-black hover:bg-gray-100 rounded-full",
        link: "border-none shadow-none hover:translate-x-0 hover:translate-y-0 hover:shadow-none text-black underline-offset-4 hover:underline rounded-none",
      },
      size: {
        default: "h-12 px-6 py-3 has-[>svg]:px-5",
        xs: "h-8 gap-1 px-3 text-sm has-[>svg]:px-2.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-10 gap-1.5 px-4 text-base has-[>svg]:px-3.5",
        lg: "h-14 px-8 py-4 text-xl has-[>svg]:px-6",
        icon: "size-12",
        "icon-xs": "size-8 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-10",
        "icon-lg": "size-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }