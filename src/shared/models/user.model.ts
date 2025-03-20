import { Exclude } from "class-transformer"

export class UserModel {
    id?: number
    name?: string
    @Exclude()
    title?:string
    password?: string
    email?: string
    createdAt?: Date
    updatedAt?: Date

    constructor(partial: Partial<UserModel>) {
        Object.assign(this, partial)
    }
}