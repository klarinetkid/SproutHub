using Docman.DataServices;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SproutHub.Api.Data;

namespace SproutHub.Api.Controllers
{
    public class MoistureReadingsController : Controller
    {
        private ApplicationDbContext db;
        public MoistureReadingsController(ApplicationDbContext db)
        {
            this.db = db;
        }

        [HttpGet]
        [Route("api/readings")]
        public ActionResult<TblMoistureReading[]> Get(int? plantId, DateTime? from)
        {
            if (plantId == null || from == null) return BadRequest();

            return db.TblMoistureReadings
                .Where(e => e.PlantId == plantId.Value && e.Date >= from.Value)
                .OrderBy(e => e.Date).ToArray();
        }

        [HttpPost]
        [Route("api/readings")]
        public ActionResult Post(TblMoistureReading reading)
        {
            if (reading.PlantId == 0) return BadRequest("PlantId is required");
            if (reading.MoistureReading == 0) return BadRequest("MoistureReading is required");

            using (var transaction = db.Database.BeginTransaction())
            {
                TblPlant? plant = db.TblPlants.Find(reading.PlantId);
                if (plant == null)
                {
                    plant = new TblPlant() { Id = reading.PlantId };
                    db.TblPlants.Add(plant);
                    db.SaveChanges();
                }

                reading.Plant = plant;
                reading.Date = DateTime.UtcNow;
                db.TblMoistureReadings.Add(reading);
                db.SaveChanges();

                transaction.Commit();
            }
            
            return NoContent();
        }
    }
}
