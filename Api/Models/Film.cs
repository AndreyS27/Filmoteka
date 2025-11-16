namespace Api.Models
{
    public class Film
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Year { get; set; } 
        TimeSpan Duration { get; set; }
        public string Country { get; set; } = string.Empty;
        public string Genre { get; set; } = string.Empty;
        public string Director { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string PosterPath {  get; set; } = string.Empty;
    }
}
