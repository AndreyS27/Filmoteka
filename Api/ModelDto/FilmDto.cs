namespace Api.ModelDto
{
    public class FilmDto
    {
        public string Name { get; set; } = string.Empty;
        public int Year { get; set; }
        public TimeSpan Duration { get; set; }
        public string Country { get; set; } = string.Empty;
        public string Genre { get; set; } = string.Empty;
        public string Director { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? PosterPath { get; set; }
    }
}
