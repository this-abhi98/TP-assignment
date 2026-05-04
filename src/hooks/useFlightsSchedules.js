import { useReducer, useState, useMemo } from "react";
import { flightsData } from "../data/flights.js";

// Initial State
const initialFilters = {
  dateRange: { from: null, to: null },
  days: [],
  status: "all",
  aoc: "all",
  bodyType: "all",
  searchQuery: "",
};

const initialState = {
  data: flightsData.flights,
  filteredData: flightsData.flights,
  editingId: null,
  filters: initialFilters,
};

// Helper function to filter flights
function filterFlights(data, filters) {
  return data.filter((flight) => {
    if (filters.status !== "all" && flight.status !== filters.status) return false;
    if (filters.bodyType !== "all" && flight.bodyType !== filters.bodyType) return false;
    if (filters.aoc !== "all" && flight.aoc !== filters.aoc) return false;

    if (filters.days.length > 0) {
      if (!flight.daysOfOperation.some((d) => filters.days.includes(d))) return false;
    }

    if (filters.dateRange.from && filters.dateRange.to) {
      if (!(flight.startDate <= filters.dateRange.from && flight.endDate >= filters.dateRange.to)) {
        return false;
      }
    }

    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.trim().toLowerCase();
      const matches =
        flight.flightNumber.toLowerCase().includes(q) ||
        flight.origin.toLowerCase().includes(q) ||
        flight.destination.toLowerCase().includes(q);
      if (!matches) return false;
    }

    return true;
  });
}

// Reducer for state management
function reducer(state, action) {
  switch (action.type) {
    case "SET_DATA": {
      return {
        ...state,
        data: action.payload,
        filteredData: filterFlights(action.payload, state.filters),
      };
    }
    case "DELETE_BY_ID": {
      const nextData = state.data.filter((f) => f.id !== action.payload);
      return { ...state, data: nextData, filteredData: filterFlights(nextData, state.filters) };
    }
    case "DELETE_MULTIPLE": {
      const nextData = state.data.filter((f) => !action.payload.includes(f.id));
      return { ...state, data: nextData, filteredData: filterFlights(nextData, state.filters) };
    }
    case "TOGGLE_STATUS": {
      const nextData = state.data.map((f) =>
        f.id === action.payload
          ? { ...f, status: f.status === "Active" ? "Inactive" : "Active" }
          : f
      );
      return { ...state, data: nextData, filteredData: filterFlights(nextData, state.filters) };
    }
    case "EDIT_FLIGHT": {
      return { ...state, editingId: action.payload };
    }
    case "UPDATE_FLIGHT": {
      const nextData = state.data.map((f) => (f.id === action.payload.id ? action.payload : f));
      return {
        ...state,
        data: nextData,
        filteredData: filterFlights(nextData, state.filters),
        editingId: null,
      };
    }
    case "SET_FILTER": {
      const nextFilters = { ...state.filters, ...action.payload };
      return { ...state, filters: nextFilters, filteredData: filterFlights(state.data, nextFilters) };
    }
    case "CLEAR_FILTERS": {
      return { ...state, filters: initialFilters, filteredData: state.data };
    }
    default:
      return state;
  }
}

// Custom hook for flight schedules management
export function useFlightSchedules() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [rowSelection, setRowSelection] = useState({});
  const [savingIds, setSavingIds] = useState(new Set());
  const [errorIds, setErrorIds] = useState(new Set());
  const [tempEditData, setTempEditData] = useState(null);

  // Derived state
  const aocOptions = useMemo(
    () => Array.from(new Set(state.data.map((f) => f.aoc))).sort(),
    [state.data]
  );

  const selectedCount = Object.keys(rowSelection).length;

  // Action handlers
  const handleFilterChange = (filters) => {
    dispatch({ type: "SET_FILTER", payload: filters });
  };

  const handleClearFilters = () => {
    dispatch({ type: "CLEAR_FILTERS" });
  };

  const handleSearchChange = (searchQuery) => {
    dispatch({ type: "SET_FILTER", payload: { searchQuery } });
  };

  const startEditing = (flight) => {
    setTempEditData({ ...flight });
    dispatch({ type: "EDIT_FLIGHT", payload: flight.id });
  };

  const cancelEditing = () => {
    setTempEditData(null);
    dispatch({ type: "EDIT_FLIGHT", payload: null });
  };

  const updateTempEdit = (patch) => {
    setTempEditData((prev) => (prev ? { ...prev, ...patch } : prev));
  };

  const handleSave = async (id) => {
    if (!tempEditData) return;

    setSavingIds((prev) => new Set(prev).add(id));
    setErrorIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });

    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => (Math.random() > 0.1 ? resolve() : reject("Failed to save")), 1000);
      });

      dispatch({ type: "UPDATE_FLIGHT", payload: tempEditData });
      setTempEditData(null);
    } catch {
      setErrorIds((prev) => new Set(prev).add(id));
      setTempEditData(null);
      dispatch({ type: "EDIT_FLIGHT", payload: null });
    } finally {
      setSavingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleDeleteById = (id) => {
    dispatch({ type: "DELETE_BY_ID", payload: id });
  };

  const handleDeleteSelected = () => {
    // Map row indices to actual flight IDs
    const selectedIds = Object.keys(rowSelection)
      .map(index => state.filteredData[parseInt(index)]?.id)
      .filter(Boolean); // Remove undefined values
    
    if (selectedIds.length > 0) {
      dispatch({ type: "DELETE_MULTIPLE", payload: selectedIds });
      setRowSelection({});
    }
  };

  const handleToggleStatus = (id) => {
    dispatch({ type: "TOGGLE_STATUS", payload: id });
  };

  return {
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
  };
}