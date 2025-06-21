import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { spotsAPI } from '../../utils/api';

// Async thunks
export const fetchSpots = createAsyncThunk(
  'spots/fetchSpots',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await spotsAPI.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch spots');
    }
  }
);

export const fetchSpotById = createAsyncThunk(
  'spots/fetchSpotById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await spotsAPI.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch spot');
    }
  }
);

export const createSpot = createAsyncThunk(
  'spots/createSpot',
  async (spotData, { rejectWithValue }) => {
    try {
      const response = await spotsAPI.create(spotData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create spot');
    }
  }
);

export const updateSpot = createAsyncThunk(
  'spots/updateSpot',
  async ({ id, spotData }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.put(
        `${API_BASE_URL}/spots/${id}`,
        spotData,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteSpot = createAsyncThunk(
  'spots/deleteSpot',
  async (id, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      await axios.delete(`${API_BASE_URL}/spots/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);



const initialState = {
  spots: [],
  currentSpot: null,
  isLoading: false,
  error: null,

};

const spotsSlice = createSlice({
  name: 'spots',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },

    clearCurrentSpot: (state) => {
      state.currentSpot = null;
    },

  },
  extraReducers: (builder) => {
    builder
      // Fetch spots
      .addCase(fetchSpots.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSpots.fulfilled, (state, action) => {
        state.isLoading = false;
        state.spots = action.payload;
        state.error = null;
      })
      .addCase(fetchSpots.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch spot by ID
      .addCase(fetchSpotById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSpotById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSpot = action.payload;
        state.error = null;
      })
      .addCase(fetchSpotById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create spot
      .addCase(createSpot.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createSpot.fulfilled, (state, action) => {
        state.isLoading = false;
        state.spots.push(action.payload);
        state.error = null;
      })
      .addCase(createSpot.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update spot
      .addCase(updateSpot.fulfilled, (state, action) => {
        const index = state.spots.findIndex(
          (spot) => spot.id === action.payload.id
        );
        if (index !== -1) {
          state.spots[index] = action.payload;
        }
        state.currentSpot = action.payload;
      })
      // Delete spot
      .addCase(deleteSpot.fulfilled, (state, action) => {
        state.spots = state.spots.filter(
          (spot) => spot.id !== action.payload
        );
      });
  },
});

export const { clearError, clearCurrentSpot } = spotsSlice.actions;
export default spotsSlice.reducer;