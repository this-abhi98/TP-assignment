import { Chip } from '@mui/material'

export const DayCircle = ({ active, label }) => (
  <Chip
    label={label}
    size="small"
    variant={active ? "filled" : "outlined"}
    color={active ? "primary" : "default"}
    sx={{
      width: 36,
      height: 36,
      borderRadius: '50%',
      fontWeight: 'bold',
      '& .MuiChip-label': {
        fontSize: '0.875rem'
      }
    }}
  />
)
