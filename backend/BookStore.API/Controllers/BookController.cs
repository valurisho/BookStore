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
        public IActionResult GetBooks(int pageHowMany = 5, int pageNum = 1, string sortBy="title", string sortOrder="asc") //add default value
        {
            var query = _bookContext.Books.AsQueryable();
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
    }
}
