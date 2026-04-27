import * as React from "react"
export const Popover = ({ children, open, onOpenChange }: { children: React.ReactNode, open?: boolean, onOpenChange?: (open: boolean) => void }) => <div>{children}</div>
export const PopoverTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }>(({ asChild, ...props }, ref) => <button ref={ref} {...props} />)
export const PopoverContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => <div ref={ref} {...props} />)
