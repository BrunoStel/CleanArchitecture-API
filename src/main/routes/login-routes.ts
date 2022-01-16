import { Router } from 'express'
import { adaptRoute } from '../adapter/express/express-route-adapter'
import { makeLoginController } from '../factories/login/login'
import { makeSignupController } from '../factories/signup/signup'

export default (router: Router): void => {
  const signupController = makeSignupController()
  router.post('/signup', adaptRoute(signupController))

  const loginController = makeLoginController()
  router.post('/login', adaptRoute(loginController))
}
