using Microsoft.EntityFrameworkCore;
using TesteEstagio.Models;

namespace TesteEstagio.Data
{
    public class AppDbContext : DbContext
    {
        //DbContext representa a conexão com o banco de dados 
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }
        //Cada DbSet representa uma tabela no banco de dados, e cada entidade representa uma linha nessa tabela.
        public DbSet<Pessoa> Pessoas { get; set; }
        public DbSet<Transacao> Transacoes { get; set; }

    }
}
