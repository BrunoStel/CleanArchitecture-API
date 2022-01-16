import { Router } from 'express'
import { adaptRoute } from '../adapter/express/express-route-adapter'
import { makeSignupController } from '../factories/signup/signup'

export default (router: Router): void => {
  const signupController = makeSignupController()
  router.post('/signup', adaptRoute(signupController))
}
