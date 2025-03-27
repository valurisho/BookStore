import { useNavigate, useParams } from 'react-router-dom';
import WelcomeBanner from '../components/WelcomeBanner';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types/CartItem';

function ConfirmPage() {
  const navigate = useNavigate();
  const { bookID, bookName, price } = useParams();
  const { addtoCart } = useCart();

  console.log('Params received:', { bookID, bookName, price });

  const handleAddToCart = () => {
    const newItem: CartItem = {
      bookID: Number(bookID),
      bookName: bookName || 'No book Found',
      price: Number(price),
      quantity: Number(1),
    };
    addtoCart(newItem);
    navigate('/cart');
  };

  return (
    <>
      <WelcomeBanner />
      <h2>Add {bookName} to your cart</h2>
      <div>
        <p>Price: ${price}</p>
        <button onClick={handleAddToCart}>Add to Cart</button>
      </div>
      <button onClick={() => navigate(-1)}>Go Back</button>
      {/* <!--goes back to last page--> */}
    </>
  );
}

export default ConfirmPage;
