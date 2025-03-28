import { useState } from 'react';
import BookList from '../components/BookList';
import CategoryFilter from '../components/Categoryfilter';
import WelcomeBanner from '../components/WelcomeBanner';
import CartSummary from '../components/CartSummary';

function BooksPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  return (
    <>
      <WelcomeBanner />
      <div className="container">
        <CartSummary />
        <div className="row">
          <div className="col-md-3">
            <CategoryFilter
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
          </div>
          <div className="col-md-9">
            <BookList selectedCategories={selectedCategories} />
          </div>
        </div>
      </div>
    </>
  );
}

export default BooksPage;
