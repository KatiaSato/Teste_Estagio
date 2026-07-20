import {useEffect, useState} from 'react'
import './App.css'


function App() {
    const [nome, setNome] = useState("");
    const [idade, setIdade] = useState("");
    const [descricao, setDescricao] = useState("");
    const [valor, setValor] = useState("");
    const [tipo, setTipo] = useState("Despesa");
    const [pessoas, setPessoas] = useState<Pessoa[]>([]);
    const [transacoes, setTransacoes] = useState<Transacao[]>([]);
    const [resumo, setResumo] = useState<ResumoFinanceiro | null>(null);
    const [pessoaSelecionada, setPessoaSelecionada] = useState<Pessoa | null>(null);
    interface Pessoa {
        id: number;
        nome: string;
        idade: number;
    }

    interface Transacao {
        id: number;
        descricao: string;
        valor: number;
        tipo: string;
        pessoaId: number;
    }

    interface ResumoFinanceiro {
        receitas: number;
        despesas: number;
        saldo: number;
    }

    const cadastrar = async () => {
        const resposta = await fetch("http://localhost:5221/api/Pessoa", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome,
                idade: Number(idade)
            })
        });
        console.log(resposta);
        await listarPessoas();
        setNome("");
        setIdade("");
    }

    //fetch() busca na API
    //await resposta.json() transforma o JSON em um objeto JavaScript
    const listarPessoas = async () => {
        const resposta = await fetch("http://localhost:5221/api/Pessoa");
        const dados = await resposta.json();
        console.log(dados);
        setPessoas(dados);
    }
    useEffect(() => {
        listarPessoas();
    }, []);

    useEffect(() => {
        if (pessoaSelecionada != null) {
            listarTransacoes();
            buscarResumo();
        }
    }, [pessoaSelecionada]);

    const excluirPessoa = async (id: number) => {
        await fetch(`http://localhost:5221/api/Pessoa/${id}`, {
            method: "DELETE"
        });
        listarPessoas();
    }

    const cadastrarTransacao = async () => {
        console.log({
            descricao,
            valor,
            tipo,
            pessoaId: pessoaSelecionada!.id
        });
        const resposta = await fetch("http://localhost:5221/api/Transacao", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                descricao: descricao,
                valor: Number(valor),
                tipo: tipo,
                pessoaId: pessoaSelecionada!.id
            })
        });
        console.log("Status: ", resposta.status);
        console.log(resposta);
        const mensagem = await resposta.text();
        console.log("mensagem:", mensagem);
        setDescricao("");
        setValor("");
        setTipo("Despesa");
        if (!resposta.ok) {
            alert(mensagem);
            return;
        }
    }

    const listarTransacoes = async () => {
        const resposta = await fetch(`http://localhost:5221/api/Transacao/${pessoaSelecionada!.id}`);
        const dados = await resposta.json();

        console.log(dados);
        setTransacoes(dados);
    }

    const buscarResumo = async () => {
        const resposta = await fetch(`http://localhost:5221/api/Transacao/resumo/${pessoaSelecionada!.id}`);

        if (!resposta.ok) {
            const mensagem = await resposta.text();
            console.error("Erro ao buscar resumo:", mensagem);
            return;
        }

        const dados = await resposta.json();
        
        console.log("Resumo:", dados);
        setResumo(dados);
    }
    if (pessoaSelecionada == null) {
        return (
            <div>
                <h1>Cadastro de Pesoas</h1>
                <input
                    type="text"
                    placeholder="Nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Idade"
                    value={idade}
                    onChange={(e) => setIdade(e.target.value)}
                />
                <br/>
                <br/>

                <button onClick={cadastrar}>
                    Cadastrar
                </button>
                <hr/>
                <h2>Pessoas cadastradas</h2>
                {
                    pessoas.map((pessoa) => (
                        <div key={pessoa.id}>
                            <strong>{pessoa.nome}</strong>
                            - {pessoa.idade} anos

                            <button onClick={() => {
                                console.log(pessoa);
                                setPessoaSelecionada(pessoa);
                            }}>
                                Transações
                            </button>
                            {" "}
                            <button onClick={() => excluirPessoa(pessoa.id)}>
                                Excluir
                            </button>
                        </div>
                    ))}
            </div>
        );
    }
    return (
        <div>
            <h1>Transações</h1>

            <h2>{pessoaSelecionada!.nome}</h2>

            <input
                type="text"
                placeholder="Descrição"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
            />
            <br/>
            <br/>
            <input
                type="number"
                placeholder="Valor"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
            />
            <br/>
            <br/>

            <label>
                <input
                    type="radio"
                    value="Receita"
                    checked={tipo === "Receita"}
                    onChange={(e) => setTipo(e.target.value)}
                />
                Receita
            </label>
            <label>
                <input
                    type="radio"
                    value="Despesa"
                    checked={tipo === "Despesa"}
                    onChange={(e) => setTipo(e.target.value)}
                />
                Despesa
            </label>
            <br/>
            <br/>

            <button onClick={cadastrarTransacao}>
                Cadastrar Transação
            </button>
            <button onClick={() =>
                setPessoaSelecionada(null)}>
                Voltar
            </button>
            <hr/>
            <h3>Transações</h3>
            {
                transacoes.map((transacao) => (
                        <div key={transacao.id}>
                            <strong>{transacao.descricao} </strong>

                            {" - "}

                            R$ {transacao.valor}

                            {" - "}

                            {transacao.tipo}


                        </div>

                    )
                )

            }
            <br />
            <br />
            <hr/>
            <h3>Resumo Financeiro</h3>
            <p>
                <strong>Receitas:</strong> R$ {resumo?.receitas}
            </p>
            <p>
                <strong>Despesas:</strong> R$ {resumo?.despesas}
            </p>
            <p>
                <strong>Saldo:</strong> R$ {resumo?.saldo}
            </p>

        </div>
    );
}

export default App

