using Microsoft.EntityFrameworkCore;
using TesteEstagio.Models;

namespace TesteEstagio.Data
{
    public class AppDbContext : DbContext
    {

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }
        public DbSet<Pessoa> Pessoas { get; set; }
        public DbSet<Transacao> Transacoes { get; set; }

    }
}
