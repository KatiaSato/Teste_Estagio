# Sistema de Controle de Gastos Residenciais

Aplicação full stack desenvolvida para gerenciar pessoas e suas transações financeiras.

O sistema permite cadastrar e excluir pessoas, cadastrar transações de receita ou despesa e consultar o resumo financeiro individual de cada pessoa.

## Tecnologias utilizadas

### Backend

- C#
- ASP.NET Core Web API
- Entity Framework Core
- SQLite

### Frontend

- React
- TypeScript
- Vite
- CSS

## Funcionalidades

### Pessoas

- Cadastro de pessoas
- Listagem de pessoas
- Exclusão de pessoas
- Geração automática do identificador
- Exclusão das transações vinculadas ao excluir uma pessoa

### Transações

- Cadastro de receitas e despesas
- Listagem das transações de uma pessoa
- Geração automática do identificador
- Validação da existência da pessoa
- Validação de valores e campos obrigatórios
- Pessoas menores de 18 anos podem cadastrar somente despesas

### Resumo financeiro

- Total de receitas da pessoa selecionada
- Total de despesas da pessoa selecionada
- Saldo calculado pela diferença entre receitas e despesas

## Persistência dos dados

Os dados são armazenados em um banco SQLite por meio do Entity Framework Core.

Dessa forma, as informações permanecem disponíveis mesmo após o encerramento da aplicação.

## Estrutura do projeto

O backend foi organizado utilizando:

- **Models:** representam as entidades armazenadas no banco
- **Controllers:** recebem e respondem às requisições HTTP
- **Services:** concentram as validações e regras de negócio
- **DTOs:** representam objetos específicos retornados pela API
- **Data/AppDbContext:** configura o acesso ao banco de dados

O frontend utiliza componentes React e estados para controlar formulários, listagens, seleção de pessoas e comunicação com a API.

## Regra de negócio

Antes de cadastrar uma transação, o sistema consulta a pessoa informada.

Caso ela tenha menos de 18 anos e o tipo da transação seja `Receita`, o cadastro é recusado. Para menores de idade, somente transações do tipo `Despesa` são permitidas.

## Como executar o projeto

### Pré-requisitos

- .NET SDK
- Node.js
- npm

### Backend

Acesse a pasta do backend:

```bash
cd Backend
```

Restaure as dependências:

```bash
dotnet restore
```

Execute a API:

```bash
dotnet run
```

A API será iniciada no endereço configurado no arquivo `launchSettings.json`.

Neste projeto, o endereço utilizado pelo frontend é:

```text
http://localhost:5221
```

### Frontend

Em outro terminal, acesse a pasta do frontend:

```bash
cd Frontend
```

Instale as dependências:

```bash
npm install
```

Execute o projeto:

```bash
npm run dev
```

O frontend ficará disponível normalmente em:

```text
http://localhost:5173
```

## Observações

A aplicação possui validações no frontend e no backend, tratamento de erros e confirmação antes da exclusão de pessoas.

O frontend precisa que a API esteja em execução para realizar as operações de cadastro, listagem, exclusão e consulta.

## Autora

Desenvolvido por Katia.
