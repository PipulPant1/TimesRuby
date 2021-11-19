/// <reference types="cypress" />

context('Stabby Prod API Test', () => {
    const base_URL = 'https://tmia-api.fusemachines.com'
    const autocomplete_baseURL = 'https://tmia-sayt.fusemachines.com'

    it('C393424| Verify Trivia API ', () => {
        cy.request({
            method: 'GET',
            url: base_URL + '/api/v1.0/trivia',
        }).should((response) => {
            expect(response.status).to.be.equal(200)
            cy.log(JSON.stringify(response.body))
        })
    })
    it('Verify Placeholder API ', () => {
        cy.request({
            method: 'GET',
            url: base_URL + '/api/v1.0/placeholder',
        }).should((response) => {
            expect(response.status).to.be.equal(200)
        })
    })

    it('Verify Entry Suggestion API ', () => {
        //ENTRY SUGGESTION API
        cy.request({
            method: 'GET',
            url: base_URL + '/api/v1.0/entry-suggestions',
        }).should((response) => {
            expect(response.status).to.be.equal(200)
        })
    })

    it('Verify Search/Autocomplete API ', () => {
        //SEARCH API
        cy.request({
            method: 'POST',
            url: autocomplete_baseURL + '/search',
            body: {
                suggest: {
                    'question-suggest': {
                        text: 'how ',
                        completion: {
                            field: 'question',
                            size: 5,
                            skip_duplicates: 'true',
                            fuzzy: { fuzziness: 'AUTO' },
                        },
                    },
                },
            },
        }).should((response) => {
            expect(response.status).to.be.equal(200)
            cy.log(JSON.stringify(response.body))
        })
    })
    it('Verify Message Handler API ', () => {
        //Message Handler API
        cy.request({
            method: 'POST',
            url: base_URL + '/api/v1.0/message',
            body: { query: 'hi' },
        }).should((response) => {
            expect(response.status).to.be.equal(200)
            cy.log(JSON.stringify(response.body))
        })
        //Response Feedback API
        cy.request({
            method: 'POST',
            url: base_URL + '/api/v1.0/message',
            body: { query: 'What are the latest updates?' },
        }).should((response) => {
            expect(response.status).to.be.equal(200)
            cy.log(JSON.stringify(response.body))
        })
        cy.request({
            method: 'POST',
            url: base_URL + '/api/v1.0/message',
            body: {
                query: 'What precautions should I take before attending a gathering?',
            },
        }).should((response) => {
            expect(response.status).to.be.equal(200)
            cy.log(JSON.stringify(response.body))
        })
    })
    ///it("Verify QA Message Handler API ", () => {
    //QA Message Handler API
    //});
    it('Verify Response Feedback API ', () => {
        //Response Feedback API
        cy.request({
            method: 'POST',
            url: base_URL + '/api/v1.0/feedback/response/',
            body: {
                rating: 'My question was misunderstood',
                comment: '',
                query: '"hi"',
                response:
                    '{"query":"hi","meta":{"intent":"greet","source":"chatbot"},"data":[{"type":"text","content":"Hi! My name\'s Ruby.","meta":null}],"errors":null,"id":"07152776-e75c-420c-a005-b9ff37a85475"}',
                meta: '{"intent":"greet","source":"chatbot"}',
            },
        }).should((response) => {
            expect(response.status).to.be.equal(201)
            cy.log(JSON.stringify(response.body))
        })
    })

    it('Verify Conversation Feedback API ', () => {
        //Response Feedback API
        cy.request({
            method: 'POST',
            url: base_URL + '/api/v1.0/feedback/conversation/',
            body: { comment: '', rating: 3 },
        }).should((response) => {
            expect(response.status).to.be.equal(201)
            cy.log(JSON.stringify(response.body))
        })
    })
})
