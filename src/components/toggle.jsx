import { Switch } from '@mui/material'

export const Toggle = ({ checked, onChange, disabled = false }) => (
  <Switch
    checked={checked}
    onChange={onChange}
    disabled={disabled}
    color="success"
  />
)