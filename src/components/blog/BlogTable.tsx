// components/BlogTable.tsx
import React, { useMemo, useState } from 'react'
import { flexRender, getCoreRowModel, useReactTable, ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { IconDotsVertical } from '@tabler/icons-react'
import { useRouter } from 'next/navigation' // add at the top

type Blog = {
  _id: string
  title: string
}

type Props = {
  data: Blog[] // full list of blogs
  onEdit: (blogId: string) => void
  onDelete: (blogId: string) => void
}

export default function BlogTable({ data, onEdit, onDelete }: Props) {
  const [page, setPage] = useState(0)
  const pageSize = 10

  /* ------- columns -------- */

  // Inside BlogTable
  const router = useRouter()

  const columns = useMemo<ColumnDef<Blog>[]>(
    () => [
      {
        accessorKey: 'title',
        header: () => 'Blog title',
        cell: ({ row }) => (
          <Button
            variant="link"
            className="p-0 text-left"
            onClick={() => router.push(`/blog/pre-view/${row.original._id}`)}
          >
            {row.original.title}
          </Button>
        ),
      },
      {
        id: 'actions',
        header: () => null,
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <IconDotsVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(row.original._id)}>Edit</DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(row.original._id)}
                className="text-destructive"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [onEdit, onDelete, router]
  )

  /* ------- pagination helpers -------- */
  const pagedData = useMemo(
    () => data.slice(page * pageSize, page * pageSize + pageSize),
    [data, page]
  )

  const table = useReactTable({
    data: pagedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(data.length / pageSize),
  })

  const totalPages = table.getPageCount()
  const canPrev = page > 0
  const canNext = page < totalPages - 1

  return (
    <div className="space-y-4">
      {/* table */}
      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id}>
                {hg.headers.map(h => (
                  <th key={h.id} className="px-4 py-2 text-left font-medium text-muted-foreground">
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="border-t">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}

            {/* empty state */}
            {pagedData.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-muted-foreground" colSpan={2}>
                  No blogs on this page.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* pagination buttons */}
      <div className="flex items-center justify-between">
        <p className="text-sm">
          Page {page + 1} of {totalPages}
        </p>

        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!canPrev}
            onClick={() => setPage(p => p - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!canNext}
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
