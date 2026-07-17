using System;
using TesteEstagio.Data;
using TesteEstagio.Models;

namespace TesteEstagio.Services
{
    public class PessoaService
    {
        public List<Pessoa> Listar()
        {
            return FakeDatabase.Pessoas;
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
            if (FakeDatabase.Pessoas.Count == 0)
            {
                pessoa.Id = 1;   
            }
            else
            {
                pessoa.Id = FakeDatabase.Pessoas.Max(p => p.Id) + 1;
            }

            FakeDatabase.Pessoas.Add(pessoa);

            return pessoa;
        }

        public void Excluir(int id) {
            var pessoa = FakeDatabase.Pessoas.Find(p => p.Id == id);
            if (pessoa == null)
            {
                throw new ArgumentException("Pessoa não encontrada.");
            }

            //Remover tambem todas as transacoes da pessoa
            FakeDatabase.Pessoas.Remove(pessoa);
        }
    }
}