import { useEffect, useState } from 'react';
import { Book } from '../types/Book';
import { useNavigate } from 'react-router-dom';
import { fetchBooks } from '../api/BooksAPI';
import Pagination from './Pagination';

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(5); //default value 1
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<string>('asc'); //default sorting
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    //only grabs the data when it needs to and not all the time, when there is a change
    const loadBooks = async () => {
      try {
        setLoading(true);
        const data = await fetchBooks(
          pageSize,
          pageNum,
          sortOrder,
          selectedCategories
        );

        setBooks(data.books);
        setTotalPages(Math.ceil(data.totalNumberOfBooks / pageSize));
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false); //put loading to false
      }
    };

    loadBooks();
  }, [pageSize, pageNum, sortOrder, selectedCategories]);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };
  //click the button and toggle between the sorting orders

  if (loading) {
    return <div>Loading books...</div>;
  }
  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <>
      <div className="container mt-4">
        <button className="btn btn-primary mb-3" onClick={toggleSortOrder}>
          Sort By Name ({sortOrder === 'asc' ? 'A-Z' : 'Z-A'})
        </button>
        <br />
        <br />
        {books.map((b) => (
          <div id="bookCard" className="card" key={b.bookID}>
            <h3 className="card-title">{b.title}</h3>
            <div className="card-body">
              <ul className="list-unstyled">
                <li>
                  <strong>Author:</strong> {b.author}
                </li>
                <li>
                  <strong>Publisher:</strong> {b.publisher}
                </li>
                <li>
                  <strong>ISBN:</strong> {b.isbn}
                </li>
                <li>
                  <strong>Classification:</strong> {b.classification}
                </li>
                <li>
                  <strong>Category:</strong> {b.category}
                </li>
                <li>
                  <strong>Page Count: </strong> {b.pageCount}
                </li>
                <li>
                  <strong>Price: </strong> {b.price}
                </li>
              </ul>

              <button
                className="btn btn-success w-100"
                onClick={() =>
                  navigate(`/confirm/${b.title}/${b.bookID}/${b.price}`)
                }
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={pageNum}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPageNum(1);
        }}
      />
    </>
  );
}
export default BookList;
