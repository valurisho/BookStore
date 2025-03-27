import { createContext, ReactNode, useContext, useState } from 'react';
import { CartItem } from '../types/CartItem';

interface CartContextType {
  cart: CartItem[];
  addtoCart: (item: CartItem) => void;
  removeFromCart: (bookId: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addtoCart = (item: CartItem) => {
    console.log('Adding to cart:', item);

    setCart((prevCart) => {
      // Check if the item already exists in the cart
      const existingItem = prevCart.find((c) => c.bookID === item.bookID);

      if (existingItem) {
        // Update quantity and price if the book already exists
        return prevCart.map((c) =>
          c.bookID === item.bookID
            ? { ...c, quantity: c.quantity + 1, price: c.price + item.price }
            : c
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
    // setCart((prevCart) => {
    //   // check to see if the item exists in the cart
    //   const existingItem = prevCart.find((c) => c.bookID === item.bookID);
    //   //build and updated cart
    //   const updatedCart = prevCart.map((c) =>
    //     c.bookID === item.bookID
    //       ? { ...c, quantity: c.quantity + 1, price: c.price + item.price }
    //       : c
    //   );

    //   return existingItem ? updatedCart : [...prevCart, item];
    // });
  };

  //fliter out all projects that are not the one we want to remove and we set that as our cart
  //   const removeFromCart = (bookId: number) => {
  //     setCart((prevCart) => prevCart.filter((c) => c.bookID !== bookId));
  //   };
  const removeFromCart = (bookId: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((c) =>
          c.bookID === bookId
            ? c.quantity > 1
              ? {
                  ...c,
                  quantity: c.quantity - 1,
                  price: c.price - c.price / c.quantity,
                }
              : null // If quantity is 1, remove the item
            : c
        )
        .filter((c) => c !== null); // Remove null items
    });
  };

  const clearCart = () => {
    setCart(() => []);
  };

  return (
    <CartContext.Provider
      value={{ cart, addtoCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
