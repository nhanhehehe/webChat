export interface User {
    _id: string,
    username: string,
    password: string,
    displayName: string,
    avatarUrl: string,
    bio?: string,
    phone?: string,
    createdAt: string,
    updatedAt: string,
}