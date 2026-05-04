import { createColumnHelper } from '@tanstack/react-table'
import { useMemo } from "react"
import { Check, X, AlertCircle, Pencil, Trash } from "lucide-react"
import { Checkbox } from "./ui/checkbox.jsx"
import { DatePickerSimple } from "./date-picker.jsx"
import { Toggle } from "./toggle.jsx"
import { DayCircle } from "./day-circle.jsx"
import {
  Box,
  Typography,
  TextField,
  Chip,
  IconButton,
  CircularProgress,
} from '@mui/material'

const columnHelper = createColumnHelper()

export function useTableColumns(state, tempEditData, savingIds, errorIds, handleSave, cancelEditing, updateTempEdit, handleToggleStatus, startEditing, handleDeleteById) {
  return useMemo(() => [
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
}