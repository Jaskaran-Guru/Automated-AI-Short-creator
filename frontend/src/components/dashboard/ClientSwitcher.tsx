"use client"

import * as React from "react"
import { Check, ChevronsUpDown, PlusCircle, Users } from "lucide-react"
import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover"
import { useRouter, useSearchParams, usePathname } from "next/navigation"

interface Client {
  id: string
  name: string
  logoUrl?: string | null
}

interface ClientSwitcherProps {
  clients: Client[]
}

export function ClientSwitcher({ clients }: ClientSwitcherProps) {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  
  const activeClientId = searchParams.get("clientId")
  const activeClient = clients.find((c) => c.id === activeClientId) || clients[0]

  const onClientSelect = (clientId: string) => {
    setOpen(false)
    const params = new URLSearchParams(searchParams.toString())
    params.set("clientId", clientId)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a client"
          className="w-[240px] justify-between bg-slate-900/50 border-slate-800 rounded-xl h-12 hover:bg-slate-800 transition-all px-4"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shrink-0">
                {activeClient?.logoUrl ? (
                    <img src={activeClient.logoUrl} className="w-full h-full object-cover rounded-md" />
                ) : (
                    <Users className="w-3.5 h-3.5 text-blue-500" />
                )}
            </div>
            <span className="truncate font-bold text-white text-sm">
                {activeClient?.name || "Select Client"}
            </span>
          </div>
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50 text-slate-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0 bg-slate-900 border-slate-800 rounded-2xl overflow-hidden shadow-2xl shadow-black">
        <Command className="bg-transparent">
          <CommandList>
            <CommandInput placeholder="Search clients..." className="h-12 border-none focus:ring-0" />
            <CommandEmpty>No client found.</CommandEmpty>
            <CommandGroup heading="Managed Clients">
              {clients.map((client) => (
                <CommandItem
                  key={client.id}
                  onSelect={() => onClientSelect(client.id)}
                  className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-white/5 aria-selected:bg-white/5"
                >
                  <div className="w-6 h-6 rounded-md bg-slate-800 flex items-center justify-center border border-white/5">
                    <Users className="w-3 h-3 text-slate-500" />
                  </div>
                  <span className="flex-1 truncate text-slate-300 font-medium">
                    {client.name}
                  </span>
                  <Check
                    className={cn(
                      "h-4 w-4 text-blue-500",
                      activeClientId === client.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator className="bg-slate-800" />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                  router.push("/dashboard/clients/new")
                }}
                className="flex items-center gap-2 px-3 py-3 cursor-pointer text-blue-400 hover:text-blue-300 hover:bg-blue-500/5"
              >
                <PlusCircle className="h-4 w-4" />
                <span className="font-bold text-xs uppercase tracking-widest">Add New Client</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
