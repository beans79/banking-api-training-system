# 🏦 Banking API

## 📁 Estrutura do Projeto

```
banking-api/
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── db.js
│   └── routes/
│       └── accounts.js
├── frontend-web/
│   └── index.html
├── frontend-mobile/
│   └── index.html
└── README.md
```

---

## ✅ Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- [Postman](https://www.postman.com/downloads/) *(opcional, para testes de API)*

---

## 🚀 Como Instalar e Executar

### 1. Instalar as dependências

```bash
cd backend
npm install
```

### 2. Iniciar o servidor

```bash
npm run dev
```

> O servidor estará rodando em [**http://localhost:3000**](http://localhost:3000)

### 3. Abrir os frontends

Abrir diretamente no browser — **não precisa de servidor adicional**.

| Interface | Como abrir |
|---|---|
| Frontend Web (Desktop) | Abrir `frontend-web/index.html` no Chrome |
| Frontend Mobile | Abrir `frontend-mobile/index.html` no Chrome |

---

## 🔗 URLs do Sistema

| Recurso | URL |
|---|---|
| API | http://localhost:3000 |
| Swagger (documentação) | http://localhost:3000/api-docs |
| Frontend Web | `frontend-web/index.html` |
| Frontend Mobile | `frontend-mobile/index.html` |

---

## 📡 Endpoints da API

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/accounts` | Lista todas as contas |
| `POST` | `/accounts` | Cria uma nova conta |
| `GET` | `/accounts/:id` | Busca conta por ID |
| `PUT` | `/accounts/:id` | Atualiza dados da conta |
| `DELETE` | `/accounts/:id` | Remove uma conta |
| `POST` | `/accounts/:id/deposit` | Realiza um depósito |
| `POST` | `/accounts/:id/transfer` | Transfere para outra conta |

### Exemplo — Criar conta

```bash
curl -X POST http://localhost:3000/accounts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "cpf": "111.111.111-11",
    "initialBalance": 500
  }'
```

---

## 🧪 Testes com Postman

1. Abrir o Postman
2. Clicar em **Import**
3. Importar o arquivo `Banking_API_Postman_Collection.json`
4. Garantir que a API está rodando
5. Executar os requests individualmente **ou** usar **Run Collection** na pasta `04 — Regressão E2E` para rodar o fluxo completo

---

## ⚠️ Observações

- Os dados são armazenados **em memória** — ao reiniciar o servidor, todas as contas são apagadas
- A API **não tem autenticação** — foi simplificada propositalmente para foco nos testes
- A porta padrão é **3000** — se estiver ocupada, alterar em `server.js` na última linha

---

## 📚 Artefatos de QA incluídos

| Artefato | Arquivo |
|---|---|
| Casos de Teste | `1-CasosDeTeste.pdf` |
| Plano de Teste | `2-PlanoDeTeste.pdf` |
| Relatorio de Teste | `3-RelatorioDeTeste.pdf` |
| Registro de Bug | `4-RegistroBug.pdf` |
| Cobertura de Teste | `5-CoberturaDeTeste.pdf` |
| Collection Postman | `Banking_API_Postman_Collection.json` |

---
