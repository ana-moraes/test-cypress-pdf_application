it('Upload image files', () => {
    const imagePath1 = 'cypress/fixtures/p0hjd8f0.jpg'

    cy.readFile(imagePath1, 'binary').then((file) => {
        cy.window().then((win) => {
            const blob = Cypress.Blob.binaryStringToBlob(file, 'image/jpeg')
            const formData = new win.FormData()
            formData.append('files', blob, 'p0hjd8f0.jpg')
            formData.append('file_name', Cypress.env('file_name'))
            cy.request({
                method: 'POST',
                url: Cypress.env('url'),
                body: formData,
                headers: {'Content-Type': 'multipart/form-data',
                    'email': Cypress.env('email')
                },
            }).then((response) => {
                expect(response.status).to.eq(200)
            })
            
        })
    })
})

it('Verify email sent', () => {
    cy.visit(Cypress.env('yopmail'))
    cy.get('body').then(($body) => {
      const $btn = $body.find('[aria-label="Consent"]')
      if ($btn.length && $btn.is(':visible')) {
        cy.wrap($btn).click({ force: true })
      }
    })
    cy.get('[class="ycptinput"]').type(Cypress.env('email'))
    cy.get('[id="refreshbut"]').click()
    cy.get('iframe#ifmail', { timeout: 15000 }).should('exist').then(($iframe) => {
      const body = $iframe.contents().find('body')
      cy.wrap(body)
        .find('a[title*="'+Cypress.env('file_name')+'"]', { timeout: 10000 })
        .should('be.visible')
    })
})

after(() => {
    cy.visit(Cypress.env('yopmail'))
    cy.get('body').then(($body) => {
      const $btn = $body.find('[aria-label="Consent"]')
      if ($btn.length && $btn.is(':visible')) {
        cy.wrap($btn).click({ force: true })
      }
    })
    cy.get('[id="refreshbut"]').click()
    cy.get('div.wminboxheader button i', { timeout: 10000 })
        .first()
        .click({ force: true })
    cy.get('#delall', { timeout: 10000 })
        .click({ force: true })
    cy.get('#message', { timeout: 10000 }).then(($message) => {
        if ($message.is(':visible')) {
            const text = $message.text()
            expect(text).to.contain('This inbox is empty')
        }
    })
  })