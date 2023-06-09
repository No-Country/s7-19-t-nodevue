import type { UserRepository } from "../../../domain/repositories/UserRepository"
import { User } from "../../../domain/valueObjects/User"

import { MongooseUserModel } from "./MongooseUserModel"

class MongooseUserRepository implements UserRepository {

  async save(user: User): Promise<User> {
    const newUser = new MongooseUserModel(user)
    const savedUser: User = await newUser.save()

    const { id, name, email, password, roleId, stackId } = savedUser

    return new User(id, name, email, password, roleId, stackId)
  }

  async findByEmail(email: string): Promise<User | null> {
    const user: User | null = await MongooseUserModel.findOne({ email })

    if (!user) {
      return null
    }

    const { id, name, password, roleId, stackId } = user

    return new User(id, name, email, password, roleId, stackId)
  }

  async findById(id: string): Promise<User | null> {
    const user: User | null = await MongooseUserModel.findById(id)

    if (!user) {
      return null
    }

    const { name, email, password, roleId, stackId } = user

    return new User(id, name, email, password, roleId, stackId)
  }

}

export { MongooseUserRepository }
