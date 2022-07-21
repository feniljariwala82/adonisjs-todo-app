import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class IsGuest {
  public async handle({ auth, response, session }: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL

    if (auth.isAuthenticated) {
      session.flash({ warning: 'You are already logged in' })
      return response.redirect().toRoute('tasks.index')
    }

    await next()
  }
}
