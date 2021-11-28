/// <reference types="cypress" />

context('Stabby Prod API Test', () => {
    //Base URL
    const base_URL = 'https://tmia-api.fusemachines.com'
    //Auto complete Base URL
    const autocomplete_baseURL = 'https://tmia-sayt.fusemachines.com'

    it('C393424| Verify Trivia API ', () => {
        cy.request({
            method: 'GET',
            url: base_URL + '/api/v1.0/trivia',
        }).should((response) => {
            expect(response.status).to.be.equal(200)
        })
    })
    it('C393520| Verify Placeholder API ', () => {
        //Placeholder API
        cy.request({
            method: 'GET',
            url: base_URL + '/api/v1.0/placeholder',
        }).should((response) => {
            expect(response.status).to.be.equal(200)
        })
    })

    it('C393521| Verify Entry Suggestion API ', () => {
        //Entry Suggestion API
        cy.request({
            method: 'GET',
            url: base_URL + '/api/v1.0/entry-suggestions',
        }).should((response) => {
            expect(response.status).to.be.equal(200)
        })
    })

    it('C393522| Verify Search/Autocomplete API ', () => {
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
        })
    })
    it('C393523| Verify Message Handler API ', () => {
        //Covid Faqs API Test
        cy.log('**Covid Faqs Message Handler Test**')
        cy.request({
            method: 'POST',
            url: base_URL + '/api/v1.0/message',
            body: { query: 'Can my employer require me to get vaccinated?' },
        }).should((response) => {
            expect(response.status).to.be.equal(200)
        })
        //Chitchat  API Test
        cy.log('**Chitchat Message Handler Test**')
        cy.request({
            method: 'POST',
            url: base_URL + '/api/v1.0/message',
            body: { query: '"What can you do?"' },
        }).should((response) => {
            expect(response.status).to.be.equal(200)
        })
        //QA Message Handler API Test
        cy.log('**QA Message Handler Test**')
        cy.request({
            method: 'POST',
            url: base_URL + '/api/v1.0/message',
            body: {
                query: 'What precautions should I take before attending a gathering?',
            },
        }).should((response) => {
            expect(response.status).to.be.equal(200)
        })
        //Gamification API Test
        cy.log('**Gamification Message Handler Test**')
        cy.request({
            method: 'POST',
            url: base_URL + '/api/v1.0/message',
            body: {
                query: 'What are the latest updates?',
            },
        }).should((response) => {
            expect(response.status).to.be.equal(200)
        })
        //dataqs API Test
        cy.log('**Dataqs Message Handler Test**')
        cy.request({
            method: 'POST',
            url: base_URL + '/api/v1.0/message',
            body: {
                query: 'How bad is it at California',
            },
        }).should((response) => {
            expect(response.status).to.be.equal(200)
        })
    })

    it('C393524| Verify Response Feedback API ', () => {
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
        })
    })

    it('C393525| Verify Conversation Feedback API ', () => {
        //Response Feedback API
        cy.request({
            method: 'POST',
            url: base_URL + '/api/v1.0/feedback/conversation/',
            body: { comment: '', rating: 3 },
        }).should((response) => {
            expect(response.status).to.be.equal(201)
        })
    })
})
