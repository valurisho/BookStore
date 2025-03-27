import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types/CartItem';

function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart, clearCart } = useCart();
  const totalAmount = cart.reduce((total, item) => total + item.price, 0);

  return (
    <div>
      <h2>Your Cart:</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <ul>
          {cart.map((item: CartItem) => {
            console.log('Rendering item:', item);
            return (
              <li key={item.bookID}>
                {item.bookName}: ${item.price} | Quantity: {item.quantity}
                <button onClick={() => removeFromCart(item.bookID)}>
                  Remove
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <h3>Total: ${totalAmount.toFixed(2)}</h3>
      <button onClick={() => navigate('/books')}>Continue Browsing</button>
      <button>Checkout</button>
      <br />
      <button onClick={() => clearCart()}>Clear Cart</button>
    </div>
  );
}

export default CartPage;
