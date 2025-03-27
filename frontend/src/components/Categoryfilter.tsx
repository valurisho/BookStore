import { useEffect, useState } from 'react';
import './Categoryfilter.css';

function CategoryFilter({
  selectedCategories,
  setSelectedCategories,
}: {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
}) {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `https://localhost:5000/api/Book/GetCategories`
        );
        const data = await response.json();
        console.log('Fetched categories, ', data);
        setCategories(data);
      } catch (error) {
        console.error('Error fecthing categories', error);
      }
    };
    fetchCategories();
  }, []); //dependancy array

  function handleCheckboxChange({ target }: { target: HTMLInputElement }) {
    const updatedCategories = selectedCategories.includes(target.value)
      ? /*true*/ selectedCategories.filter((x) => x !== target.value)
      : /*false*/ [...selectedCategories, target.value];
    setSelectedCategories(updatedCategories);
  }

  return (
    <div className="category-filter">
      <h5>Book Categories:</h5>
      <div className="category-list">
        {categories.map((c) => (
          <div className="category-item" key={c}>
            <input
              type="checkbox"
              id={c}
              value={c}
              className="category-checkbox"
              onChange={handleCheckboxChange}
            />
            <label htmlFor={c}>{c}</label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryFilter;
