using Api.Interfaces;
using Api.ModelDto;
using Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewsController : ControllerBase
    {
        private readonly IReviewService _reviewService;

        public ReviewsController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpGet("films/{filmId}")]
        public async Task<ActionResult<IEnumerable<ReviewDto>>> GetReviews(int filmId)
        {
            var reviews = await _reviewService.GetReviewsForFilmAsync(filmId);
            return Ok(reviews);
        }

        [HttpPost("films/{filmId}")]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] CreateReviewDto createReviewDto, int filmId)
        {
            var userId = User.FindFirst("nameid")?.Value;
            if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int currentUserId))
            {
                return Unauthorized();
            }

            var reviewDto = await _reviewService.AddReviewAsync(currentUserId, filmId, createReviewDto);

            return CreatedAtAction(nameof(GetReviewById), new { filmId = filmId }, reviewDto);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Review>> GetReviewById(int id)
        {
            var res = await _reviewService.GetReviewByIdAsync(id);
            if (res != null)
            {
                return Ok(res);
            }
            return NotFound();
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<Review>> Update([FromBody] ReviewDto dto, int id)
        {
            bool res = await _reviewService.UpdateReviewAsync(id, dto);
            if (res) return Ok();
            return NotFound();
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            bool res = await _reviewService.DeleteReviewAsync(id);
            if (res) return NoContent();
            return NotFound();
        }
    }
}
