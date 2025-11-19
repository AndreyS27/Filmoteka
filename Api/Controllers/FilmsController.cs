using Api.Interfaces;
using Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FilmsController : ControllerBase
    {
        private readonly IFilmService _filmService;

        public FilmsController(IFilmService filmService)
        {
            _filmService = filmService;
        }

        // GET: api/films
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Film>>> GetFilms()
        {
            var films = await _filmService.GetAllFilmsAsync();
            return Ok(films);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Film>> GetFilmById(int id)
        {
            var film = await _filmService.GetFilmByIdAsync(id);
            if (film == null)
            {
                return NotFound();
            }

            return Ok(film);
        }

        // POST: api/films
        // Доступно только админу
        [HttpPost]
        //[Authorize(Roles = "Admin")]
        public async Task<IActionResult> PostFilm(Film film)
        {
            // добавить обработку ошибок
            var createdFilm = await _filmService.AddFilmAsync(film);
            return Created();
        }

        // PUT: api/films/id
        // Доступно только админу
        [HttpPut("{id}")]
        // [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateFilm(int id, Film film)
        {
            var updatedFilm = await _filmService.UpdateFilmAsync(id, film);
            if (updatedFilm == null)
            {
                return NotFound();
            }

            return NoContent();
        }

        // DELETE: api/films/id
        // Доступно только админу
        [HttpDelete("{id}")]
        // [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteFilm(int id)
        {
            bool deleted = await _filmService.DeleteFilmAsync(id);
            if (!deleted)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
