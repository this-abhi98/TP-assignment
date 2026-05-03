import Layout from "./layouts/layout.jsx"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useRef, useMemo } from "react"
import { Loader2, Check, X, AlertCircle, Pencil, ChevronDown, Trash, Search, Plane, Clock, Calendar, Database } from "lucide-react"
import { useVirtualizer } from "@tanstack/react-virtual"
import { Checkbox } from "./components/ui/checkbox.jsx"
import { DatePickerSimple } from "./components/date-picker.jsx"
import { Toggle } from "./components/toggle.jsx"
import { DayCircle } from "./components/day-circle.jsx"
import { TableFilters } from "./components/table-filters.jsx"
import { useFlightSchedules } from "./hooks/useFlightsSchedules.js"

const columnHelper = createColumnHelper()

function App() {
  const {
    state,
    tempEditData,
    rowSelection,
    savingIds,
    errorIds,
    aocOptions,
    selectedCount,
    setRowSelection,
    handleFilterChange,
    handleClearFilters,
    handleSearchChange,
    startEditing,
    cancelEditing,
    updateTempEdit,
    handleSave,
    handleDeleteById,
    handleDeleteSelected,
    handleToggleStatus,
  } = useFlightSchedules()

  const columns = useMemo(() => [
    {
      id: 'select',
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            className="border-slate-300 hover-lift"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            className="border-slate-300 hover-lift"
          />
        </div>
      ),
    },
    columnHelper.accessor('id', {
      header: 'ID',
      cell: (info) => (
        <div className="flex items-center gap-2 group">
          <div className="bg-gradient-to-r from-slate-100 to-slate-200 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-600 text-center w-fit shadow-soft transition-all group-hover:shadow-medium group-hover:scale-105">
            {info.getValue()}
          </div>
          {errorIds.has(info.row.original.id) && (
            <div className="flex items-center text-red-500 animate-pulse">
              <AlertCircle className="w-4 h-4" />
            </div>
          )}
        </div>
      ),
    }),
    columnHelper.accessor('aoc', {
      header: 'AOC',
      cell: (info) => (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-blue-700 uppercase tracking-tight shadow-soft">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('flightNumber', {
      header: 'FLIGHT NO.',
      cell: (info) => <span className="font-bold text-slate-800 tracking-tight text-sm">{info.getValue()}</span>,
    }),
    columnHelper.accessor((row) => ({ from: row.origin, to: row.destination }), {
      id: 'route',
      header: 'ROUTE',
      cell: (info) => {
        const { from, to } = info.getValue()
        return (
          <div className="flex flex-col items-center gap-1 leading-tight py-2">
            <span className="text-sm font-bold text-slate-800 tracking-wider font-mono">{from}</span>
            <div className="h-5 flex items-center justify-center">
              <Plane className="w-4 h-4 text-blue-500" />
            </div>
            <span className="text-sm font-bold text-slate-800 tracking-wider font-mono">{to}</span>
          </div>
        )
      },
    }),
    columnHelper.display({
      id: 'std_sta',
      header: 'STD / STA',
      cell: ({ row }) => {
        const isEditing = state.editingId === row.original.id;
        if (isEditing && tempEditData) {
          return (
            <div className="flex flex-col gap-2 py-1">
              <input
                type="time"
                value={tempEditData.std}
                onChange={(e) => updateTempEdit({ std: e.target.value })}
                className="text-sm hover:cursor-pointer font-mono border border-slate-200 rounded-lg px-2 py-1.5 w-24 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-8 shadow-soft transition-all hover:shadow-medium"
              />
              <input
                type="time"
                value={tempEditData.sta}
                onChange={(e) => updateTempEdit({ sta: e.target.value })}
                className="text-sm hover:cursor-pointer font-mono border border-slate-200 rounded-lg px-2 py-1.5 w-24 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-8 shadow-soft transition-all hover:shadow-medium"
              />
            </div>
          )
        }
        return (
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-green-600" />
              <span className="font-mono font-bold text-slate-800 text-sm whitespace-nowrap">{row.original.std}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-orange-600" />
              <span className="font-mono text-slate-500 text-xs -mt-0.5 whitespace-nowrap">{row.original.sta}</span>
            </div>
          </div>
        )
      },
    }),
    columnHelper.accessor('daysOfOperation', {
      header: 'SCHEDULE',
      cell: (info) => {
        const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
        const schedule = info.getValue()
        return (
          <div className="flex gap-1">
            {days.map((day, i) => (
              <DayCircle key={i} label={day} active={schedule.includes(i + 1)} />
            ))}
          </div>
        )
      },
    }),
    columnHelper.display({
      id: 'validity',
      header: 'VALIDITY',
      cell: ({ row }) => {
        const isEditing = state.editingId === row.original.id;
        if (isEditing && tempEditData) {
          return (
            <div className="flex flex-col gap-2 py-1">
              <DatePickerSimple title="Start Date" value={tempEditData.startDate} onChange={(e) => updateTempEdit({ startDate: e.target.value })} />
              <DatePickerSimple title="End Date" value={tempEditData.endDate} onChange={(e) => updateTempEdit({ endDate: e.target.value })} />
            </div>
          )
        }
        const start = new Date(row.original.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
        const end = new Date(row.original.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
        return (
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-slate-600 text-xs whitespace-nowrap font-medium">{start} - {end}</span>
          </div>
        )
      },
    }),
    columnHelper.accessor('bodyType', {
      header: 'BODY',
      cell: (info) => (
        <div className="flex items-center gap-2 text-slate-600 text-xs font-medium uppercase">
          <div className="w-6 h-5 border-2 border-slate-300 rounded-md flex items-center justify-center p-0.5 opacity-70">
            <div className="w-1 h-full bg-slate-400 mx-auto rounded-sm" />
          </div>
          <span className="text-slate-600">{info.getValue() === "narrow_body" ? "Narrow" : "Wide"}</span>
        </div>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'STATUS',
      cell: ({ row }) => {
        const isEditing = state.editingId === row.original.id;
        const currentStatus = isEditing && tempEditData ? tempEditData.status : row.original.status;
        return (
          <Toggle
            checked={currentStatus === "Active"}
            disabled={savingIds.has(row.original.id)}
            onChange={() => {
              if (isEditing && tempEditData) {
                updateTempEdit({ status: tempEditData.status === "Active" ? "Inactive" : "Active" });
              } else {
                handleToggleStatus(row.original.id);
              }
            }}
          />
        )
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'ACTIONS',
      cell: ({ row }) => {
        const isEditing = state.editingId === row.original.id;
        const isSaving = savingIds.has(row.original.id);

        if (isEditing) {
          return (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => handleSave(row.original.id)}
                disabled={isSaving}
                className="p-2 rounded-lg hover:bg-green-50 text-green-600 disabled:opacity-50 transition-all hover-lift shadow-soft"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              </button>
              <button
                onClick={cancelEditing}
                disabled={isSaving}
                className="p-2 rounded-lg hover:bg-red-50 text-red-500 disabled:opacity-50 transition-all hover-lift shadow-soft"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )
        }

        return (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => startEditing(row.original)}
              className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-all hover-lift shadow-soft"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDeleteById(row.original.id)}
              className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-all hover-lift shadow-soft"
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>
        )
      },
    }),
  ], [state.editingId, tempEditData, savingIds, errorIds, handleSave, cancelEditing, updateTempEdit, handleToggleStatus, startEditing, handleDeleteById])

  const table = useReactTable({
    data: state.filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  })

  const tableContainerRef = useRef(null)
  const { rows } = table.getRowModel()
  
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 52,
    overscan: 10,
  })

  return (
    <Layout>
      <div className="flex flex-col gap-6 p-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 border border-blue-100 shadow-soft animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-primary rounded-xl shadow-medium">
                <Database className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800 mb-1">Flight Schedule Management</h1>
                <p className="text-slate-600">Manage and monitor your airline flight operations</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Plane className="w-4 h-4 text-blue-500" />
                <span className="font-medium">{state.filteredData.length} Total Flights</span>
              </div>
              {selectedCount > 0 && (
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg">
                  <span className="font-medium">{selectedCount} Selected</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center bg-white p-4 min-h-16 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800">Flight Schedules</h2>

            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by flight no., origin, or destination…"
                value={state.filters.searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              />
              {state.filters.searchQuery && (
                <button onClick={() => handleSearchChange("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {selectedCount > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="flex items-center gap-2 px-4 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-semibold border border-red-200"
              >
                <Trash className="w-4 h-4" />
                Delete Selected ({selectedCount})
              </button>
            )}
          </div>

        <TableFilters
          filters={state.filters}
          onFilterChange={handleFilterChange}
          onClear={handleClearFilters}
          aocOptions={aocOptions}
        />

        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-medium animate-slide-up">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-50 to-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-soft">
                <Database className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <span className="text-lg font-semibold text-slate-800">
                  Flight Records
                </span>
                <p className="text-sm text-slate-500 mt-0.5">
                  {state.filteredData.length} flight{state.filteredData.length !== 1 ? 's' : ''} found
                </p>
              </div>
            </div>
            {selectedCount > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all hover-lift shadow-soft border border-red-200"
              >
                Delete Selected ({selectedCount})
              </button>
            )}
          </div>

          <div 
            ref={tableContainerRef}
            className="overflow-auto bg-gradient-to-b from-white to-slate-50/30"
            style={{ height: '650px' }}
          >
            <table className="w-full">
              <thead className="sticky top-0 z-10 bg-gradient-to-r from-slate-100 to-slate-200 shadow-medium">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200/50"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rowVirtualizer.getVirtualItems().length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-16 text-slate-500">
                      <div className="flex flex-col items-center gap-3">
                        <Database className="w-12 h-12 text-slate-300" />
                        <span className="text-lg font-medium">No flights found</span>
                        <span className="text-sm">Try adjusting your filters</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const row = rows[virtualRow.index]
                    return (
                      <tr
                        key={row.id}
                        data-index={virtualRow.index}
                        ref={rowVirtualizer.measureElement}
                        className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200 border-b border-slate-100/50 group"
                        style={{
                          height: `${virtualRow.size}px`,
                        }}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="px-6 py-4 group-hover:bg-white/50 transition-colors">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default App