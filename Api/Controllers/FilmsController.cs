using Api.Interfaces;
using Api.ModelDto;
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
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PostFilm([FromBody] FilmDto createFilm)
        {
            var film = new Film
            {
                Name = createFilm.Name,
                Year = createFilm.Year,
                Duration = createFilm.Duration,
                Country = createFilm.Country,
                Genre = createFilm.Genre,
                Director = createFilm.Director,
                Description = createFilm.Description,
                PosterPath = createFilm.PosterPath
            };

            var createdFilm = await _filmService.AddFilmAsync(film);
            return CreatedAtAction(nameof(GetFilmById), new {id = createdFilm.Id}, createdFilm);
        }

        // PUT: api/films/id
        // Доступно только админу
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateFilm(int id, FilmDto film)
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
        [Authorize(Roles = "Admin")]
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
