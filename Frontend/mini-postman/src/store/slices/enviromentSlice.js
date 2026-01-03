import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import environmentsService from "../../services/enviromentServices";

export const fetchEnvironments = createAsyncThunk("environments/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const res = await environmentsService.getAll();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch");
  }
});

export const createEnvironment = createAsyncThunk("environments/create", async (data, { rejectWithValue }) => {
  try {
    const res = await environmentsService.create(data);
    return { ...data, id: res.data.id };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to create");
  }
});

export const updateEnvironment = createAsyncThunk("environments/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    await environmentsService.update(id, data);
    return { id, ...data };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to update");
  }
});

export const deleteEnvironment = createAsyncThunk("environments/delete", async (id, { rejectWithValue }) => {
  try {
    await environmentsService.delete(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete");
  }
});

const environmentsSlice = createSlice({
  name: "environments",
  initialState: {
    items: [],
    selectedId: null,
    isLoading: false,
    isSaving: false,
  },
  reducers: {
    setSelectedEnvironment: (state, action) => {
      state.selectedId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEnvironments.pending, (state) => { state.isLoading = true; })
      .addCase(fetchEnvironments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchEnvironments.rejected, (state) => { state.isLoading = false; })
      .addCase(createEnvironment.pending, (state) => { state.isSaving = true; })
      .addCase(createEnvironment.fulfilled, (state, action) => {
        state.isSaving = false;
        state.items.unshift(action.payload);
      })
      .addCase(createEnvironment.rejected, (state) => { state.isSaving = false; })
      .addCase(updateEnvironment.fulfilled, (state, action) => {
        const idx = state.items.findIndex(e => e.id === action.payload.id);
        if (idx !== -1) state.items[idx] = { ...state.items[idx], ...action.payload };
      })
      .addCase(deleteEnvironment.fulfilled, (state, action) => {
        state.items = state.items.filter(e => e.id !== action.payload);
        if (state.selectedId === action.payload) state.selectedId = null;
      });
  },
});

export const { setSelectedEnvironment } = environmentsSlice.actions;
export default environmentsSlice.reducer;