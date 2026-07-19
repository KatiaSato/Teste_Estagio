using Microsoft.EntityFrameworkCore;
using TesteEstagio.Data;
using TesteEstagio.Dtos;
using TesteEstagio.Models;

namespace TesteEstagio.Services
{
    public class TransacaoService
    {
        private readonly AppDbContext _context;
        public TransacaoService(AppDbContext context)
        {
            _context = context;
        }
        public Transacao Adicionar(Transacao transacao)
        {
            var pessoa = _context.Pessoas.Find(transacao.PessoaId);
            if (pessoa == null)
            {
                throw new ArgumentException("Pessoa não encontrada.");
            }
            if (pessoa.Idade < 18 && transacao.Tipo == "Receita")
                
                {
                    throw new ArgumentException("Pessoa menor de idade não pode cadastrar receitas.");
                }
            pessoa.Transacoes.Add(transacao);
            _context.SaveChanges();
            return transacao;
        }

        public ResumoFinanceiroDto ObterResumo(int pessoaId)
        {
            var pessoa = _context.Pessoas.Include(p => p.Transacoes).FirstOrDefault(p => p.Id == pessoaId);
            if (pessoa == null)
            {
                throw new ArgumentException("Pessoa não encontrada.");
            }
            var total = new ResumoFinanceiroDto
            {
                Receitas = pessoa.Transacoes.Where(t => t.Tipo == "Receita").Sum(t => t.Valor),
                Despesas = pessoa.Transacoes.Where(t => t.Tipo == "Despesa").Sum(t => t.Valor),
                Saldo = pessoa.Transacoes.Where(t => t.Tipo == "Receita").Sum(t => t.Valor) 
                - pessoa.Transacoes.Where(t => t.Tipo == "Despesa").Sum(t => t.Valor)
            };
            return total;
        }

    }

}
