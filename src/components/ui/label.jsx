import * as React from "react"
import { Typography } from '@mui/material'

function Label({
  className,
  ...props
}) {
  return (
    <Typography
      component="label"
      variant="body2"
      className={className}
      {...props}
    />
  )
}

export { Label }