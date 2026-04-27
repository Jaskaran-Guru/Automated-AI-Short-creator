import * as React from "react"
export const Command = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => <div ref={ref} {...props} />)
export const CommandInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => <input ref={ref} {...props} />)
export const CommandList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => <div ref={ref} {...props} />)
export const CommandEmpty = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => <div ref={ref} {...props} />)
export const CommandGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { heading?: string }>(({ heading, ...props }, ref) => <div ref={ref} {...props} />)
export const CommandItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { onSelect?: () => void }>(({ onSelect, ...props }, ref) => <div ref={ref} onClick={onSelect} {...props} />)
export const CommandSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => <div ref={ref} {...props} />)
