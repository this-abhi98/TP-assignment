import * as React from "react"
import { Button as MuiButton } from '@mui/material'

function Button({
  className,
  variant = "contained",
  size = "medium",
  color = "primary",
  ...props
}) {
  // Map Tailwind variants to Material UI variants
  const muiVariant = variant === "outline" ? "outlined" :
                     variant === "ghost" || variant === "secondary" ? "text" :
                     variant === "destructive" ? "contained" : "contained"

  const muiColor = variant === "destructive" ? "error" : color

  return (
    <MuiButton
      variant={muiVariant}
      size={size}
      color={muiColor}
      className={className}
      {...props}
    />
  )
}

export { Button }