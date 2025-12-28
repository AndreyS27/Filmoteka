using Api.Data;
using Api.Interfaces;
using Api.ModelDto;
using Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositories
{
    public class ReviewRepository : IReviewRepository
    {
        private readonly ApplicationDbContext _context;

        public ReviewRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Review> AddReviewAsync(Review review)
        {
            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();
            return await _context.Reviews
                .Include(r => r.User)
                .FirstAsync(r => r.Id == review.Id);
        }

        public async Task<bool> DeleteReviewAsync(int id)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null)
            {
                return false;
            }

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Review?> GetReviewByIdAsync(int id)
        {
            return await _context.Reviews
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<IEnumerable<Review>> GetReviewsForFilmAsync(int filmId)
        {
            return await _context.Reviews
                .Include(r => r.User)
                .Where(r => r.FilmId == filmId)
                .ToListAsync();
        }

        public async Task<Review?> UpdateReviewAsync(int reviewId, string title, string text, int rating)
        {
            var review = await _context.Reviews.FindAsync(reviewId);
            if (review == null) return null;

            review.Title = title;
            review.Text = text;
            review.Rating = rating;

            await _context.SaveChangesAsync();
            return review;
        }

        public async Task<IEnumerable<Review>> GetReviewByUserIdAsync(int userId)
        {
            return await _context.Reviews
                .Include(r => r.Film)
                .Where(r => r.UserId == userId)
                .ToListAsync();
        }

        public async Task<double> GetAverageRatingByFilmIdAsync(int filmId)
        {
            var average = await _context.Reviews
                .Where(r => r.FilmId == filmId)
                .AverageAsync(r => (double?)r.Rating);

            return average ?? 0.0;
        }

        public async Task<int> GetTotalReviewsByFilmIdAsync(int filmId)
        {
            return await _context.Reviews
                .CountAsync(r => r.FilmId == filmId);
        }
    }
}
