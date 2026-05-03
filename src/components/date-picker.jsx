"use client"

import * as React from "react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button.jsx"
import { Calendar } from "@/components/ui/calendar.jsx"
import { Field, FieldLabel } from "@/components/ui/field.jsx"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover.jsx"

export function DatePickerSimple({ title, value, onChange }) {
    const [date, setDate] = React.useState(new Date(value))

    const onSelectHandle = (date) => {
        if (!date) return;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formatted = `${year}-${month}-${day}`;
        setDate(date)
        onChange({ target: { value: formatted } })
    }
    return (
        <Field className="mx-auto w-24">
            <FieldLabel htmlFor="date-picker-simple">{title}</FieldLabel>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        id="date-picker-simple"
                        className="justify-start font-normal hover:cursor-pointer"
                    >
                        {date ? format(date, "P") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={new Date(value)}
                        onSelect={onSelectHandle}
                        defaultMonth={new Date(value)}
                    />
                </PopoverContent>
            </Popover>
        </Field>
    )
}