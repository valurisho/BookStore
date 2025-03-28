import { useEffect, useState } from 'react';
import { Book } from '../types/Book';
import { useNavigate } from 'react-router-dom';

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(5); //default value 1
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<string>('asc'); //default sorting
  const navigate = useNavigate();

  useEffect(() => {
    //only grabs the data when it needs to and not all the time, when there is a change
    const fetchBooks = async () => {
      const categoryParams = selectedCategories
        .map((cat) => `categories=${encodeURIComponent(cat)}`) //encode the URI
        .join('&');

      const response = await fetch(
        `https://localhost:5000/api/Book/AllBooks?pageHowMany=${pageSize}&pageNum=${pageNum}&sortBY=title&sortOrder=${sortOrder}${selectedCategories.length ? `&${categoryParams}` : ''}`
      );
      //we can pass info on the server as we make the request
      const data = await response.json();
      setBooks(data.books);
      setTotalItems(data.totalNumberOfBooks);
      setTotalPages(Math.ceil(totalItems / pageSize));
    };

    fetchBooks();
  }, [pageSize, pageNum, totalItems, sortOrder, selectedCategories]);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };
  //click the button and toggle between the sorting orders

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
        <nav>
          <ul className="pagination justify-content-center mt-3">
            <li className={`page-item ${pageNum === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => setPageNum(pageNum - 1)}
              >
                Previous
              </button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li
                className={`page-item ${pageNum === index + 1 ? 'active' : ''}`}
                key={index + 1}
              >
                <button
                  className="page-link"
                  onClick={() => setPageNum(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${pageNum === totalPages ? 'disabled' : ''}`}
            >
              <button
                className="page-link"
                onClick={() => setPageNum(pageNum + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>

        <div className="mt-3">
          <label className="me-2">Results per page:</label>
          <select
            className="form-select d-inline w-auto"
            value={pageSize}
            onChange={(p) => {
              setPageSize(Number(p.target.value));
              setPageNum(1);
            }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>
      </div>

      {/* <button disabled={pageNum === 1} onClick={() => setPageNum(pageNum - 1)}>
        Previous
      </button>

      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index + 1}
          onClick={() => setPageNum(index + 1)}
          disabled={pageNum === index + 1}
        >
          {index + 1}
        </button>
      ))}
      <button
        disabled={pageNum === totalPages}
        onClick={() => setPageNum(pageNum + 1)}
      >
        Next
      </button>

      <label>Results per page:</label>
      <select
        value={pageSize}
        onChange={(p) => {
          setPageSize(Number(p.target.value));
          setPageNum(1);
        }}
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
      </select> */}
    </>
  );
}
export default BookList;
