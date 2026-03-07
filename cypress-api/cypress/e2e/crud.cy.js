describe("🧪 Banking API - CRUD Independente", () => {
  const generateUniqueCpf = () => `123.456.789-${Date.now()}-${Math.floor(Math.random() * 1000)}`

  it("CREATE - Deve criar uma nova conta", () => {
    const cpf = generateUniqueCpf()
    cy.request({
      method: "POST",
      url: "/accounts",
      headers: { "Content-Type": "application/json" },
      body: {
        name: "João Silva",
        email: "joao@teste.com",
        cpf: cpf,
        initialBalance: 1000
      }
    }).then((createResponse) => {
      expect(createResponse.status).to.eq(201)
      expect(createResponse.body.balance).to.eq(1000)
      expect(createResponse.body.cpf).to.eq(cpf)

      // Limpar: deletar a conta criada
      cy.request({
        method: "DELETE",
        url: `/accounts/${createResponse.body.id}`
      }).then((deleteResponse) => {
        expect(deleteResponse.status).to.eq(200)
      })
    })
  })

  it("READ - Deve buscar uma conta por ID", () => {
    const cpf = generateUniqueCpf()
    cy.request({
      method: "POST",
      url: "/accounts",
      headers: { "Content-Type": "application/json" },
      body: {
        name: "João Silva",
        email: "joao@teste.com",
        cpf: cpf,
        initialBalance: 1000
      }
    }).then((createResponse) => {
      const accountId = createResponse.body.id
      expect(createResponse.status).to.eq(201)

      // READ
      cy.request(`/accounts/${accountId}`).then((readResponse) => {
        expect(readResponse.status).to.eq(200)
        expect(readResponse.body.id).to.eq(accountId)
        expect(readResponse.body.name).to.eq("João Silva")
        expect(readResponse.body.cpf).to.eq(cpf)
        expect(readResponse.body.balance).to.eq(1000)
      })

      // Limpar
      cy.request({
        method: "DELETE",
        url: `/accounts/${accountId}`
      })
    })
  })

  it("UPDATE - Deve atualizar dados da conta", () => {
    const cpf = generateUniqueCpf()
    cy.request({
      method: "POST",
      url: "/accounts",
      headers: { "Content-Type": "application/json" },
      body: {
        name: "João Silva",
        email: "joao@teste.com",
        cpf: cpf,
        initialBalance: 1000
      }
    }).then((createResponse) => {
      const accountId = createResponse.body.id
      expect(createResponse.status).to.eq(201)

      // UPDATE
      cy.request({
        method: "PUT",
        url: `/accounts/${accountId}`,
        headers: { "Content-Type": "application/json" },
        body: {
          name: "João Silva Junior",
          email: "joao.junior@teste.com"
        }
      }).then((updateResponse) => {
        expect(updateResponse.status).to.eq(200)
        expect(updateResponse.body.name).to.eq("João Silva Junior")
        expect(updateResponse.body.email).to.eq("joao.junior@teste.com")
        // CPF e balance INALTERADOS
        expect(updateResponse.body.cpf).to.eq(cpf)
        expect(updateResponse.body.balance).to.eq(1000)
      })

      // Limpar
      cy.request({
        method: "DELETE",
        url: `/accounts/${accountId}`
      })
    })
  })

  it("DELETE - Deve remover uma conta", () => {
    const cpf = generateUniqueCpf()
    cy.request({
      method: "POST",
      url: "/accounts",
      headers: { "Content-Type": "application/json" },
      body: {
        name: "João Silva",
        email: "joao@teste.com",
        cpf: cpf,
        initialBalance: 1000
      }
    }).then((createResponse) => {
      const accountId = createResponse.body.id
      expect(createResponse.status).to.eq(201)

      // DELETE
      cy.request({
        method: "DELETE",
        url: `/accounts/${accountId}`
      }).then((deleteResponse) => {
        expect(deleteResponse.status).to.eq(200)
        expect(deleteResponse.body.message).to.contain("sucesso")
      })

      // VERIFY DELETE
      cy.request({
        url: `/accounts/${accountId}`,
        failOnStatusCode: false
      }).its("status").should("eq", 404)
    })
  })
})
