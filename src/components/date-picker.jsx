"use client"

import * as React from "react"
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { TextField } from '@mui/material'

export function DatePickerSimple({ title, value, onChange }) {
    const handleDateChange = (newDate) => {
        if (!newDate) return;
        const year = newDate.getFullYear();
        const month = String(newDate.getMonth() + 1).padStart(2, '0');
        const day = String(newDate.getDate()).padStart(2, '0');
        const formatted = `${year}-${month}-${day}`;
        onChange({ target: { value: formatted } })
    }

    return (
        <DatePicker
            label={title}
            value={value ? new Date(value) : null}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} size="small" />}
        />
    )
}