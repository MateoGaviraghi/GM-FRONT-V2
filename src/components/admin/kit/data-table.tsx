/**
 * DataTable — Soft SaaS (4R3). Genérica y tipada, misma API.
 * Wrapper tarjeta rounded-2xl shadow-sm, th gray-50 sentence case, celdas 15.5px,
 * paginación con texto (no solo flechas), loading = 8 filas skeleton, empty claro.
 */

import type { ReactNode } from "react";
import { ArrowDown, ArrowUp, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";
import { AdminButton } from "./admin-button";

export type DataTableColumn<T> = {
  key: string;
  header: string;
  width?: string;
  sortable?: boolean;
  render?: (row: T) => ReactNode;
  align?: "left" | "right";
};

export type DataTableSort = {
  key: string;
  dir: "asc" | "desc";
};

export type DataTablePagination = {
  page: number;
  totalPages: number;
  total: number;
  onPage: (page: number) => void;
};

export type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  loading?: boolean;
  emptyText?: string;
  sort?: DataTableSort;
  onSortChange?: (key: string) => void;
  toolbar?: ReactNode;
  pagination?: DataTablePagination;
  actions?: (row: T) => ReactNode;
  className?: string;
};

function cellValue<T>(row: T, column: DataTableColumn<T>): ReactNode {
  if (column.render) return column.render(row);
  const value = (row as Record<string, unknown>)[column.key];
  if (value == null) return <span className="text-gray-400">—</span>;
  return String(value);
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  loading,
  emptyText = "Sin resultados",
  sort,
  onSortChange,
  toolbar,
  pagination,
  actions,
  className,
}: DataTableProps<T>) {
  const colCount = columns.length + (actions ? 1 : 0);

  return (
    <div className={cn("overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm", className)}>
      {toolbar ? <div className="border-b border-gray-100 px-4 py-4">{toolbar}</div> : null}

      <div className="max-h-[640px] overflow-auto">
        <table className="w-full min-w-[640px] border-collapse text-[16px]">
          <thead>
            <tr className="sticky top-0 z-10 bg-gray-50">
              {columns.map((column) => {
                const isSorted = sort?.key === column.key;
                return (
                  <th
                    key={column.key}
                    style={{ width: column.width }}
                    className={cn(
                      "bg-gray-50 px-4 py-3 text-[13px] font-medium text-gray-400 whitespace-nowrap",
                      column.align === "right" ? "text-right" : "text-left"
                    )}
                  >
                    {column.sortable ? (
                      <button
                        type="button"
                        onClick={() => onSortChange?.(column.key)}
                        className={cn(
                          "inline-flex items-center gap-1.5 transition-colors duration-150 hover:text-gray-700",
                          isSorted && "text-gray-700"
                        )}
                      >
                        {column.header}
                        {isSorted ? (
                          sort?.dir === "asc" ? (
                            <ArrowUp className="size-4" strokeWidth={2} aria-hidden />
                          ) : (
                            <ArrowDown className="size-4" strokeWidth={2} aria-hidden />
                          )
                        ) : null}
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                );
              })}
              {actions ? (
                <th className="bg-gray-50 px-4 py-3 text-right text-[13px] font-medium text-gray-400 whitespace-nowrap">
                  Acciones
                </th>
              ) : null}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="h-14 border-t border-gray-100">
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3">
                      <Skeleton className="h-5 w-full max-w-40" />
                    </td>
                  ))}
                  {actions ? (
                    <td className="px-4 py-3">
                      <Skeleton className="ml-auto h-5 w-24" />
                    </td>
                  ) : null}
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={colCount} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Inbox className="size-8 text-gray-300" strokeWidth={1.5} aria-hidden />
                    <span className="text-[16px] text-gray-500">{emptyText}</span>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={rowKey(row)}
                  className="border-t border-gray-100 transition-colors duration-150 hover:bg-gray-50/70"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        "px-4 py-4 align-middle text-[15.5px] text-gray-700",
                        column.align === "right" ? "text-right" : "text-left"
                      )}
                    >
                      {cellValue(row, column)}
                    </td>
                  ))}
                  {actions ? (
                    <td className="px-4 py-4 text-right align-middle text-[15.5px] text-gray-700">
                      <div className="flex items-center justify-end gap-2">{actions(row)}</div>
                    </td>
                  ) : null}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination ? (
        <div className="flex items-center justify-between gap-4 border-t border-gray-100 px-4 py-3">
          <span className="text-[14px] text-gray-500">
            Página {pagination.page} de {pagination.totalPages} · Total: {pagination.total}
          </span>
          <div className="flex items-center gap-2">
            <AdminButton
              variant="secondary"
              className="h-10 rounded-lg border border-gray-200 bg-white px-4 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
              disabled={pagination.page <= 1}
              onClick={() => pagination.onPage(pagination.page - 1)}
            >
              Anterior
            </AdminButton>
            <AdminButton
              variant="secondary"
              className="h-10 rounded-lg border border-gray-200 bg-white px-4 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => pagination.onPage(pagination.page + 1)}
            >
              Siguiente
            </AdminButton>
          </div>
        </div>
      ) : null}
    </div>
  );
}
