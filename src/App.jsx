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
import {
  Box,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Card,
  CardContent,
  Grid,
  Button as MuiButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'

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
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onChange={(event, checked) => table.toggleAllPageRowsSelected(!!checked)}
            sx={{
              color: 'text.secondary',
              '&.Mui-checked': {
                color: 'primary.main',
              },
              '&.MuiCheckbox-indeterminate': {
                color: 'primary.main',
              },
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
              }
            }}
          />
        </Box>
      ),
      cell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Checkbox
            checked={row.getIsSelected()}
            onChange={(event, checked) => row.toggleSelected(!!checked)}
            sx={{
              color: 'text.secondary',
              '&.Mui-checked': {
                color: 'primary.main',
              },
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
              }
            }}
          />
        </Box>
      ),
    },
    columnHelper.accessor('id', {
      header: 'ID',
      cell: (info) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            label={info.getValue()}
            size="small"
            variant="outlined"
            sx={{
              fontFamily: 'monospace',
              fontWeight: 'bold',
              color: 'text.secondary',
              borderColor: 'grey.300',
              backgroundColor: 'grey.50'
            }}
          />
          {errorIds.has(info.row.original.id) && (
            <AlertCircle sx={{ color: 'error.main' }} />
          )}
        </Box>
      ),
    }),
    columnHelper.accessor('aoc', {
      header: 'AOC',
      cell: (info) => (
        <Chip
          label={info.getValue()}
          color="primary"
          variant="filled"
          sx={{
            fontWeight: 'bold',
            textTransform: 'uppercase',
            fontSize: '0.75rem'
          }}
        />
      ),
    }),
    columnHelper.accessor('flightNumber', {
      header: 'FLIGHT NO.',
      cell: (info) => (
        <Typography variant="body2" fontWeight="bold" color="text.primary">
          {info.getValue()}
        </Typography>
      ),
    }),
    columnHelper.accessor((row) => ({ from: row.origin, to: row.destination }), {
      id: 'route',
      header: 'ROUTE',
      cell: (info) => {
        const { from, to } = info.getValue()
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, py: 1 }}>
            <Typography variant="body2" fontWeight="bold" fontFamily="monospace" color="text.primary">
              {from}
            </Typography>
            <Box sx={{ height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Plane sx={{ fontSize: 16, color: 'primary.main' }} />
            </Box>
            <Typography variant="body2" fontWeight="bold" fontFamily="monospace" color="text.primary">
              {to}
            </Typography>
          </Box>
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, py: 0.5 }}>
              <TextField
                type="time"
                value={tempEditData.std}
                onChange={(e) => updateTempEdit({ std: e.target.value })}
                size="small"
                sx={{ width: 96 }}
              />
              <TextField
                type="time"
                value={tempEditData.sta}
                onChange={(e) => updateTempEdit({ sta: e.target.value })}
                size="small"
                sx={{ width: 96 }}
              />
            </Box>
          )
        }
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Clock sx={{ fontSize: 14, color: 'success.main' }} />
              <Typography variant="body2" fontFamily="monospace" fontWeight="bold" color="text.primary">
                {row.original.std}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Clock sx={{ fontSize: 14, color: 'warning.main' }} />
              <Typography variant="body2" fontFamily="monospace" color="text.secondary" sx={{ mt: -0.25 }}>
                {row.original.sta}
              </Typography>
            </Box>
          </Box>
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, py: 0.5 }}>
              <DatePickerSimple title="Start Date" value={tempEditData.startDate} onChange={(e) => updateTempEdit({ startDate: e.target.value })} />
              <DatePickerSimple title="End Date" value={tempEditData.endDate} onChange={(e) => updateTempEdit({ endDate: e.target.value })} />
            </Box>
          )
        }
        const start = new Date(row.original.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
        const end = new Date(row.original.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Calendar sx={{ fontSize: 14, color: 'primary.main' }} />
            <Typography variant="body2" color="text.secondary" fontWeight="medium" sx={{ whiteSpace: 'nowrap' }}>
              {start} - {end}
            </Typography>
          </Box>
        )
      },
    }),
    columnHelper.accessor('bodyType', {
      header: 'BODY',
      cell: (info) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
          <Box sx={{
            width: 24,
            height: 20,
            border: '2px solid',
            borderColor: 'grey.300',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 0.25,
            opacity: 0.7
          }}>
            <Box sx={{
              width: '100%',
              height: '100%',
              backgroundColor: 'grey.400',
              borderRadius: 0.25,
              mx: 'auto'
            }} />
          </Box>
          <Typography variant="body2" color="text.secondary" fontWeight="medium" sx={{ textTransform: 'uppercase' }}>
            {info.getValue() === "narrow_body" ? "Narrow" : "Wide"}
          </Typography>
        </Box>
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
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <IconButton
                onClick={() => handleSave(row.original.id)}
                disabled={isSaving}
                color="success"
                size="small"
              >
                {isSaving ? <Loader2 /> : <Check />}
              </IconButton>
              <IconButton
                onClick={cancelEditing}
                disabled={isSaving}
                color="error"
                size="small"
              >
                <X />
              </IconButton>
            </Box>
          )
        }

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <IconButton
              onClick={() => startEditing(row.original)}
              color="primary"
              size="small"
            >
              <Pencil />
            </IconButton>
            <IconButton
              onClick={() => handleDeleteById(row.original.id)}
              color="error"
              size="small"
            >
              <Trash />
            </IconButton>
          </Box>
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
      <Box sx={{ p: 3 }}>
        <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)' }}>
          <CardContent sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center" gap={2}>
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="text.primary">
                    Flight Schedule Management
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manage and monitor your airline flight operations
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <TableFilters
          filters={state.filters}
          onFilterChange={handleFilterChange}
          onClear={handleClearFilters}
          aocOptions={aocOptions}
        />

        <Paper sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: 3 }}>
          <Box sx={{
            p: 3,
            borderBottom: 1,
            borderColor: 'divider',
            background: 'linear-gradient(90deg, #f8fafc 0%, #e2e8f0 100%)'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
              >
                <Box sx={{ p: 1, backgroundColor: 'white', borderRadius: 1, boxShadow: 1 }}>
                  <Database color="action" />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Flight Records
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {state.filteredData.length} flight{state.filteredData.length !== 1 ? 's' : ''} found
                  </Typography>
                </Box>
              </Box>

              <TextField
                placeholder="Search by flight no., origin, or destination..."
                value={state.filters.searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                size="small"
                sx={{ minWidth: 300 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                  endAdornment: state.filters.searchQuery && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => handleSearchChange("")}>
                        <X />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <div>
              {selectedCount > 0 && (
                <MuiButton
                  variant="outlined"
                  color="error"
                  startIcon={<Trash />}
                  onClick={handleDeleteSelected}
                >
                  Delete Selected ({selectedCount})
                </MuiButton>
              )}
              </div>
            </Box>
          </Box>

          <Box
            ref={tableContainerRef}
            sx={{
              overflow: 'auto',
              height: 650,
              background: 'linear-gradient(to bottom, white 0%, #f8fafc 100%)'
            }}
          >
            <Table>
              <TableHead sx={{
                position: 'sticky',
                top: 0,
                zIndex: 10,
                background: 'linear-gradient(90deg, #e2e8f0 0%, #f1f5f9 100%)',
                boxShadow: 2
              }}>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableCell
                        key={header.id}
                        sx={{
                          fontWeight: 'bold',
                          fontSize: '0.75rem',
                          color: 'text.secondary',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          borderBottom: '1px solid',
                          borderBottomColor: 'divider'
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody>
                {rowVirtualizer.getVirtualItems().length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} sx={{ textAlign: 'center', py: 8 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <Database sx={{ fontSize: 48, color: 'text.disabled' }} />
                        <Typography variant="h6" color="text.secondary">
                          No flights found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Try adjusting your filters
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const row = rows[virtualRow.index]
                    return (
                      <TableRow
                        key={row.id}
                        data-index={virtualRow.index}
                        ref={rowVirtualizer.measureElement}
                        sx={{
                          '&:hover': {
                            background: 'linear-gradient(90deg, rgba(25, 118, 210, 0.04) 0%, rgba(156, 39, 176, 0.04) 100%)',
                          },
                          transition: 'background-color 0.2s',
                          borderBottom: '1px solid',
                          borderBottomColor: 'divider',
                          height: `${virtualRow.size}px`,
                        }}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} sx={{ py: 2 }}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      </Box>
    </Layout>
  )
}

export default App