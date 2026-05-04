import Layout from "./layout/layout.jsx"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useRef, useMemo } from "react"
import { Check, X, AlertCircle, Pencil, Trash, Search, Database } from "lucide-react"
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
  Button as MuiButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
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
          color="grey"
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
        <Typography variant="body2" sx={{ fontWeight: 'bold' }} color="text.primary">
          {info.getValue()}
        </Typography>
      ),
    }),
    columnHelper.accessor((row) => ({ from: row.origin, to: row.destination }), {
      id: 'route',
      header: 'ORGIN/DEST',
      cell: (info) => {
        const { from, to } = info.getValue()
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, py: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', fontFamily: 'monospace' }} color="text.primary">
              {from}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', fontFamily: 'monospace' }} color="text.primary">
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, py: 0.5, minWidth: 0, maxWidth: 150 }}>
              <TextField
                type="time"
                value={tempEditData.std}
                onChange={(e) => updateTempEdit({ std: e.target.value })}
                size="small"
                sx={{ width: '100%', maxWidth: 96 }}
              />
              <TextField
                type="time"
                value={tempEditData.sta}
                onChange={(e) => updateTempEdit({ sta: e.target.value })}
                size="small"
                sx={{ width: '100%', maxWidth: 96 }}
              />
            </Box>
          )
        }
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }} color="text.primary">
              {row.original.std}
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold', mt: -0.25 }} color="text.secondary">
              {row.original.sta}
            </Typography>
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
          <Box sx={{ display: 'flex', gap: 1 }}>
            {days.map((day, i) => (
              <DayCircle key={i} label={day} active={schedule.includes(i + 1)} />
            ))}
          </Box>
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, py: 0.5, minWidth: 0, maxWidth: 148 }}>
              <DatePickerSimple title="Start Date" value={tempEditData.startDate} onChange={(e) => updateTempEdit({ startDate: e.target.value })} />
              <DatePickerSimple title="End Date" value={tempEditData.endDate} onChange={(e) => updateTempEdit({ endDate: e.target.value })} />
            </Box>
          )
        }
        const start = new Date(row.original.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
        const end = new Date(row.original.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
        return (
          <Typography variant="body2" sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} color="text.secondary">
            {start} - {end}
          </Typography>
        )
      },
    }),
    columnHelper.accessor('bodyType', {
      header: 'BODY',
      cell: (info) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }} color="text.secondary">
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
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, minWidth: 100 }}>
              <IconButton
                onClick={() => handleSave(row.original.id)}
                disabled={isSaving}
                color="success"
                size="small"
              >
                {isSaving ? <CircularProgress size={20} color="inherit" /> : <Check />}
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, minWidth: 80 }}>
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

  const virtualRows = rowVirtualizer.getVirtualItems()
  const totalSize = rowVirtualizer.getTotalSize()

  return (
    <Layout>
      <Box sx={{
        minHeight: '100vh',
        
        background: 'linear-gradient(180deg, #f7faff 0%, #eef4ff 100%)'
      }}>
  
        <Typography variant="h4" fontWeight="bold" color="text.primary" sx={{ mb: 1, fontSize: { xs: '1.8rem', md: '2rem' } }}>
                    Flight Schedule Management
                  </Typography>

        <TableFilters
          filters={state.filters}
          onFilterChange={handleFilterChange}
          onClear={handleClearFilters}
          aocOptions={aocOptions}
        />

        <Paper sx={{ borderRadius: '14px', overflow: 'hidden', boxShadow: '0 14px 32px rgba(15, 23, 42, 0.05)' }}>
          <Box sx={{
            p: 3,
            borderBottom: '1px solid',
            borderColor: 'divider',
            background: '#f7f9ff'
          }}>
            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'stretch', md: 'center' },
              justifyContent: 'space-between',
              gap: 3
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Flight Records
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {state.filteredData.length} flight{state.filteredData.length !== 1 ? 's' : ''} found
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, width: { xs: '100%', md: 'auto' } }}>
                <TextField
                  placeholder="Search by flight no., origin, or destination..."
                  value={state.filters.searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  size="small"
                  sx={{ width: { xs: '100%', sm: 320 }, backgroundColor: 'white', borderRadius: '12px' }}
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

                {selectedCount > 0 && (
                  <MuiButton
                    variant="contained"
                    color="error"
                    startIcon={<Trash />}
                    onClick={handleDeleteSelected}
                    sx={{ minWidth: 210, borderRadius: '12px' }}
                  >
                    Delete Selected ({selectedCount})
                  </MuiButton>
                )}
              </Box>
            </Box>
          </Box>

          <TableContainer
            component={Box}
            ref={tableContainerRef}
            sx={{
              maxHeight: 650,
              overflowY: 'auto',
              overflowX: 'hidden',
              background: 'linear-gradient(to bottom, white 0%, #f8fafc 100%)',
              scrollBehavior: 'smooth',
              minWidth: 0,
            }}
          >
            <Table stickyHeader sx={{ minWidth: 0 }}>
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
                          fontWeight: 800,
                          fontSize: '0.72rem',
                          color: 'text.secondary',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          borderBottom: '1px solid',
                          borderBottomColor: 'divider',
                          backgroundColor: '#f7f9ff'
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
                {virtualRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} sx={{ textAlign: 'center', py: 8 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <Database sx={{ fontSize: 48, color: 'text.disabled' }} />
                        <Typography variant="h6" color="text.secondary">
                          No flights found
                        </Typography>
                        
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  (() => {
                    const paddingTop = virtualRows.length ? virtualRows[0].start : 0
                    const lastRow = virtualRows[virtualRows.length - 1]
                    const paddingBottom = virtualRows.length
                      ? totalSize - (lastRow.start + lastRow.size)
                      : 0

                    return (
                      <>
                        {paddingTop > 0 && (
                          <TableRow sx={{ height: `${paddingTop}px` }}>
                            <TableCell colSpan={columns.length} sx={{ p: 0, borderBottom: 'none' }} />
                          </TableRow>
                        )}

                        {virtualRows.map((virtualRow) => {
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
                                backgroundColor: savingIds.has(row.original.id) 
                                  ? 'rgba(76, 175, 80, 0.08)' 
                                  : errorIds.has(row.original.id) 
                                  ? 'rgba(244, 67, 54, 0.08)' 
                                  : 'transparent',
                              }}
                            >
                              {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id} sx={{ py: 2 }}>
                                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                              ))}
                            </TableRow>
                          )
                        })}

                        {paddingBottom > 0 && (
                          <TableRow sx={{ height: `${paddingBottom}px` }}>
                            <TableCell colSpan={columns.length} sx={{ p: 0, borderBottom: 'none' }} />
                          </TableRow>
                        )}
                      </>
                    )
                  })()
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Layout>
  )
}

export default App