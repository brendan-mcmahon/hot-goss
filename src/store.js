import { configureStore } from '@reduxjs/toolkit'
import currentChatReducer from './store_slices/CurrentChatSlice'

export const store = configureStore({
  reducer: {
    currentChatId: currentChatReducer
  },
})