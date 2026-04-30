using Docman.DataServices;
using Microsoft.AspNetCore.Mvc;
using SproutHub.Api.Data;

namespace SproutHub.Api.Controllers
{
    public class PlantsController : Controller
    {
        private ApplicationDbContext db;
        public PlantsController(ApplicationDbContext db)
        {
            this.db = db;
        }

        [HttpGet]
        [Route("api/plants")]
        public ActionResult<VwPlant[]> GetList()
        {
            return db.VwPlants.OrderBy(e => e.DisplayName).ToArray();
        }

        [HttpPut]
        [Route("api/plants")]
        public ActionResult Put(TblPlant plant)
        {
            TblPlant? existing = db.TblPlants.Find(plant.Id);
            if (existing == null) return NotFound();

            existing.DisplayName = plant.DisplayName;

            db.TblPlants.Update(existing);
            db.SaveChanges();
            return NoContent();
        }
    }
}
