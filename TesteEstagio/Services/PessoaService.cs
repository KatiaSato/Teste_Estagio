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

        // Listar todas as pessoas cadastradas no banco de dados
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
            //confirma a adição da pessoa no banco de dados
            _context.SaveChanges();

            return pessoa;
        }

        //localiza a pessoa pelo id e atualiza os dados no banco de dados
        public void Excluir(int id) {
            var pessoa = _context.Pessoas.Find(id);
            if (pessoa == null)
            {
                throw new ArgumentException("Pessoa não encontrada.");
            }

            _context.Pessoas.Remove(pessoa);
            _context.SaveChanges();
        }
    }
}