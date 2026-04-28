using Microsoft.EntityFrameworkCore;
using SproutHub.Api.Data;

namespace Docman.DataServices
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<TblPlant> TblPlants { get; set; }
        public DbSet<TblMoistureReading> TblMoistureReadings { get; set; }
        
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }
    }
}
