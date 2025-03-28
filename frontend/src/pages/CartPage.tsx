import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types/CartItem';

function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart, clearCart } = useCart();
  const totalAmount = cart.reduce((total, item) => total + item.price, 0);

  return (
    <div className="container">
      <h2 className="my-4">Your Cart</h2>
      {cart.length === 0 ? (
        <p className="alert alert-info">Your cart is empty</p>
      ) : (
        <ul className="list-group mb-3">
          {cart.map((item: CartItem) => (
            <li
              key={item.bookID}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {item.bookName}: ${item.price} | Quantity: {item.quantity}
              <button
                className="btn btn-danger btn-sm"
                onClick={() => removeFromCart(item.bookID)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      <h3 className="mb-3">Total: ${totalAmount.toFixed(2)}</h3>
      <div className="d-flex gap-2">
        <button
          className="btn btn-outline-primary"
          onClick={() => navigate('/books')}
        >
          Continue Browsing
        </button>
        <button className="btn btn-success">Checkout</button>
      </div>
      <button className="btn btn-warning mt-3" onClick={() => clearCart()}>
        Clear Cart
      </button>
    </div>
  );
}

export default CartPage;
