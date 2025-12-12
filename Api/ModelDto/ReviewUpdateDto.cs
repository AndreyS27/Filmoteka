namespace Api.ModelDto
{
    public class ReviewUpdateDto
    {
        public string Title { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
        public int Rating { get; set; }
    }
}
