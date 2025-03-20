export class PostModel {
    id: number
    title: string
    content: string
    authorId?: number
    createdAt: string
    updatedAt: string

    constructor(partial: Partial<PostModel>) {
        Object.assign(this, partial)
    }
}