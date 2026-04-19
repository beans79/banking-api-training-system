import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000'; // ajuste conforme seu backend

test.describe('POST /accounts - Criação de Conta Bancária', () => {

  test('Deve criar uma conta com sucesso (201)', async ({ request }) => {
    const payload = {
      name: "João Silva",
      email: "joao@email.com",
      cpf: "111.111.111-11",
      initialBalance: 500
    };

    const response = await request.post(`${BASE_URL}/accounts`, {
      data: payload
    });

    expect(response.status()).toBe(201);

    const body = await response.json();

    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('createdAt');
    expect(body.balance).toBe(500);
    expect(body.cpf).toBe(payload.cpf);
  });

  test('Não deve permitir saldo inicial negativo (400)', async ({ request }) => {
    const payload = {
      name: "Maria Souza",
      email: "maria@email.com",
      cpf: "222.222.222-22",
      initialBalance: -10
    };

    const response = await request.post(`${BASE_URL}/accounts`, {
      data: payload
    });

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.error).toContain("initialBalance");
  });

  test('Não deve permitir CPF duplicado (400)', async ({ request }) => {
    const cpfDuplicado = "333.333.333-33";

    // Primeiro cadastro
    await request.post(`${BASE_URL}/accounts`, {
      data: {
        name: "Carlos Lima",
        email: "carlos@email.com",
        cpf: cpfDuplicado,
        initialBalance: 100
      }
    });

    // Segundo cadastro com mesmo CPF
    const response = await request.post(`${BASE_URL}/accounts`, {
      data: {
        name: "Outro Usuário",
        email: "outro@email.com",
        cpf: cpfDuplicado,
        initialBalance: 200
      }
    });

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.error).toContain("CPF");
  });

  test('Não deve permitir campos ausentes (400)', async ({ request }) => {
    const payload = {
      name: "Diogo",
      // email ausente
      cpf: "444.444.444-44",
      initialBalance: 50
    };

    const response = await request.post(`${BASE_URL}/accounts`, {
      data: payload
    });

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.error).toContain("Campos obrigatórios: name, email, cpf, initialBalance");
  });

  ////////////////////////////Get RF-002///////////////////////////////////////////////////////////////
  test.describe('GET /accounts - Listar Todas as Contas', () => {
    /*
        test('Deve retornar array vazio quando não houver contas (200)', async ({ request }) => {
    
    
          const response = await request.get(`${BASE_URL}/accounts`);
          expect(response.status()).toBe(200);
    
          const body = await response.json();
          expect(Array.isArray(body)).toBe(true);
          expect(body.length).toBe(0);
        });
    */
    test('Deve retornar lista de contas quando houver contas cadastradas (200)', async ({ request }) => {
      // Criar uma conta antes de listar
      const novaConta = {
        name: "João Silva",
        email: "joao@email.com",
        cpf: "111.111.111-11",
        initialBalance: 500
      };

      await request.post(`${BASE_URL}/accounts`, { data: novaConta });

      // Agora listar
      const response = await request.get(`${BASE_URL}/accounts`);
      expect(response.status()).toBe(200);

      const body = await response.json();

      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThan(0);

      // Validar estrutura mínima
      const conta = body[0];
      expect(conta).toHaveProperty('id');
      expect(conta).toHaveProperty('name');
      expect(conta).toHaveProperty('email');
      expect(conta).toHaveProperty('cpf');
      expect(conta).toHaveProperty('balance');
      expect(conta).toHaveProperty('createdAt');
    });

  });
  ////////////////////////////Get ID RF-003/////////////////////////////////////////////////
  test.describe('GET /accounts/{id} - Buscar Conta por ID', () => {

    test('Deve retornar os dados da conta quando o ID existir (200)', async ({ request }) => {
      // Primeiro cria uma conta para obter um ID válido
      const novaConta = {
        name: "João Silva",
        email: "joao@email.com",
        cpf: "111.111.111-11" + Date.now(),
        initialBalance: 500
      };

      const createResponse = await request.post(`${BASE_URL}/accounts`, {
        data: novaConta
      });

      expect(createResponse.status()).toBe(201);

      const contaCriada = await createResponse.json();
      const id = contaCriada.id;

      // Agora busca a conta pelo ID
      const response = await request.get(`${BASE_URL}/accounts/${id}`);
      expect(response.status()).toBe(200);

      const body = await response.json();

      // Valida estrutura
      expect(body.id).toBe(id);
      expect(body.name).toBe(novaConta.name);
      expect(body.email).toBe(novaConta.email);
      expect(body.cpf).toBe(novaConta.cpf);
      expect(body.balance).toBe(500);
      expect(body).toHaveProperty('createdAt');
    });

    test('Deve retornar 404 quando o ID não existir', async ({ request }) => {
      const idInexistente = 50;

      const response = await request.get(`${BASE_URL}/accounts/${idInexistente}`);
      expect(response.status()).toBe(404);

      const body = await response.json();
      expect(body.error).toContain("Conta não encontrada");
    });
  });
  /////////////////////////////Atualizar conta RF-004////////////////////////////
  test.describe('PUT /accounts/{id} - Atualizar Dados da Conta', () => {

    test('Deve atualizar nome e email da conta com sucesso (200)', async ({ request }) => {
      // 1. Criar conta inicial
      const contaOriginal = {
        name: "João Silva",
        email: "joao@email.com",
        cpf: "111.111.111-11" + Date.now(),
        initialBalance: 500
      };

      const createResponse = await request.post(`${BASE_URL}/accounts`, {
        data: contaOriginal
      });

      expect(createResponse.status()).toBe(201);

      const contaCriada = await createResponse.json();
      const id = contaCriada.id;

      // 2. Atualizar nome e email
      const updatePayload = {
        name: "João da Silva Junior",
        email: "joao.junior@email.com"
      };

      const updateResponse = await request.put(`${BASE_URL}/accounts/${id}`, {
        data: updatePayload
      });

      expect(updateResponse.status()).toBe(200);

      const contaAtualizada = await updateResponse.json();

      // 3. Validar campos atualizados
      expect(contaAtualizada.name).toBe(updatePayload.name);
      expect(contaAtualizada.email).toBe(updatePayload.email);

      // 4. Validar que CPF e balance NÃO mudaram
      expect(contaAtualizada.cpf).toBe(contaOriginal.cpf);
      expect(contaAtualizada.balance).toBe(500);
    });

    test('Deve retornar 404 ao tentar atualizar conta inexistente', async ({ request }) => {
      const idInexistente = Date.now();

      const response = await request.put(`${BASE_URL}/accounts/${idInexistente}`, {
        data: {
          name: "Novo Nome",
          email: "novo@email.com"
        }
      });

      expect(response.status()).toBe(404);

      const body = await response.json();
      expect(body.error).toContain("Conta não encontrada");
    });

  });
  /////////////////Apagar RF-005////////////////////////////

  test.describe('DELETE /accounts/{id} - Deletar Conta', () => {

    test('Deve deletar uma conta existente com sucesso (200)', async ({ request }) => {
      // 1. Criar conta para depois deletar
      const novaConta = {
        name: "João Silva",
        email: "joao@email.com",
        cpf: "111.111.111-11" + Date.now(),
        initialBalance: 500
      };

      const createResponse = await request.post(`${BASE_URL}/accounts`, {
        data: novaConta
      });

      expect(createResponse.status()).toBe(201);

      const contaCriada = await createResponse.json();
      const id = contaCriada.id;

      // 2. Apagar a conta
      const deleteResponse = await request.delete(`${BASE_URL}/accounts/${id}`);
      expect(deleteResponse.status()).toBe(200);

      const body = await deleteResponse.json();
      expect(body.message).toBe("Conta removida com sucesso");

      // 3. Garantir que a conta realmente foi removida
      const getResponse = await request.get(`${BASE_URL}/accounts/${id}`);
      expect(getResponse.status()).toBe(404);
    });

    test('Deve retornar 404 ao tentar deletar conta inexistente', async ({ request }) => {
      const idInexistente = "id123";

      const response = await request.delete(`${BASE_URL}/accounts/${idInexistente}`);
      expect(response.status()).toBe(404);

      const body = await response.json();
      expect(body.error).toContain("Conta não encontrada");
    });

  });
  ////////////////////////// Deposito RF-006777777777777777777777777777777777777


  test.describe('POST /accounts/{id}/deposit - Depositar Dinheiro', () => {

    test('Deve realizar depósito com sucesso (200)', async ({ request }) => {
      // 1. Criar conta inicial
      const novaConta = {
        name: "João Silva",
        email: "joao@email.com",
        cpf: "111.111.111-11" + Date.now(),
        initialBalance: 500
      };

      const createResponse = await request.post(`${BASE_URL}/accounts`, {
        data: novaConta
      });

      expect(createResponse.status()).toBe(201);

      const contaCriada = await createResponse.json();
      const id = contaCriada.id;

      // 2. Realizar depósito
      const deposito = { amount: 200 };

      const depositResponse = await request.post(`${BASE_URL}/accounts/${id}/deposit`, {
        data: deposito
      });

      expect(depositResponse.status()).toBe(200);

      const body = await depositResponse.json();

      expect(body.message).toBe("Depósito realizado");
      expect(body.balance).toBe(700); // 500 + 200
    });

    test('Não deve permitir depósito com amount inválido (≤ 0)', async ({ request }) => {
      // Criar conta para testar depósito inválido
      const conta = {
        name: "Maria Souza",
        email: "maria@email.com",
        cpf: "222.222.222-22" + Date.now(),
        initialBalance: 300
      };

      const createResponse = await request.post(`${BASE_URL}/accounts`, {
        data: conta
      });

      const contaCriada = await createResponse.json();
      const id = contaCriada.id;

      // Testar quantidade inválida
      const depositResponse = await request.post(`${BASE_URL}/accounts/${id}/deposit`, {
        data: { amount: 0 }
      });

      expect(depositResponse.status()).toBe(400);

      const body = await depositResponse.json();
      expect(body.error).toContain("amount");
    });

    test('Deve retornar 404 ao tentar depositar em conta inexistente', async ({ request }) => {
      const idInexistente = "id123";

      const response = await request.post(`${BASE_URL}/accounts/${idInexistente}/deposit`, {
        data: { amount: 100 }
      });

      expect(response.status()).toBe(404);

      const body = await response.json();
      expect(body.error).toContain("Conta não encontrada");
    });

  });
/////////////////////////////////Transferencia RF-007///////////////////
test.describe('POST /accounts/{id}/transfer - Realizar Transferência', () => {

  test('Deve realizar transferência com sucesso (200)', async ({ request }) => {
    // Criar conta origem
    const origemResponse = await request.post(`${BASE_URL}/accounts`, {
      data: {
        name: "Conta Origem",
        email: "origem@email.com",
        cpf: "111.111.111-11" + Date.now(),
        initialBalance: 500
      }
    });
    const origem = await origemResponse.json();

    // Criar conta destino
    const destinoResponse = await request.post(`${BASE_URL}/accounts`, {
      data: {
        name: "Conta Destino",
        email: "destino@email.com",
        cpf: "222.222.222-22" + Date.now(),
        initialBalance: 200
      }
    });
    const destino = await destinoResponse.json();

    // Realizar transferência
    const transferResponse = await request.post(`${BASE_URL}/accounts/${origem.id}/transfer`, {
      data: {
        targetId: destino.id,
        amount: 100
      }
    });

    expect(transferResponse.status()).toBe(200);

    const body = await transferResponse.json();
    expect(body.message).toBe("Transferência realizada com sucesso");
    expect(body.sourceBalance).toBe(400); // 500 - 100
    expect(body.targetBalance).toBe(300); // 200 + 100
  });

  test('Não deve permitir transferência com amount inválido (≤ 0)', async ({ request }) => {
    // Criar conta origem
    const origemResponse = await request.post(`${BASE_URL}/accounts`, {
      data: {
        name: "Origem",
        email: "origem@email.com",
        cpf: "333.333.333-33" + Date.now(),
        initialBalance: 300
      }
    });
    const origem = await origemResponse.json();

    // Criar conta destino
    const destinoResponse = await request.post(`${BASE_URL}/accounts`, {
      data: {
        name: "Destino",
        email: "destino@email.com",
        cpf: "444.444.444-44" + Date.now(),
        initialBalance: 100
      }
    });
    const destino = await destinoResponse.json();

    const response = await request.post(`${BASE_URL}/accounts/${origem.id}/transfer`, {
      data: {
        targetId: destino.id,
        amount: 0
      }
    });

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.error).toContain("amount");
  });

  test('Não deve permitir transferência com saldo insuficiente', async ({ request }) => {
    // Criar conta origem com saldo baixo
    const origemResponse = await request.post(`${BASE_URL}/accounts`, {
      data: {
        name: "Origem",
        email: "origem@email.com",
        cpf: "555.555.555-55" + Date.now(),
        initialBalance: 50
      }
    });
    const origem = await origemResponse.json();

    // Criar conta destino
    const destinoResponse = await request.post(`${BASE_URL}/accounts`, {
      data: {
        name: "Destino",
        email: "destino@email.com",
        cpf: "666.666.666-66" + Date.now(),
        initialBalance: 100
      }
    });
    const destino = await destinoResponse.json();

    const response = await request.post(`${BASE_URL}/accounts/${origem.id}/transfer`, {
      data: {
        targetId: destino.id,
        amount: 200
      }
    });

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.error).toContain("Saldo insuficiente");
  });

  test('Não deve permitir transferência para a mesma conta', async ({ request }) => {
    // Criar conta
    const contaResponse = await request.post(`${BASE_URL}/accounts`, {
      data: {
        name: "Conta Única",
        email: "conta@email.com",
        cpf: "777.777.777-77" + Date.now(),
        initialBalance: 500
      }
    });
    const conta = await contaResponse.json();

    const response = await request.post(`${BASE_URL}/accounts/${conta.id}/transfer`, {
      data: {
        targetId: conta.id,
        amount: 50
      }
    });

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.error).toContain("Conta origem e destino não podem ser iguais");
  });

  test('Deve retornar 404 se conta origem não existir', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/accounts/id-inexistente/transfer`, {
      data: {
        targetId: "0000",
        amount: 50
      }
    });

    expect(response.status()).toBe(404);

    const body = await response.json();
    expect(body.error).toContain("origem");
  });

  test('Deve retornar 404 se conta destino não existir', async ({ request }) => {
    // Criar conta origem
    const origemResponse = await request.post(`${BASE_URL}/accounts`, {
      data: {
        name: "Origem",
        email: "origem@email.com",
        cpf: "888.888.888-88" + Date.now(),
        initialBalance: 500
      }
    });
    const origem = await origemResponse.json();

    const response = await request.post(`${BASE_URL}/accounts/${origem.id}/transfer`, {
      data: {
        targetId: "0000000000",
        amount: 50
      }
    });

    expect(response.status()).toBe(404);

    const body = await response.json();
    expect(body.error).toContain("destino");
  });

});
});