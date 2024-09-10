import { createContext, useContext, useReducer, useEffect } from "react";

// Initial cart state
const initialState = {
  items: JSON.parse(localStorage.getItem("cartItems")) || [],
};

// Reducer function to manage cart actions
const cartReducer = (state, action) => {
  const existingItemIndex = state.items.findIndex(
    (item) =>
      item.id === action.payload.id &&
      item.selectedAttributeValue === action.payload.selectedAttributeValue
  );
  switch (action.type) {
    case "ADD_TO_CART":
      if (existingItemIndex >= 0) {
        // Item already exists in the cart, increase its quantity
        const updatedItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return { ...state, items: updatedItems };
      } else {
        // Item does not exist in the cart, add it with a quantity of 1
        return {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }],
        };
      }
    case "REMOVE_FROM_CART":
      // check item.id & item.selectedAttributeValue
      // then check the quantity to decrease or remove the item
      const itemToRemove = state.items.filter(
        (item) =>
          item.id === action.payload.id &&
          item.selectedAttributeValue === action.payload.selectedAttributeValue
      )[0];
      const itemsRemoveUpdated = state.items
        .map((item) =>
          item.id === itemToRemove.id &&
          item.selectedAttributeValue === itemToRemove.selectedAttributeValue
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0);
      return { ...state, items: itemsRemoveUpdated };
    case "CLEAR_CART":
      return { items: [] };
    default:
      return state;
  }
};

// Create context
const CartContext = createContext();

// Cart provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Log cart state whenever it changes and update local storage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(state.items));
  }, [state]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => useContext(CartContext);
