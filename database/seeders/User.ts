import Database from '@ioc:Adonis/Lucid/Database'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

const users = [
  {
    email: 'new1@gmail.com',
    password: '12345678',
    first_name: 'new1',
    last_name: 'some',
  },
  {
    email: 'new2@gmail.com',
    password: '12345678',
    first_name: 'new2',
    last_name: 'some',
  },
]

export default class UserSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    try {
      await Database.table('users').multiInsert(users)
      console.info('Users seeded')
    } catch (error) {
      console.error(error)
    }
  }
}
