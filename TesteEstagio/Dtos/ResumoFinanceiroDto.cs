namespace TesteEstagio.Dtos
{
    public class ResumoFinanceiroDto
    {
        public decimal Receitas { get; set; }
        public decimal Despesas { get; set; }
        public decimal Saldo { get; set; } = 0;
    }
}
