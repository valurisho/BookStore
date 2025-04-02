using BookStore.API.Data;
using Microsoft.AspNetCore.Mvc;

namespace BookStore.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private BookDbContext _bookContext;
        
        public BookController(BookDbContext temp)
        {
            _bookContext = temp;
        }
        [HttpGet("AllBooks")]
        public IActionResult GetBooks(int pageHowMany = 5, int pageNum = 1, string sortBy="title", string sortOrder="asc", [FromQuery]List<string>? categories=null) //add default values
        {
            var query = _bookContext.Books.AsQueryable();
            
            //Edit query so that it only sends the books which fit the category
            if (categories != null && categories.Any())
            {
                query = query.Where(c => categories.Contains(c.Category));
            }

            if (sortBy.ToLower() == "title")
            {
                query = sortOrder.ToLower() == "desc" 
                    ? query.OrderByDescending(b => b.Title) //if desc then sort descending
                    : query.OrderBy(b => b.Title); //if false sort ascending
            }
            var books = query
                .Skip((pageNum-1)*pageHowMany)
                .Take(pageHowMany)
                .ToList();
            
            var totalNumberOfBooks = query.Count();
            return Ok (new
            {
                Books = books,
                TotalNumberOfBooks = totalNumberOfBooks
            });
            /*var books = _bookContext.Books
                .Skip((pageNum-1)*pageHowMany)
                .Take(pageHowMany)
                .ToList();
            
            var totalNumberOfBooks = _bookContext.Books.Count();
            return Ok (new
            {
                Books = books,
                TotalNumberOfBooks = totalNumberOfBooks
            }); */
        }
        
        //Finding the Categories
        
        [HttpGet("GetCategories")]
        public IActionResult GetCategories()
        {
            var categories = _bookContext.Books
                .Select(b => b.Category)
                .Distinct()
                .ToList();
            return Ok(categories);
                
        }
        [HttpPost("AddBook")]
        public IActionResult AddBook([FromBody]Book newBook)
        {
            _bookContext.Books.Add(newBook);
            _bookContext.SaveChanges();
            return Ok(newBook);
        }

        [HttpPut("UpdateBook/{bookId}")]
        public IActionResult UpdateBook(int bookId, [FromBody] Book updatedBook)
        {
            var existingBook = _bookContext.Books.Find(bookId);
            if (existingBook == null)
    {
        return NotFound(new { message = "Book not found" });
    }

            existingBook.Title = updatedBook.Title;
            existingBook.Author = updatedBook.Author;
            existingBook.Publisher = updatedBook.Publisher;
            existingBook.ISBN = updatedBook.ISBN;
            existingBook.Classification = updatedBook.Classification;
            existingBook.Category = updatedBook.Category;
            existingBook.PageCount = updatedBook.PageCount;
            existingBook.Price = updatedBook.Price;

            _bookContext.Books.Update(existingBook);
            _bookContext.SaveChanges();

            return Ok(existingBook);
        }
        
        [HttpDelete("DeleteBook/{bookId}")]
        public IActionResult DeleteBook(int bookId)
        {
            var book = _bookContext.Books.Find(bookId);

            if(book ==null)
            {
                return NotFound(new{message = "Book not found"});
            }
            _bookContext.Books.Remove(book);
            _bookContext.SaveChanges();

            return NoContent();
        }
    }
}
