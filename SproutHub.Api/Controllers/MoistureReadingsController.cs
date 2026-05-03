using Docman.DataServices;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SproutHub.Api.Data;

namespace SproutHub.Api.Controllers
{
    public class MoistureReadingsController : Controller
    {
        private static int dryValue = 450;
        private static int wetValue = 120;

        private ApplicationDbContext db;
        public MoistureReadingsController(ApplicationDbContext db)
        {
            this.db = db;
        }

        [HttpGet]
        [Route("api/readings")]
        public ActionResult<MoistureReadingDto[]> Get(int? plantId, DateTime? from)
        {
            if (plantId == null || from == null) return BadRequest();

            return db.TblMoistureReadings
                .Where(e => e.PlantId == plantId.Value && e.Date >= from.Value)
                .OrderBy(e => e.Date)
                .Select(ToMoistureReadingDto)
                .ToArray();
        }

        [HttpPost]
        [Route("api/readings")]
        public ActionResult Post(int? plantId, int? rawValue)
        {
            if (plantId == null) return BadRequest("PlantId is required");
            if (rawValue == null) return BadRequest("RawValue is required");

            using (var transaction = db.Database.BeginTransaction())
            {
                TblPlant? plant = db.TblPlants.Find(plantId.Value);
                if (plant == null)
                {
                    plant = new TblPlant() { Id = plantId.Value };
                    db.TblPlants.Add(plant);
                    db.SaveChanges();
                }

                TblMoistureReading reading = new()
                {
                    Plant = plant,
                    PlantId = plant.Id,
                    Date = DateTime.UtcNow,
                    MoistureReading = (decimal)moisturePercent(rawValue.Value),
                };

                db.TblMoistureReadings.Add(reading);
                db.SaveChanges();

                transaction.Commit();
            }
            
            return NoContent();
        }

        private MoistureReadingDto ToMoistureReadingDto(TblMoistureReading reading)
        {
            return new MoistureReadingDto()
            {
                MoistureReading = reading.MoistureReading,
                Date = reading.Date
            };
        }
        private double moisturePercent(int reading)
        {
            double raw = Math.Min(Math.Max(reading, wetValue), dryValue);
            return Math.Round((raw - dryValue) * (100.0) / (wetValue - dryValue), 2);
        }
    }
}
