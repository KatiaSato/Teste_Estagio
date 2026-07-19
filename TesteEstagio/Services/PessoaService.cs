using System;
using TesteEstagio.Data;
using TesteEstagio.Models;

namespace TesteEstagio.Services
{
    public class PessoaService
    {
        private readonly AppDbContext _context;
        public PessoaService(AppDbContext context)
        {
            _context = context;
        }
        public List<Pessoa> Listar()
        {
            return _context.Pessoas.ToList();
        }
        public Pessoa Adicionar(Pessoa pessoa)
        {
            if (String.IsNullOrWhiteSpace(pessoa.Nome))
            {
                throw new ArgumentException("O nome da pessoa é obrigatorio.");
            }
            if (pessoa.Idade < 0 || pessoa.Idade > 120)
            {
                throw new ArgumentException("Idade inválida");
            }

            _context.Pessoas.Add(pessoa);
            _context.SaveChanges();

            return pessoa;
        }

        public void Excluir(int id) {
            var pessoa = _context.Pessoas.Find(id);
            if (pessoa == null)
            {
                throw new ArgumentException("Pessoa não encontrada.");
            }

            //Remover tambem todas as transacoes da pessoa
            _context.Pessoas.Remove(pessoa);
            _context.SaveChanges();
        }
    }
}