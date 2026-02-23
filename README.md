# 🏦 Banking Frontend QA Training System


**Sistema didático para treinamentos QA Frontend**  
**Nível:** Júnior/Iniciante  
**Foco:** Testes manuais de interface web  
**Data:** Fevereiro 2026

[![API Local](https://img.shields.io/badge/API-localhost:3000-brightgreen)]()
[![Frontend Web](https://img.shields.io/badge/Frontend-HTML/CSS/JS-gold)]()

---

## 🎯 OBJETIVO DO EXERCÍCIO

**Praticar testes manuais de FRONTEND** criando:

1. **10 casos de teste** (UI + API)
2. **1 plano de teste**
3. **1 relatório de execução**
4. **Registro de bugs**
5. **Matriz de cobertura**

**Simula ambiente real de QA!** 🧪

---

## 🚀 COMO EXECUTAR (3 MINUTOS)

### Pré-requisitos
```
Node.js 18+ (node --version)
Chrome/Firefox
```

### 1. Backend API
```bash
npm install
npm run dev
```
✅ **API:** http://localhost:3000  
✅ **Swagger:** http://localhost:3000/api-docs

### 2. Frontend Web
```
Abrir frontend-web/index.html no navegador
```
✅ **Interface:** Cards + Tabela responsiva

---

## 📋 REQUISITOS FUNCTIONAIS (8 RF-FE)

| ID | Funcionalidade | Componentes | API Endpoint |
|----|----------------|-------------|--------------|
| **RF-FE001** | Criar Conta | Form 4 campos + botão | POST /accounts |
| **RF-FE002** | Listar Contas | Tabela + Refresh | GET /accounts |
| **RF-FE003** | Atualizar Conta | Form ID + nome/email | PUT /accounts/{id} |
| **RF-FE004** | Deletar Conta | Botão Delete + ID | DELETE /accounts/{id} |
| **RF-FE005** | Depósito | Form ID + valor | POST /accounts/{id}/deposit |
| **RF-FE006** | Transferência | Form origem/destino/valor | POST /accounts/{id}/transfer |
| **RF-FE007** | Feedback Visual | JSON colorido + Toast | Todas ações |
| **RF-FE008** | UI Responsiva | Hover + adaptação mobile | Layout |

**Especificação completa:** `3-especificacao-completa.html`

---

## 📝 EXERCÍCIO PRÁTICO — PASSO A PASSO

### 1️⃣ CASOS DE TESTE (10 OBRIGATÓRIOS)

**TEMPLATE:**
```
ID: CT-FE-001
Título: Criar conta com dados válidos
Pré-condições: Backend rodando, sem contas
Passos:
1. Abrir index.html
2. Nome: "João Silva"
3. Email: "joao@test.com"
4. CPF: "123.456.789-00"
5. Balance: "1000"
6. Clicar "Create Account"
Resultado Esperado:
-  JSON verde com status 201
-  Form limpo automaticamente
-  Toast "Account created"
-  Tabela mostra 1 conta
Requisito: RF-FE001
```

**EXEMPLO NEGATIVO:**
```
CT-FE-002: CPF duplicado
... repetir mesmo CPF → JSON vermelho (400)
```

### 2️⃣ PLANO DE TESTE

```
PROJETO: Banking Frontend QA
VERSÃO: 1.0
RESPONSÁVEL: [Seu Nome]
DATA: [23/02/2026]

ESCOPO:
✅ RF-FE001 a RF-FE008
❌ Performance/Segurança

ABORDAGEM: Testes manuais + DevTools
AMBIENTE: localhost:3000

CRONOGRAMA:
-  Elaboração: 1h
-  Execução: 1h  
-  Relatório: 1h

CRITÉRIOS: Cobertura ≥ 80%
```

### 3️⃣ RELATÓRIO DE EXECUÇÃO

| ID | Título | Status | Observação |
|----|--------|--------|------------|
| CT-FE-001 | Criar válida | ✅ | Tabela ok |
| CT-FE-002 | CPF duplicado | ❌ | Sem toast |
| CT-FE-003 | ... | 🔶 | Backend off |

**Status:** ✅ Passou | ❌ Falhou | 🔶 Bloqueado

### 4️⃣ REGISTRO DE BUGS

```
BUG-FE-001
TÍTULO: Toast não aparece em erro
SEVERIDADE: Média
PASSOS:
1. Criar conta CPF duplicado
ESPERADO: Toast vermelho
OBTIDO: Sem feedback visual
EVIDÊNCIA: [Screenshot]
```

### 5️⃣ COBERTURA DE TESTES

```
FÓRMULA: (RF testados ÷ 8) × 100

MATRIZ DE RASTREABILIDADE:
RF-FE001 → CT-FE001,002 ✅
RF-FE002 → CT-FE003 ✅
... até RF-FE008

COBERTURA FINAL: 100% (8/8 RF)
```

---

## 📦 ENTREGÁVEIS (1 DOCX)

**Crie UM documento Word com:**

1. **10 casos de teste** completos
2. **Plano de teste** preenchido  
3. **Tabela execução** (status + prints)
4. **Bugs encontrados** (mínimo 1)
5. **Matriz cobertura** + percentual

---

## 💡 DICAS PARA ALUNO

```
🔍 DEVTOOLS (F12):
-  Network → Status 200/400/404
-  Console → Erros JavaScript
-  Toggle Device → Testar mobile

🧪 CENÁRIOS IMPORTANTES:
-  Campos vazios
-  CPF duplicado/inválido
-  Saldo insuficiente
-  ID inexistente
-  Valores zero/negativos

📸 EVIDÊNCIAS:
-  Screenshot JSON resposta
-  Tabela antes/depois
-  Console erros
```

---

## ❓ PERGUNTAS FREQUENTES

**Q: Não encontrei bugs?**  
A: Registre que "todos testes passaram" ✅

**Q: Backend não funciona?**  
A: `npm run dev` + verificar porta 3000

**Q: Como testar responsivo?**  
A: F12 → Toggle Device Toolbar → 375px

**Q: Swagger para validar API?**  
A: http://localhost:3000/api-docs

---

## 📚 ARQUIVOS DO PROJETO

```
├── index.html              (Frontend Web luxuoso)
├── server.js              (API Node.js)
├── accounts.js            (Lógica negócios)
├── package.json           (Dependências)
├── 3-especificacao-completa.html (Requisitos)
└── README.md              (Você está aqui!)
```

---

**🧪 Bons testes!**  

---
