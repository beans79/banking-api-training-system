const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { accounts } = require('../db');

/**
 * @swagger
 * components:
 *   schemas:
 *     Account:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         cpf:
 *           type: string
 *         balance:
 *           type: number
 *         createdAt:
 *           type: string
 */

/**
 * @swagger
 * /accounts:
 *   get:
 *     summary: Lista todas as contas
 *     tags: [Accounts]
 *     responses:
 *       200:
 *         description: Lista de contas
 */
router.get('/', (req, res) => {
  res.json(accounts);
});

/**
 * @swagger
 * /accounts/{id}:
 *   get:
 *     summary: Busca conta por ID
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Conta encontrada
 *       404:
 *         description: Conta não encontrada
 */
router.get('/:id', (req, res) => {
  const account = accounts.find(a => a.id === req.params.id);
  if (!account) return res.status(404).json({ error: 'Conta não encontrada' });
  res.json(account);
});

/**
 * @swagger
 * /accounts:
 *   post:
 *     summary: Cria uma nova conta
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, cpf, initialBalance]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Maria Silva"
 *               email:
 *                 type: string
 *                 example: "maria@email.com"
 *               cpf:
 *                 type: string
 *                 example: "123.456.789-00"
 *               initialBalance:
 *                 type: number
 *                 example: 500
 *     responses:
 *       201:
 *         description: Conta criada com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/', (req, res) => {
  const { name, email, cpf, initialBalance } = req.body;

  if (!name || !email || !cpf || initialBalance === undefined) {
    return res.status(400).json({ error: 'Campos obrigatórios: name, email, cpf, initialBalance' });
  }
  if (typeof initialBalance !== 'number' || initialBalance < 0) {
    return res.status(400).json({ error: 'initialBalance deve ser um número >= 0' });
  }
  if (accounts.find(a => a.cpf === cpf)) {
    return res.status(400).json({ error: 'CPF já cadastrado' });
  }

  const account = {
    id: uuidv4(),
    name,
    email,
    cpf,
    balance: initialBalance,
    createdAt: new Date().toISOString()
  };

  accounts.push(account);
  res.status(201).json(account);
});

/**
 * @swagger
 * /accounts/{id}:
 *   put:
 *     summary: Atualiza dados da conta
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Conta atualizada
 *       404:
 *         description: Conta não encontrada
 */
router.put('/:id', (req, res) => {
  const account = accounts.find(a => a.id === req.params.id);
  if (!account) return res.status(404).json({ error: 'Conta não encontrada' });

  const { name, email } = req.body;
  if (name) account.name = name;
  if (email) account.email = email;

  res.json(account);
});

/**
 * @swagger
 * /accounts/{id}:
 *   delete:
 *     summary: Remove uma conta
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Conta removida
 *       404:
 *         description: Conta não encontrada
 */
router.delete('/:id', (req, res) => {
  const index = accounts.findIndex(a => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Conta não encontrada' });

  accounts.splice(index, 1);
  res.json({ message: 'Conta removida com sucesso' });
});

/**
 * @swagger
 * /accounts/{id}/deposit:
 *   post:
 *     summary: Deposita dinheiro na conta (receber dinheiro)
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount]
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 200
 *     responses:
 *       200:
 *         description: Depósito realizado
 *       400:
 *         description: Valor inválido
 *       404:
 *         description: Conta não encontrada
 */
router.post('/:id/deposit', (req, res) => {
  const account = accounts.find(a => a.id === req.params.id);
  if (!account) return res.status(404).json({ error: 'Conta não encontrada' });

  const { amount } = req.body;
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'amount deve ser maior que 0' });
  }

  account.balance += amount;
  res.json({ message: 'Depósito realizado', balance: account.balance });
});

/**
 * @swagger
 * /accounts/{id}/transfer:
 *   post:
 *     summary: Transfere dinheiro para outra conta (enviar dinheiro)
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [targetId, amount]
 *             properties:
 *               targetId:
 *                 type: string
 *                 example: "uuid-da-conta-destino"
 *               amount:
 *                 type: number
 *                 example: 100
 *     responses:
 *       200:
 *         description: Transferência realizada
 *       400:
 *         description: Saldo insuficiente ou valor inválido
 *       404:
 *         description: Conta não encontrada
 */
router.post('/:id/transfer', (req, res) => {
  const source = accounts.find(a => a.id === req.params.id);
  if (!source) return res.status(404).json({ error: 'Conta origem não encontrada' });

  const { targetId, amount } = req.body;
  const target = accounts.find(a => a.id === targetId);
  if (!target) return res.status(404).json({ error: 'Conta destino não encontrada' });

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'amount deve ser maior que 0' });
  }
  if (source.balance < amount) {
    return res.status(400).json({ error: 'Saldo insuficiente' });
  }
  if (source.id === target.id) {
    return res.status(400).json({ error: 'Conta origem e destino não podem ser iguais' });
  }

  source.balance -= amount;
  target.balance += amount;

  res.json({
    message: 'Transferência realizada com sucesso',
    sourceBalance: source.balance,
    targetBalance: target.balance
  });
});

module.exports = router;
