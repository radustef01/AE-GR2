import { createSlice } from '@reduxjs/toolkit';

const load = () => {
  try {
    return JSON.parse(localStorage.getItem('cart') || '{"items":[]}');
  } catch {
    return { items: [] };
  }
};

const save = (state) => {
  localStorage.setItem('cart', JSON.stringify(state));
};

const initialState = load(); // { items: [] }

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, { payload }) => {
        console.log('addItem reducer, current state:', state);
        console.log('addItem payload:', payload);

        const existing = state.items.find((i) => i.id === payload.id);
        if (existing) {
            existing.quantity += payload.quantity ?? 1;
        } else {
        state.items.push({ ...payload, quantity: payload.quantity ?? 1 });
    }
    console.log('addItem reducer, new state:', state);

    save(state);
    },
    removeItem: (state, { payload: id }) => {
      state.items = state.items.filter((i) => i.id !== id);
      save(state);
    },
    changeQty: (state, { payload: { id, quantity } }) => {
      const item = state.items.find((i) => i.id === id);
      if (item) {
        item.quantity = Math.max(1, quantity);
        save(state);
      }
    },
    clearCart: (state) => {
      state.items = [];
      save(state);
    },
  },
});

export const { addItem, removeItem, changeQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

// selector pentru numărul total de produse din cart
export const selectCartCount = (state) =>
  state.cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
