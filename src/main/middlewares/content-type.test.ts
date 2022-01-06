import request from 'supertest'
import app from '../config/app'

describe('Contet Type middleware', () => {
  it('Should return default content type as json', async () => {
    app.get('/test_content_type', (request, response) => {
      response.send('')
    })

    await request(app)
      .get('/test_content_type')
      .expect('content-type', /json/)
  })
})
