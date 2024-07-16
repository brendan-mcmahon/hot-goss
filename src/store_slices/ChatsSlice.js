import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: [],
}

export const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setChats: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value = action.payload
    },
    updateTrust: (state, action) => {
        const { chatId, trustDelta } = action.payload;
        state.value[chatId].user.Trust += trustDelta;
        state.value[chatId].user.Trust = Math.max(0, Math.min(state.value[chatId].user.Trust, 100));
    }
  },
})

// Action creators are generated for each case reducer function
export const { setChats, updateTrust } = chatsSlice.actions

export default chatsSlice.reducer