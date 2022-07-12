using Microsoft.EntityFrameworkCore;
using System.Diagnostics.CodeAnalysis;

namespace GameListApi.Models
{
    public class GameListContext : DbContext
    {
        public GameListContext(DbContextOptions<GameListContext> options)
            : base(options)
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
     => options.UseSqlite("Data Source=DBFileName.db");

        public DbSet<GameItem> GameItems { get; set; } = null!;
    }
}