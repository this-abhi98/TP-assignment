import * as React from "react"
import { Checkbox as MuiCheckbox } from '@mui/material'

function Checkbox({
  className,
  ...props
}) {
  return (
    <MuiCheckbox
      className={className}
      {...props}
    />
  )
}

export { Checkbox }