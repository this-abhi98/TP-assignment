import * as React from "react"
import {
  DayPicker,
  getDefaultClassNames,
} from "react-day-picker"

import { cn } from "@/lib/utils.js"
import { Button, buttonVariants } from "@/components/ui/button.jsx"
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from "lucide-react"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  locale,
  formatters,
  components,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "group/calendar bg-background p-3 [--cell-radius:var(--radius-md)] [--cell-size:--spacing(8)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString(locale?.code, { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 select-none aria-disabled:opacity-50",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 select-none aria-disabled:opacity-50",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative rounded-(--cell-radius)",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute inset-0 bg-popover opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "font-medium select-none",
          captionLayout === "label"
            ? "text-sm"
            : "flex items-center gap-1 rounded-(--cell-radius) text-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "flex-1 rounded-(--cell-radius) text-[0.8rem] font-normal text-muted-foreground select-none",
          defaultClassNames.weekday
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-(--cell-size) select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-[0.8rem] text-muted-foreground select-none",
          defaultClassNames.week_number
        ),
        days: cn("mt-2 flex w-full flex-col", defaultClassNames.days),
        day: cn(
          "relative flex flex-1 flex-col items-center justify-center rounded-(--cell-radius) p-0 text-sm select-none [&>button]:relative [&>button]:flex [&>button]:size-(--cell-size) [&>button]:items-center [&>button]:justify-center [&>button]:rounded-(--cell-radius) [&>button]:transition-colors [&>button]:outline-none [&>button]:ring-0 [&>button]:ring-inset [&>button]:focus-visible:ring-2 [&>button]:focus-visible:ring-ring [&>button]:focus-visible:ring-offset-2 [&>button]:disabled:pointer-events-none [&>button]:disabled:opacity-50 [&>button]:data-selected:bg-primary [&>button]:data-selected:text-primary-foreground [&>button]:data-selected:hover:bg-primary [&>button]:data-selected:hover:text-primary-foreground [&>button]:data-current:bg-primary [&>button]:data-current:text-primary-foreground [&>button]:data-range-start:bg-primary [&>button]:data-range-start:text-primary-foreground [&>button]:data-range-end:bg-primary [&>button]:data-range-end:text-primary-foreground [&>button]:data-range-middle:bg-muted [&>button]:data-range-middle:text-foreground [&>button]:data-today:text-primary [&>button]:data-today:font-bold [&>button]:data-disabled:text-muted-foreground [&>button]:data-disabled:opacity-30",
          defaultClassNames.day
        ),
        button: cn(
          "relative flex flex-1 flex-col items-center justify-center rounded-(--cell-radius) p-0 text-sm select-none outline-none ring-0 ring-inset focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          defaultClassNames.button
        ),
        button_content: cn(
          "relative z-10 flex size-(--cell-size) items-center justify-center rounded-(--cell-radius)",
          defaultClassNames.button_content
        ),
        range_start: cn(
          "rounded-s-(--cell-radius)",
          defaultClassNames.range_start
        ),
        range_end: cn(
          "rounded-e-(--cell-radius)",
          defaultClassNames.range_end
        ),
        selected: cn(
          "bg-primary text-primary-foreground",
          defaultClassNames.selected
        ),
        today: cn(
          "border-2 border-primary font-bold",
          defaultClassNames.today
        ),
        range_middle: cn(
          "rounded-none bg-muted",
          defaultClassNames.range_middle
        ),
        hidden: cn(
          "invisible",
          defaultClassNames.hidden
        ),
        nav_button: cn(
          "size-(--cell-size) p-0 select-none opacity-50 transition-colors hover:bg-transparent hover:text-foreground [&>svg]:size-4 [&>svg]:shrink-0",
          defaultClassNames.nav_button
        ),
        nav_button_previous: cn(
          "absolute left-1",
          defaultClassNames.nav_button_previous
        ),
        nav_button_next: cn(
          "absolute right-1",
          defaultClassNames.nav_button_next
        ),
        head: cn("flex w-full", defaultClassNames.head),
        head_row: cn("flex w-full", defaultClassNames.head_row),
        head_cell: cn(
          "flex-1 rounded-(--cell-radius) text-center text-xs font-normal text-muted-foreground [&>svg]:size-4 [&>svg]:shrink-0",
          defaultClassNames.head_cell
        ),
      }}
      components={{
        Chevron: ({ orientation }) => {
          const Icon = orientation === "left" ? ChevronLeftIcon : ChevronRightIcon
          return <Icon />
        },
        Arrow: () => <ChevronDownIcon className="size-4" />,
        ...components,
      }}
      {...props}
    />
  )
}

export { Calendar }