import Hash from '@ioc:Adonis/Core/Hash'
import { BaseModel, beforeSave, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Task from 'App/Models/Task'

interface CreateUserType {
  firstName: string
  lastName: string
  email: string
  password: string
}

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public first_name: string

  @column()
  public last_name: string

  @column()
  public remember_me_token: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Task, {
    foreignKey: 'user_id',
  })
  public tasks: HasMany<typeof Task>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  public static createUser = async (data: CreateUserType) => {
    const exists = await this.findBy('email', data.email)
    if (exists) {
      throw new Error('User with this email already exists')
    }

    await this.create({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password: data.password,
    })
    return 'User created'
  }

  public static getAllTasksByUser = async (id: number) => {
    const user = await this.query().where('id', id).preload('tasks').firstOrFail()
    return user
  }
}
