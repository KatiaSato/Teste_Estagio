using System.Text.Json.Serialization;

namespace TesteEstagio.Models
{
    public class Transacao
    {
        public int Id { get; set; }
        public string Descricao { get; set; } = string.Empty;
        /*decimal é o tipo de dado para valores monetários, nunca use float ou double */
        public decimal Valor { get; set; }
        public string Tipo { get; set; } = string.Empty;
        /*Chave estrangeira para a pessoa associada à transação. */
        public int PessoaId { get; set; }
        [JsonIgnore]
        /*Guarda o objeto inteiro da pessoa que realizou a transação*/
        public Pessoa? Pessoa { get; set; }
    }
}
