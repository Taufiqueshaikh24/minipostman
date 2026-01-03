import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import requestsService from "../../services/requestsService";

export const fetchRequests = createAsyncThunk("requests/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const res = await requestsService.getAll();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch");
  }
});

export const createRequest = createAsyncThunk("requests/create", async (data, { rejectWithValue }) => {
  try {
    const res = await requestsService.create(data);
    return { ...data, id: res.data.id };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to create");
  }
});

export const deleteRequest = createAsyncThunk("requests/delete", async (id, { rejectWithValue }) => {
  try {
    await requestsService.delete(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete");
  }
});

export const executeRequest = createAsyncThunk("requests/execute", async ({ id, environmentId }, { rejectWithValue }) => {
  try {
    const res = await requestsService.execute(id, environmentId);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Execution failed");
  }
});

export const fetchExecutions = createAsyncThunk("requests/fetchExecutions", async (id, { rejectWithValue }) => {
  try {
    const res = await requestsService.getExecutions(id);
    return { requestId: id, executions: res.data };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch history");
  }
});

const requestsSlice = createSlice({
  name: "requests",
  initialState: {
    items: [],
    currentRequest: null,
    response: null,
    executions: [],
    isLoading: false,
    isSaving: false,
    isExecuting: false,
    error: null,
  },
  reducers: {
    setCurrentRequest: (state, action) => {
      state.currentRequest = action.payload;
      state.response = null;
      state.executions = [];
      state.error = null;
    },
    clearCurrentRequest: (state) => {
      state.currentRequest = null;
      state.response = null;
      state.executions = [];
      state.error = null;
    },
    clearResponse: (state) => {
      state.response = null;
      state.error = null;
    },
    setDirectResponse: (state, action) => {
      state.response = action.payload;
      state.isExecuting = false;
    },
    setDirectError: (state, action) => {
      state.error = action.payload;
      state.isExecuting = false;
    },
    setExecuting: (state, action) => {
      state.isExecuting = action.payload;
      if (action.payload) {
        state.response = null;
        state.error = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequests.pending, (state) => { state.isLoading = true; })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchRequests.rejected, (state) => { state.isLoading = false; })
      .addCase(createRequest.pending, (state) => { state.isSaving = true; })
      .addCase(createRequest.fulfilled, (state, action) => {
        state.isSaving = false;
        state.items.unshift(action.payload);
      })
      .addCase(createRequest.rejected, (state) => { state.isSaving = false; })
      .addCase(deleteRequest.fulfilled, (state, action) => {
        state.items = state.items.filter((r) => r.id !== action.payload);
        if (state.currentRequest?.id === action.payload) {
          state.currentRequest = null;
        }
      })
      .addCase(executeRequest.pending, (state) => {
        state.isExecuting = true;
        state.response = null;
        state.error = null;
      })
      .addCase(executeRequest.fulfilled, (state, action) => {
        state.isExecuting = false;
        state.response = action.payload;
      })
      .addCase(executeRequest.rejected, (state, action) => {
        state.isExecuting = false;
        state.error = action.payload;
      })
      .addCase(fetchExecutions.fulfilled, (state, action) => {
        state.executions = action.payload.executions;
      });
  },
});

export const { setCurrentRequest, clearCurrentRequest, clearResponse, setDirectResponse, setDirectError, setExecuting } = requestsSlice.actions;
export default requestsSlice.reducer;