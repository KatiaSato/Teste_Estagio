using TesteEstagio.Data;
using TesteEstagio.Dtos;
using TesteEstagio.Models;

namespace TesteEstagio.Services
{
    public class TransacaoService
    {
        public Transacao Adicionar(Transacao transacao)
        {
            var pessoa = FakeDatabase.Pessoas.Find(p => p.Id == transacao.PessoaId);
            if (pessoa == null)
            {
                throw new ArgumentException("Pessoa não encontrada.");
            }
            if (pessoa.Idade < 18 && transacao.Tipo == "Receita")
                
                {
                    throw new ArgumentException("Pessoa menor de idade não pode cadastrar receitas.");
                }

            if (!pessoa.Transacoes.Any())
            {
                transacao.Id = 1;
            }
            else
            {
                transacao.Id = pessoa.Transacoes.Max(t => t.Id) + 1;
            }
            pessoa.Transacoes.Add(transacao);
            return transacao;
        }

        public ResumoFinanceiroDto ObterResumo(int pessoaId)
        {
            var pessoa = FakeDatabase.Pessoas.Find(p => p.Id == pessoaId);
            if (pessoa == null)
            {
                throw new ArgumentException("Pessoa não encontrada.");
            }
            var total = new ResumoFinanceiroDto
            {
                Receitas = pessoa.Transacoes.Where(t => t.Tipo == "Receita").Sum(t => t.Valor),
                Despesas = pessoa.Transacoes.Where(t => t.Tipo == "Despesa").Sum(t => t.Valor),
                Saldo = pessoa.Transacoes.Where(t => t.Tipo == "Receita").Sum(t => t.Valor) - pessoa.Transacoes.Where(t => t.Tipo == "Despesa").Sum(t => t.Valor)
            };
            return total;
        }

    }

}
