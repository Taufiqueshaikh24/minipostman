import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import collectionsService from "../../services/collectionService";

export const fetchCollections = createAsyncThunk("collections/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const res = await collectionsService.getAll();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch");
  }
});

export const createCollection = createAsyncThunk("collections/create", async (name, { rejectWithValue }) => {
  try {
    const res = await collectionsService.create(name);
    return { id: res.data.id, name };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to create");
  }
});

export const addRequestToCollection = createAsyncThunk(
  "collections/addRequest",
  async ({ collectionId, requestId }, { rejectWithValue }) => {
    try {
      await collectionsService.addRequest(collectionId, requestId);
      return { collectionId, requestId };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add request");
    }
  }
);

const collectionsSlice = createSlice({
  name: "collections",
  initialState: {
    items: [],
    isLoading: false,
    isSaving: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollections.pending, (state) => { state.isLoading = true; })
      .addCase(fetchCollections.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchCollections.rejected, (state) => { state.isLoading = false; })
      .addCase(createCollection.pending, (state) => { state.isSaving = true; })
      .addCase(createCollection.fulfilled, (state, action) => {
        state.isSaving = false;
        state.items.unshift(action.payload);
      })
      .addCase(createCollection.rejected, (state) => { state.isSaving = false; });
  },
});

export default collectionsSlice.reducer;