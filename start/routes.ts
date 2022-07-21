import Route from '@ioc:Adonis/Core/Route'

// * auth controller
// GET  /       renders login page
// POST /login  login request submit route
// GET  /signup renders signup page
// POST /signup signup request submit route
// GET  /logout logout route

// * tasks controller
// GET     /tasks          renders task index page
// GET     /tasks/create   renders task create page
// POST    /tasks/store    store new task route
// GET     /tasks/:id/edit renders task edit page
// PUT     /tasks/:id      update task route
// DELETE  /tasks/:id      delete task route

Route.group(() => {
  Route.get('/', 'AuthController.index').as('lending')
  Route.post('/login', 'AuthController.login').as('login')
  Route.route('/signup', ['GET', 'POST'], 'AuthController.signUp').as('signup')
}).middleware('isGuest')

Route.get('/logout', 'AuthController.logout').as('logout').middleware('auth')

Route.resource('/tasks', 'TasksController').middleware({ '*': 'auth' })
