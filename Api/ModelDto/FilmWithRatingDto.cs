namespace Api.ModelDto
{
    public class FilmWithRatingDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Year { get; set; }
        public TimeSpan Duration { get; set; }
        public string Country { get; set; } = string.Empty;
        public string Genre { get; set; } = string.Empty;
        public string Director { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? PosterPath { get; set; }
        public double AverageRating { get; set; }
        public int TotalReviews { get; set; }
    }
}
