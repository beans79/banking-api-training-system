# Banking API Training System - Cypress Tests

Este projeto contém testes de API automatizados para o sistema bancário de treinamento, utilizando Cypress para testes de endpoints CRUD.

## Pré-requisitos

- Node.js (versão 14 ou superior)
- npm
- API do sistema bancário rodando em `http://localhost:3000` (consulte a documentação da API em http://localhost:3000/api-docs/)

## Instalação

1. Clone o repositório:
   ```bash
   git clone <url-do-repo>
   cd banking-api-training-system/cypress-api
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

## Executando os Testes

### Modo Interativo (GUI)
Para executar os testes em modo interativo com interface gráfica:
```bash
npm run cypress:open
```

### Modo Headless (Linha de Comando)
Para executar todos os testes em modo headless:
```bash
npm run cypress:run
```

Para executar um arquivo específico:
```bash
npx cypress run --spec cypress/e2e/crud.cy.js
```

## Estrutura dos Testes

Os testes estão localizados em `cypress/e2e/`. Atualmente, há testes para operações CRUD da API de contas:

- `crud.cy.js`: Testes independentes para CREATE, READ, UPDATE e DELETE

## Criando Novos Testes

### Estrutura Básica de um Teste

1. Crie um novo arquivo em `cypress/e2e/`, por exemplo: `transactions.cy.js`

2. Use a estrutura básica do Cypress:

```javascript
describe("Nome do Grupo de Testes", () => {
  it("Descrição do teste", () => {
    // Seu código de teste aqui
  })
})
```

### Fazendo Requisições HTTP

Use `cy.request()` para interagir com a API:

```javascript
// GET
cy.request('/endpoint').then((response) => {
  expect(response.status).to.eq(200)
  // Verificações
})

// POST
cy.request({
  method: 'POST',
  url: '/endpoint',
  headers: { 'Content-Type': 'application/json' },
  body: { /* dados */ }
}).then((response) => {
  expect(response.status).to.eq(201)
})

// PUT
cy.request({
  method: 'PUT',
  url: '/endpoint/id',
  headers: { 'Content-Type': 'application/json' },
  body: { /* dados atualizados */ }
})

// DELETE
cy.request({
  method: 'DELETE',
  url: '/endpoint/id'
})
```

### Boas Práticas

- **Testes Independentes**: Cada teste deve ser autossuficiente, criando e limpando seus próprios dados.
- **Dados Únicos**: Use funções para gerar dados únicos (como CPF) para evitar conflitos.
- **Limpeza**: Sempre limpe os dados criados após o teste.
- **Verificações**: Verifique status codes, corpo da resposta e comportamentos esperados.
- **FailOnStatusCode**: Para verificar erros (como 404), use `failOnStatusCode: false`.

### Exemplo Completo

```javascript
describe("Transações", () => {
  const generateUniqueCpf = () => `123.456.789-${Date.now()}-${Math.floor(Math.random() * 1000)}`

  it("Deve depositar dinheiro", () => {
    const cpf = generateUniqueCpf()

    // Criar conta
    cy.request({
      method: "POST",
      url: "/accounts",
      headers: { "Content-Type": "application/json" },
      body: {
        name: "Test User",
        email: "test@example.com",
        cpf: cpf,
        initialBalance: 1000
      }
    }).then((createResponse) => {
      const accountId = createResponse.body.id

      // Depositar
      cy.request({
        method: "POST",
        url: `/accounts/${accountId}/deposit`,
        headers: { "Content-Type": "application/json" },
        body: { amount: 500 }
      }).then((depositResponse) => {
        expect(depositResponse.status).to.eq(200)
        expect(depositResponse.body.balance).to.eq(1500)
      })

      // Limpar
      cy.request({ method: "DELETE", url: `/accounts/${accountId}` })
    })
  })
})
```

## Documentação da API

Consulte a documentação completa da API em: http://localhost:3000/api-docs/

## Contribuição

1. Crie uma branch para sua feature
2. Adicione testes para novas funcionalidades
3. Execute todos os testes antes de fazer commit
4. Faça pull request

## Licença

[Adicione licença se aplicável]</content>
<parameter name="filePath">c:\Users\bruno\Documents\GitHub\banking-api-training-system\cypress-api\README.md