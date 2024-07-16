import { configureStore } from '@reduxjs/toolkit'
import currentChatReducer from './store_slices/CurrentChatSlice'
import chatsReducer from './store_slices/ChatsSlice'

export const store = configureStore({
  reducer: {
    currentChatId: currentChatReducer,
    chats: chatsReducer,
  },
})