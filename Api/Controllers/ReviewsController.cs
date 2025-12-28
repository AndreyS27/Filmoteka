using Api.Interfaces;
using Api.ModelDto;
using Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using static Api.Exceptions.ReviewExceptions;

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
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int currentUserId))
            {
                return Unauthorized();
            }

            var reviewDto = await _reviewService.AddReviewAsync(currentUserId, filmId, createReviewDto);

            return CreatedAtAction(nameof(GetReviewById), new { id = filmId }, reviewDto);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ReviewDto>> GetReviewById(int id)
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
        public async Task<ActionResult<ReviewUpdateDto>> Update([FromBody] ReviewUpdateDto dto, int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int currentUserId))
            {
                return Unauthorized();
            }

            try
            {
                var updatedReview = await _reviewService.UpdateReviewAsync(id, currentUserId, dto);
                return Ok(updatedReview);
            }
            catch (ReviewNotFoundException)
            {
                return NotFound();
            }
            catch (UnauthorizedReviewEditException)
            {
                return Forbid();
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int currentUserId))
            {
                return Unauthorized();
            }

            bool res = await _reviewService.DeleteReviewAsync(id);
            if (res) return NoContent();
            return NotFound();
        }

        [HttpGet("myreviews")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<UserReviewDto>>> GetReviewByUserId()
        {
            var id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(id) || !int.TryParse(id, out int currentUserId))
            {
                return Unauthorized();
            }

            var reviews = await _reviewService.GetReviewByUserIdAsync(currentUserId);

            return Ok(reviews);
        }

        [HttpGet("average-rating/{filmId}")]
        public async Task<ActionResult<AverageRatingDto>> GetAverageRating(int filmId)
        {
            if (filmId <= 0)
                return BadRequest("Неверный ID фильма");

            var averageRating = await _reviewService.GetAverageRatingByFilmIdAsync(filmId);
            return Ok(averageRating);
        }
    }
}
