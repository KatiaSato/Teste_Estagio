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
                    R$ {transacao.valor}
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
        <strong>Receitas:</strong>
        {" "}
        R$ {resumo?.receitas}
    </p>

    <p>
        <strong>Despesas:</strong>
        {" "}
        R$ {resumo?.despesas}
    </p>

    <p>
        <strong>Saldo:</strong>
        {" "}
        R$ {resumo?.saldo}
    </p>

</section>
        </div>
    );
}

export default App

