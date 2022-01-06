import { Router } from 'express'
import { adaptRoute } from '../adapter/express-route-adapter'
import { makeSignupController } from '../factories/signup'

export default (router: Router): void => {
  const signupController = makeSignupController()
  router.post('/signup', adaptRoute(signupController))
}
