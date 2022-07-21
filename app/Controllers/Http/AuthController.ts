import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class AuthController {
  public index = async ({ view }: HttpContextContract) => {
    const html = await view.render('auth/login')
    return html
  }

  public login = async ({ request, response, auth, session }: HttpContextContract) => {
    // schema
    const postSchema = schema.create({
      email: schema.string([rules.required(), rules.trim(), rules.email()]),
      password: schema.string([rules.required(), rules.trim(), rules.minLength(8)]),
    })

    /**
     * Validate request body against the schema
     */
    const payload = await request.validate({
      schema: postSchema,
      messages: {
        'required': 'The {{ field }} must not be empty',
        'email.email': 'The email should be a valid email',
        'password.minLength': 'The password should have 8 characters minimum',
      },
    })

    try {
      await auth.use('web').attempt(payload.email, payload.password)
      session.flash({ success: 'Logged In' })
      return response.redirect().toRoute('tasks.index')
    } catch {
      session.flash({ danger: 'Invalid credentials' })
      return response.redirect().back()
    }
  }

  public signUp = async ({ request, response, session, view }: HttpContextContract) => {
    switch (request.method()) {
      case 'POST':
        // schema
        const postSchema = schema.create({
          firstName: schema.string([rules.required(), rules.trim(), rules.alpha()]),
          lastName: schema.string([rules.required(), rules.trim(), rules.alpha()]),
          email: schema.string([rules.required(), rules.trim(), rules.email()]),
          password: schema.string([rules.required(), rules.trim(), rules.minLength(8)]),
        })

        /**
         * Validate request body against the schema
         */
        const payload = await request.validate({
          schema: postSchema,
          messages: {
            'required': 'The {{ field }} must not be empty',
            'firstName.alpha': 'The first name should contain letters only',
            'lastName.alpha': 'The last name should contain letters only',
            'email.email': 'The email should be a valid email',
            'password.minLength': 'The password should have 8 characters minimum',
          },
        })

        try {
          await User.createUser({
            email: payload.email,
            firstName: payload.firstName,
            lastName: payload.lastName,
            password: payload.password,
          })
          session.flash({ success: 'User created' })
          return response.redirect().toRoute('lending')
        } catch (error) {
          session.flash({ error: error.message })
          return response.redirect().back()
        }

      default:
        const html = await view.render('auth/signup')
        return html
    }
  }

  public logout = async ({ auth, response }: HttpContextContract) => {
    await auth.use('web').logout()
    return response.redirect().toRoute('lending')
  }
}
