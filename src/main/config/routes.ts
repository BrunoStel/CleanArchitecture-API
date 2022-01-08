import { Express, Router } from 'express'
import fg from 'fast-glob'
// import SignupPost from '../routes/signup-routes'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  fg.sync('**/src/main/routes/**routes.ts').map(async file =>
    (await import(`../../../${file}`)).default(router)
  )
}

// export default (app: Express): void => {
//   const router = Router()
//   app.use('/api', router)
//   SignupPost(router)
// }
