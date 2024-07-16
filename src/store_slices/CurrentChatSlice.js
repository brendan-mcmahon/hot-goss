import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: 0,
}

export const currentChatSlice = createSlice({
  name: 'currentChatId',
  initialState,
  reducers: {
    setCurrentChatId: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setCurrentChatId } = currentChatSlice.actions

export default currentChatSlice.reducer