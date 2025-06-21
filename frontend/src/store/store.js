import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import spotsReducer from './slices/spotsSlice';
import reviewsReducer from './slices/reviewsSlice';
import spotImagesReducer from './slices/spotImagesSlice';
import bookingReducer from './slices/bookingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    spots: spotsReducer,
    reviews: reviewsReducer,
    spotImages: spotImagesReducer,
    bookings: bookingReducer,
  },
});

// For TypeScript users, these would be:
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;