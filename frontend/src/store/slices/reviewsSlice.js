import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { spotsAPI, reviewsAPI } from '../../utils/api';

// Async thunks for API calls
export const fetchReviewsBySpotId = createAsyncThunk(
  'reviews/fetchBySpotId',
  async (spotId, { rejectWithValue }) => {
    try {
      const response = await spotsAPI.getReviews(spotId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
    }
  }
);

export const createReview = createAsyncThunk(
  'reviews/create',
  async ({ spotId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await spotsAPI.createReview(spotId, reviewData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create review');
    }
  }
);

export const updateReview = createAsyncThunk(
  'reviews/update',
  async ({ reviewId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await reviewsAPI.update(reviewId, reviewData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update review');
    }
  }
);

export const deleteReview = createAsyncThunk(
  'reviews/delete',
  async (reviewId, { rejectWithValue }) => {
    try {
      await reviewsAPI.delete(reviewId);
      return reviewId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete review');
    }
  }
);

// Initial state
const initialState = {
  reviews: [],
  currentReview: null,
  isLoading: false,
  error: null,
};

// Create slice
const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentReview: (state) => {
      state.currentReview = null;
    },
    clearReviews: (state) => {
      state.reviews = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch reviews by spot ID
      .addCase(fetchReviewsBySpotId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReviewsBySpotId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload;
        state.error = null;
      })
      .addCase(fetchReviewsBySpotId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create review
      .addCase(createReview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews.push(action.payload);
        state.error = null;
      })
      .addCase(createReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update review
      .addCase(updateReview.fulfilled, (state, action) => {
        const index = state.reviews.findIndex(
          (review) => review.id === action.payload.id
        );
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
        state.currentReview = action.payload;
      })
      // Delete review
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter(
          (review) => review.id !== action.payload
        );
      });
  },
});

export const { clearError, clearCurrentReview, clearReviews } = reviewsSlice.actions;
export default reviewsSlice.reducer;