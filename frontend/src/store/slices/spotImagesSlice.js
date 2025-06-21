import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { imagesAPI } from '../../utils/api';

// Async thunks for API calls
export const fetchSpotImages = createAsyncThunk(
  'spotImages/fetchBySpotId',
  async (spotId, { rejectWithValue }) => {
    try {
      const response = await imagesAPI.getBySpotId(spotId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch spot images');
    }
  }
);

export const addSpotImage = createAsyncThunk(
  'spotImages/add',
  async ({ spotId, imageData }, { rejectWithValue }) => {
    try {
      const response = await imagesAPI.create(spotId, imageData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add spot image');
    }
  }
);

export const updateSpotImage = createAsyncThunk(
  'spotImages/update',
  async ({ imageId, imageData }, { rejectWithValue }) => {
    try {
      const response = await imagesAPI.update(imageId, imageData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update spot image');
    }
  }
);

export const deleteSpotImage = createAsyncThunk(
  'spotImages/delete',
  async (imageId, { rejectWithValue }) => {
    try {
      await imagesAPI.delete(imageId);
      return imageId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete spot image');
    }
  }
);

// Initial state
const initialState = {
  images: [],
  currentImage: null,
  isLoading: false,
  error: null,
};

// Create slice
const spotImagesSlice = createSlice({
  name: 'spotImages',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentImage: (state) => {
      state.currentImage = null;
    },
    clearImages: (state) => {
      state.images = [];
      state.error = null;
    },
    setPreviewImage: (state, action) => {
      const imageId = action.payload;
      state.images = state.images.map(image => ({
        ...image,
        preview: image.id === imageId
      }));
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch spot images
      .addCase(fetchSpotImages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSpotImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.images = action.payload;
        state.error = null;
      })
      .addCase(fetchSpotImages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add spot image
      .addCase(addSpotImage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addSpotImage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.images.push(action.payload);
        state.error = null;
      })
      .addCase(addSpotImage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update spot image
      .addCase(updateSpotImage.fulfilled, (state, action) => {
        const index = state.images.findIndex(
          (image) => image.id === action.payload.id
        );
        if (index !== -1) {
          state.images[index] = action.payload;
        }
        state.currentImage = action.payload;
      })
      // Delete spot image
      .addCase(deleteSpotImage.fulfilled, (state, action) => {
        state.images = state.images.filter(
          (image) => image.id !== action.payload
        );
      });
  },
});

export const { clearError, clearCurrentImage, clearImages, setPreviewImage } = spotImagesSlice.actions;
export default spotImagesSlice.reducer;