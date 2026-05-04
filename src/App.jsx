import Layout from "./components/layouts/layout.jsx"
import { Search, X, Trash } from "lucide-react"
import { TableFilters } from "./components/table/TableFilters.jsx"
import { FlightTable } from "./components/table/FlightTable.jsx"
import { useFlightSchedules } from "./hooks/useFlightSchedules.js"
import {
  Box,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Button as MuiButton,
} from '@mui/material'

function App() {
  const {
    state,
    tempEditData,
    rowSelection,
    savingIds,
    errorIds,
    aocOptions,
    selectedCount,
    setRowSelection,
    handleFilterChange,
    handleClearFilters,
    handleSearchChange,
    startEditing,
    cancelEditing,
    updateTempEdit,
    handleSave,
    handleDeleteById,
    handleDeleteSelected,
    handleToggleStatus,
  } = useFlightSchedules()





  return (
    <Layout>
      <Box sx={{
        minHeight: '100vh',
        
        background: 'linear-gradient(180deg, #f7faff 0%, #eef4ff 100%)'
      }}>
  
        <Typography variant="h4" fontWeight="bold" color="text.primary" sx={{ mb: 1, fontSize: { xs: '1.8rem', md: '2rem' } }}>
                    Flight Schedule Management
                  </Typography>

        <TableFilters
          filters={state.filters}
          onFilterChange={handleFilterChange}
          onClear={handleClearFilters}
          aocOptions={aocOptions}
        />

        <Paper sx={{ borderRadius: '14px', overflow: 'hidden', boxShadow: '0 14px 32px rgba(15, 23, 42, 0.05)', mb: 3 }}>
          <Box sx={{ p: 3, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'stretch', md: 'center' }, justifyContent: 'space-between', gap: 3 }}>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Flight Records
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {state.filteredData.length} flight{state.filteredData.length !== 1 ? 's' : ''} found
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, width: { xs: '100%', md: 'auto' } }}>
              <TextField
                placeholder="Search by flight no., origin, or destination..."
                value={state.filters.searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                size="small"
                sx={{ width: { xs: '100%', sm: 320 }, backgroundColor: 'white', borderRadius: '12px' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                  endAdornment: state.filters.searchQuery && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => handleSearchChange("")}>
                        <X />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {selectedCount > 0 && (
                <MuiButton
                  variant="contained"
                  color="error"
                  startIcon={<Trash />}
                  onClick={handleDeleteSelected}
                  sx={{ minWidth: 210, borderRadius: '12px' }}
                >
                  Delete Selected ({selectedCount})
                </MuiButton>
              )}
            </Box>
          </Box>
        </Paper>

        <FlightTable
          state={state}
          tempEditData={tempEditData}
          rowSelection={rowSelection}
          savingIds={savingIds}
          errorIds={errorIds}
          setRowSelection={setRowSelection}
          startEditing={startEditing}
          cancelEditing={cancelEditing}
          updateTempEdit={updateTempEdit}
          handleSave={handleSave}
          handleDeleteById={handleDeleteById}
          handleToggleStatus={handleToggleStatus}
        />
      </Box>
    </Layout>
  )
}

export default App