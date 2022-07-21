import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import { DateTime } from 'luxon'

interface StoreTaskType {
  title: string
  description: string
  priority: string
}

export default class Task extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public priority: string

  @column()
  public user_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, {
    localKey: 'id', // primary key in the parent table
    foreignKey: 'user_id',
  })
  public user: BelongsTo<typeof User>

  public static updateOrCreateTask = async (
    task: StoreTaskType,
    userId: number,
    id: number | undefined
  ) => {
    let queryString = {}
    if (id) {
      queryString = { id }
    } else {
      queryString = {}
    }

    await this.updateOrCreate(queryString, {
      title: task.title,
      description: task.description,
      priority: task.priority,
      user_id: userId,
    })

    return 'New task created'
  }

  public static getTaskById = async (id: number) => {
    const task = await this.findOrFail(id)
    return task
  }

  public static destroyTaskById = async (id: number) => {
    const task = await this.findOrFail(id)
    await task.delete()
    return 'Task deleted'
  }
}
