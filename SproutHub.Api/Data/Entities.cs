using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;

namespace SproutHub.Api.Data
{
    [Table("TblPlants")]
    public class TblPlant
    {
        public int Id { get; set; }
        public string? DisplayName { get; set; }
    }

    [Table("TblMoistureReadings")]
    public class TblMoistureReading
    {
        public int Id { get; set; }
	    public int PlantId { get; set; }
        public TblPlant? Plant { get; set; }
        public decimal MoistureReading { get; set; }
        public DateTime Date { get; set; }
    }
}