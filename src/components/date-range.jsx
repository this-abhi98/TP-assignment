"use client"
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker'
import { TextField } from '@mui/material'

export function DatePickerWithRange({
    value,
    onChange
}) {
    return (
        <DateRangePicker
            value={[value?.from || null, value?.to || null]}
            onChange={(newValue) => {
                onChange({
                    from: newValue[0],
                    to: newValue[1]
                })
            }}
            renderInput={(startProps, endProps) => (
                <>
                    <TextField {...startProps} size="small" label="Start Date" />
                    <TextField {...endProps} size="small" label="End Date" />
                </>
            )}
        />
    )
}