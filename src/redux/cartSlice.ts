import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
}


const loadStateFromLocalStorage = (): CartState => {
  try {
    const serializedState = localStorage.getItem('cartState');
    if (serializedState === null) {
      return {
        items: [],
        subtotal: 0,
        shipping: 0,
        tax: 3.0,
      };
    }
    return JSON.parse(serializedState);
  } catch (error) {
    console.error("Erro ao carregar o estado do localStorage:", error);
    return {
      items: [],
      subtotal: 0,
      shipping: 0,
      tax: 3.0,
    };
  }
};


const initialState: CartState = loadStateFromLocalStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) =>
          item.id === action.payload.id &&
          item.selectedColor === action.payload.selectedColor &&
          item.selectedSize === action.payload.selectedSize
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }

      
      state.subtotal = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      
      localStorage.setItem('cartState', JSON.stringify(state));
    },

    
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);

      
      state.subtotal = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

     
      localStorage.setItem('cartState', JSON.stringify(state));
    },

   
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;

       
        state.subtotal = state.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );

        
        localStorage.setItem('cartState', JSON.stringify(state));
      }
    },

    
    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;

      
      localStorage.removeItem('cartState');
    },
  },
});


export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;


export default cartSlice.reducer;