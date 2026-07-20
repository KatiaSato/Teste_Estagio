import { useEffect, useState } from 'react'
import './App.css'


function App() {
    //Responsaveis pelos campos do formulário 
    const [nome, setNome] = useState("");
    const [idade, setIdade] = useState("");
    const [descricao, setDescricao] = useState("");
    const [valor, setValor] = useState("");
    const [tipo, setTipo] = useState("Despesa");
    //Armazena e lista que retornou pela API
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
        const nomeFormatado = nome.trim();
        const idadeConvertida = Number(idade);
        const idadeFormatada = idade.trim();

        if (!nomeFormatado) {
            alert("Informe o nome da pessoa.");
            return;
        }

        if (nomeFormatado.length < 2) {
            alert("O nome deve possuir pelo menos 2 caracteres.");
            return;
        }

        if (!idade) {
            alert("Informe a idade da pessoa.");
            return;
        }

        if (!idadeFormatada) {
            alert("Informe a idade.");
            return;
        }

        //faz aceitar somente numeros inteiros
        if (!/^\d+$/.test(idadeFormatada)) {
            alert("A idade deve ser um número inteiro.");
            return;
        }

        if (!Number.isInteger(idadeConvertida)) {
            alert("A idade deve ser um número inteiro.");
            return;
        }

        if (idadeConvertida < 0 || idadeConvertida > 130) {
            alert("Informe uma idade entre 0 e 130 anos.");
            return;
        }
        setNome("");
        setIdade("");

        try {
            const resposta = await fetch("http://localhost:5221/api/Pessoa", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome: nomeFormatado,
                    idade: idadeConvertida
                })
            });

            if (!resposta.ok) {
                const mensagem = await resposta.text();

                throw new Error(
                    mensagem || "Não foi possível cadastrar a pessoa."
                );
            }

            await listarPessoas();

            setNome("");
            setIdade("");
        } catch (erro) {
            console.error("Erro ao cadastrar pessoa:", erro);

            const mensagem =
                erro instanceof Error
                    ? erro.message
                    : "Ocorreu um erro inesperado.";

            alert(mensagem);
        }
    };

    //fetch() busca na API
    //await resposta.json() transforma o JSON em um objeto JavaScript
    const listarPessoas = async () => {
        const resposta = await fetch("http://localhost:5221/api/Pessoa");
        const dados = await resposta.json();
        console.log(dados);
        setPessoas(dados);
    }
    //executa a listagem de pessoas quando o componente é carregado
    useEffect(() => {
        listarPessoas();
    }, []);

    //Atualiza as transações e o resumo sempre que outra a pessoa é selecionada
    useEffect(() => {
        if (pessoaSelecionada != null) {
            listarTransacoes();
            buscarResumo();
        }
    }, [pessoaSelecionada]);

    const excluirPessoa = async (id: number) => {
        const confirmar = window.confirm(
            "Deseja realmente excluir esta pessoa? Todas as transações dela também serão excluídas."
        );

        if (!confirmar) {
            return;
        }

        try {
            const resposta = await fetch(
                `http://localhost:5221/api/Pessoa/${id}`,
                {
                    method: "DELETE"
                }
            );

            if (!resposta.ok) {
                const mensagem = await resposta.text();

                throw new Error(
                    mensagem || "Não foi possível excluir a pessoa."
                );
            }

            await listarPessoas();
        } catch (erro) {
            console.error("Erro ao excluir pessoa:", erro);

            alert(
                erro instanceof Error
                    ? erro.message
                    : "Ocorreu um erro ao excluir a pessoa."
            );
        }
    };

    const cadastrarTransacao = async () => {
        const descricaoFormatada = descricao.trim();
        const valorConvertido = Number(valor);

        if (!descricaoFormatada) {
            alert("Informe a descrição.");
            return;
        }

        if (!valor) {
            alert("Informe o valor.");
            return;
        }

        if (valorConvertido <= 0) {
            alert("O valor deve ser maior que zero.");
            return;
        }

        if (!pessoaSelecionada) {
            alert("Selecione uma pessoa.");
            return;
        }

        console.log({
            descricao,
            valor,
            tipo,
            pessoaId: pessoaSelecionada!.id
        });

        try {
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
            await listarTransacoes();
            await buscarResumo();
            if (!resposta.ok) {
                alert(mensagem);
                return;
            }
        } catch (erro) {
            console.error("Erro ao cadastrar a transação:", erro);

            const mensagem =
                erro instanceof Error
                    ? erro.message
                    : "Ocorreu um erro inesperado.";

            alert(mensagem);
        }

    };

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
            <div className="app-container">
                <header className="page-header">
                    <h1>Controle Financeiro</h1>
                    <p>Gerencie pessoas e suas transações.</p>
                </header>
                <section className="panel">
                    <h2 className="panel-title">Cadastro de Pessoas</h2>

                    <div className="form-group">

                        <label>Nome</label>

                        <input
                            type="text"
                            placeholder="Digite o nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />

                    </div>

                    <div className="form-group">

                        <label>Idade</label>

                        <input
                            type="number"
                            placeholder="Digite a idade"
                            step="1"
                            min="0"
                            value={idade}
                            onChange={(e) => setIdade(e.target.value)}
                        />

                    </div>

                    <button onClick={cadastrar}>
                        Cadastrar
                    </button>
                </section>

                <section className="panel">

                    <h2 className="panel-title">Pessoas cadastradas</h2>

                    {
                        /* O map percorre a lista e cria um elemento visual para cada pessoa. */
                        pessoas.map((pessoa) => (

                            <div className="person-item" key={pessoa.id}>

                                <div className="person-info">

                                    <strong>{pessoa.nome}</strong>

                                    <span>{pessoa.idade} anos</span>

                                </div>

                                <div className="button-group">

                                    <button
                                        onClick={() => {
                                            console.log(pessoa);
                                            setPessoaSelecionada(pessoa);
                                        }}
                                    >
                                        Transações
                                    </button>

                                    <button
                                        className="button-danger"
                                        onClick={() => excluirPessoa(pessoa.id)}
                                    >
                                        Excluir
                                    </button>

                                </div>

                            </div>

                        ))
                    }

                </section>
            </div>
        );
    }
    //Formata o numero de acordo com o padrão monetério brasileiro
    const formatarMoeda = (valor: number) => {
        return valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    };
    return (
        <div className="app-container">
            <header className="page-header">
                <h1>Transações</h1>
                <p>Movimentações de {pessoaSelecionada!.nome}</p>
            </header>
            <section className="panel">
                <h2 className="panel-title">Cadastrar transação</h2>

                <div className="form-group">

                    <label>Descrição</label>

                    <input
                        type="text"
                        placeholder="Digite a descrição"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                    />

                </div>
                <div className="form-group">

                    <label>Valor</label>

                    <input
                        type="number"
                        placeholder="0,00"
                        value={valor}
                        onChange={(e) => setValor(e.target.value)}
                    />

                </div>

                <div className="form-group">

                    <label>Tipo</label>

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

                </div>

                <div className="button-group">
                    <button onClick={cadastrarTransacao}>
                        Cadastrar Transação
                    </button>

                    <button
                        className="button-secondary"
                        onClick={() => setPessoaSelecionada(null)}
                    >
                        Voltar
                    </button>
                </div>
            </section>
            <section className="panel">

                <h2 className="panel-title">
                    Transações
                </h2>

                {
                    transacoes.map((transacao) => (

                        <div
                            className="person-item"
                            key={transacao.id}
                        >

                            <div className="person-info">

                                <strong>{transacao.descricao}</strong>

                                <span>
                                    {transacao.tipo}
                                </span>

                            </div>

                            <strong>
                                {formatarMoeda(transacao.valor)}
                            </strong>

                        </div>

                    ))
                }

            </section>
            <section className="panel">

                <h2 className="panel-title">
                    Resumo Financeiro
                </h2>

                <p>
                    <strong>Receitas:</strong>{" "}
                    {formatarMoeda(resumo?.receitas ?? 0)}
                </p>

                <p>
                    <strong>Despesas:</strong>{" "}
                    {formatarMoeda(resumo?.despesas ?? 0)}
                </p>

                <p>
                    <strong>Saldo:</strong>{" "}
                    <span
                        style={{
                            color: (resumo?.saldo ?? 0) >= 0
                                ? "#22c55e"
                                : "#ef4444",
                            fontWeight: "bold"
                        }}
                    >
                        {formatarMoeda(resumo?.saldo ?? 0)}
                    </span>
                </p>

            </section>
        </div>

    );

}

export default App

