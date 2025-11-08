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