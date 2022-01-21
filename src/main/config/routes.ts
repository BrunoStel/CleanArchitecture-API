import { Express, Router } from 'express'

import Login from '../routes/login-routes'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  Login(router)
}
