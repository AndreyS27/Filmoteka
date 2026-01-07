using Api.Interfaces;
using Api.ModelDto;
using Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

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

        [HttpGet("filters")]
        public async Task<ActionResult> GetFilters()
        {
            var films = await _filmService.GetAllFilmsAsync();

            var countries = films.SelectMany(f => f.Country.Split(','))
                .Select(c => c.Trim())
                .Distinct()
                .OrderBy(c => c)
                .ToList();

            var genres = films.SelectMany(f => f.Genre.Split(','))
                .Select(g => g.Trim())
                .Distinct()
                .OrderBy(g => g)
                .ToList();

            return Ok(new { countries, genres });
        }

        [HttpGet("admin")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<Film>>> GetAllFilmsAsync()
        {
            var films = await _filmService.GetAllFilmsAsync();

            return Ok(films);
        }

        // GET: api/films
        //[HttpGet]
        //public async Task<ActionResult<IEnumerable<Film>>> GetFilms(
        //    [FromQuery] string? country = null,
        //    [FromQuery] string? genre = null,
        //    [FromQuery] string? sortBy = null)
        //{
        //    var films = await _filmService.GetFilmsWithRatingsAsync(country, genre, sortBy);
        //    return Ok(films);
        //}

        [HttpGet]
        public async Task<ActionResult<PagedResult<FilmWithRatingDto>>> GetFilms(
            [FromQuery] string? country = null,
            [FromQuery] string? genre = null,
            [FromQuery] string? sortBy = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;
            if (pageSize > 50) pageSize = 50;

            var result = await _filmService.GetFilmsPagedAsync(country, genre, sortBy, page, pageSize);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Film>> GetFilmById(int id)
        {
            var film = await _filmService.GetFilmByIdWithRatingAsync(id);
            if (film == null)
                return NotFound();

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

        [HttpPost("{filmId}/poster")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UploadPoster(int filmId, IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Файл не выбран");

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png" };
            var fileExtension = Path.GetExtension(file.FileName).ToLower();
            if (!allowedExtensions.Contains(fileExtension))
                return BadRequest("Неверный формат файла");

            var fileName = $"{Guid.NewGuid()}{fileExtension}";
            var filePath = Path.Combine("wwwroot", "uploads", "posters", fileName);

            Directory.CreateDirectory(Path.GetDirectoryName(filePath));

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var film = await _filmService.GetFilmByIdAsync(filmId);
            var filmDto = new FilmDto
            {
                Name = film.Name,
                Year = film.Year,
                Duration = film.Duration,
                Country = film.Country,
                Genre = film.Genre,
                Director = film.Director,
                Description = film.Description,
                PosterPath = $"/uploads/posters/{fileName}"
            };

            await _filmService.UpdateFilmAsync(filmId, filmDto);

            return Ok(new { posterUrl = film.PosterPath });
        }
    }
}
