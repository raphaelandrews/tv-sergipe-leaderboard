"use client"

import type { ColumnDef } from "@tanstack/react-table"

export type ClubWithMedals = {
  id: string
  name: string
  medals: {
    gold: number
    silver: number
    bronze: number
  }
}

export const columns: ColumnDef<ClubWithMedals>[] = [
  {
    accessorKey: "index",
    header: "#",
    cell: ({ row }) => (
      <div>
        {row.index + 1}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => (
      <span className="font-semibold text-nowrap">{row.getValue("name")}</span>
    ),
  },
  {
    accessorKey: "medals.gold",
    header: () => <div className="text-center">Ouro</div>,
    cell: ({ row }) => (
      <div className="rounded-sm text-center">
        {row.original.medals.gold}
      </div>
    ),
  },
  {
    accessorKey: "medals.silver",
    header: () => <div className="text-center">Prata</div>,
    cell: ({ row }) => (
      <div className="rounded-sm text-center">
        {row.original.medals.silver}
      </div>
    ),
  },
  {
    accessorKey: "medals.bronze",
    header: () => <div className="text-center">Bronze</div>,
    cell: ({ row }) => (
      <div className="rounded-sm text-center">
        {row.original.medals.bronze}
      </div>
    ),
  },
]