"use client"

import { ColumnDef } from "@tanstack/react-table"

export type ClubWithPoints = {
  id: string
  name: string
  points: number
}

export const columns: ColumnDef<ClubWithPoints>[] = [
  {
    accessorKey: "index",
    header: "#",
    cell: ({ row }) => (
      <div className="h-8 w-8 rounded-full flex items-center justify-center">
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
    accessorKey: "points",
    header: () => <div className="text-center">Pontos</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.points}
      </div>
    ),
  },
]