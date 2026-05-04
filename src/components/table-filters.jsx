import { DatePickerWithRange } from "./date-range.jsx";
import { RotateCcw } from "lucide-react";
import { Button } from "./ui/button.jsx";
import {
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button as MuiButton,
  IconButton,
  Typography
} from '@mui/material'

export function TableFilters({ filters, onFilterChange, onClear, aocOptions }) {
    const days = [
        { label: "Mon", value: 1 },
        { label: "Tue", value: 2 },
        { label: "Wed", value: 3 },
        { label: "Thu", value: 4 },
        { label: "Fri", value: 5 },
        { label: "Sat", value: 6 },
        { label: "Sun", value: 7 },
    ];

    const formatDate = (date) => {
        if (!date) return null;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleDateChange = (range) => {
        onFilterChange({
            dateRange: {
                from: formatDate(range?.from),
                to: formatDate(range?.to),
            }
        });
    };

    const toggleDay = (day) => {
        const nextDays = filters.days.includes(day)
            ? filters.days.filter((d) => d !== day)
            : [...filters.days, day];
        onFilterChange({ days: nextDays });
    };

    return (
        <Paper sx={{display:'flex',gap:'4px', p: 3, mb: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 3 }}>
                <DatePickerWithRange
                    value={{
                        from: filters.dateRange.from ? new Date(filters.dateRange.from) : undefined,
                        to: filters.dateRange.to ? new Date(filters.dateRange.to) : undefined
                    }}
                    onChange={handleDateChange}
                />

                <FormControl sx={{ minWidth: 200 }}>
                    <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                        Days of Operation
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                        {days.map((d) => (
                            <Chip
                                key={d.value}
                                label={d.label[0]}
                                size="small"
                                variant={filters.days.includes(d.value) ? "filled" : "outlined"}
                                color={filters.days.includes(d.value) ? "primary" : "default"}
                                onClick={() => toggleDay(d.value)}
                                sx={{ cursor: 'pointer', width: 36, height: 36 }}
                            />
                        ))}
                    </Box>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={filters.status}
                        label="Status"
                        onChange={(e) => onFilterChange({ status: e.target.value })}
                    >
                        <MenuItem value="all">All Statuses</MenuItem>
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>AOC</InputLabel>
                    <Select
                        value={filters.aoc}
                        label="AOC"
                        onChange={(e) => onFilterChange({ aoc: e.target.value })}
                    >
                        <MenuItem value="all">All AOCs</MenuItem>
                        {aocOptions.map((aoc) => (
                            <MenuItem key={aoc} value={aoc}>
                                {aoc}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel>Body Type</InputLabel>
                    <Select
                        value={filters.bodyType}
                        label="Body Type"
                        onChange={(e) => onFilterChange({ bodyType: e.target.value })}
                    >
                        <MenuItem value="all">All Body Types</MenuItem>
                        <MenuItem value="narrow_body">Narrow Body</MenuItem>
                        <MenuItem value="wide_body">Wide Body</MenuItem>
                    </Select>
                </FormControl>

                <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
                    <MuiButton
                        variant="outlined"
                        startIcon={<RotateCcw />}
                        onClick={onClear}
                        color="inherit"
                    >
                        Clear All
                    </MuiButton>
                </Box>
            </Box>
        </Paper>
    );
}