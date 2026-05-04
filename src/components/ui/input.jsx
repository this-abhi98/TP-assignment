import * as React from "react"
import { TextField } from '@mui/material'

function Input({ className, type = "text", ...props }) {
  return (
    <TextField
      type={type}
      variant="outlined"
      size="small"
      className={className}
      {...props}
    />
  )
}

export { Input }