namespace SproutHub.Api.Data
{
    public class MoistureReadingDto
    {
        public required int Id { get; set; }
        public required int PlantId { get; set; }
        public required decimal MoistureReading { get; set; }
        public required DateTime Date { get; set; }
    }
}
