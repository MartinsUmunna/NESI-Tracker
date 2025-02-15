import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  totalEnergyGenerated: 0,
};

export const EnergySlice = createSlice({
  name: 'energy',
  initialState,
  reducers: {
    updateEnergyGenerated: (state, action) => {
      state.totalEnergyGenerated = action.totalEnergyGenerated;
    },
    resetEnergy: (state) => {
      state.totalEnergyGenerated = 0;
    },
  },
});

export const { updateEnergyGenerated, resetEnergy } = EnergySlice.actions;
export default EnergySlice.reducer;
