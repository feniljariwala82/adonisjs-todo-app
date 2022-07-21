import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Task from 'App/Models/Task'
import User from 'App/Models/User'
import CreateTaskValidator from 'App/Validators/CreateTaskValidator'

export default class TasksController {
  public index = async ({ view, auth, session, response }: HttpContextContract) => {
    try {
      const user = await User.getAllTasksByUser(auth.user!.id)
      const html = await view.render('tasks/index', { tasks: user.tasks })
      return html
    } catch (error) {
      session.flash({ error: error.message })
      return response.redirect().back()
    }
  }

  public create = async ({ view }: HttpContextContract) => {
    const html = await view.render('tasks/create')
    return html
  }

  public store = async ({ request, auth, session, response }: HttpContextContract) => {
    const payload = await request.validate(CreateTaskValidator)

    // create task
    try {
      const result = await Task.updateOrCreateTask(
        {
          title: payload.title,
          description: payload.description,
          priority: payload.priority,
        },
        auth.user!.id,
        undefined
      )
      session.flash({ success: result })
      return response.redirect().toRoute('tasks.index')
    } catch (error) {
      console.error(error)
      session.flash({ error: error.message })
      return response.redirect().back()
    }
  }

  public show = async ({ params, session, response, view, bouncer }: HttpContextContract) => {
    const { id } = params

    try {
      const task = await Task.getTaskById(id)

      // authorization check
      await bouncer.authorize('showTask', task)

      const html = await view.render('tasks/show', { task })
      return html
    } catch (error) {
      console.error(error)
      session.flash({ error: error.message })
      return response.redirect().toRoute('tasks.index')
    }
  }

  public edit = async ({ params, session, response, view, bouncer }: HttpContextContract) => {
    const { id } = params

    try {
      const task = await Task.getTaskById(id)

      // authorization check
      await bouncer.authorize('editTask', task)

      const html = await view.render('tasks/edit', { task })
      return html
    } catch (error) {
      console.error(error)
      session.flash({ error: error.message })
      return response.redirect().toRoute('tasks.index')
    }
  }

  public update = async ({
    params,
    session,
    response,
    request,
    auth,
    bouncer,
  }: HttpContextContract) => {
    const { id } = params

    const payload = await request.validate(CreateTaskValidator)

    try {
      const task = await Task.getTaskById(id)

      // authorization check
      await bouncer.authorize('editTask', task)

      await Task.updateOrCreateTask(
        {
          title: payload.title,
          description: payload.description,
          priority: payload.priority,
        },
        auth.user!.id,
        id
      )
      session.flash({ success: 'Task updated' })
      return response.redirect().toRoute('tasks.index')
    } catch (error) {
      console.error(error)
      session.flash({ error: error.message })
      return response.redirect().toRoute('tasks.index')
    }
  }

  public destroy = async ({ params, session, response, bouncer }: HttpContextContract) => {
    const { id } = params

    try {
      const task = await Task.getTaskById(id)

      // authorization check
      await bouncer.authorize('editTask', task)

      const result = await Task.destroyTaskById(id)

      session.flash({ success: result })
      return response.redirect().toRoute('tasks.index')
    } catch (error) {
      console.error(error)
      session.flash({ error: error.message })
      return response.redirect().back()
    }
  }
}
