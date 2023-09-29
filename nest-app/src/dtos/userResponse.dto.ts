export class UserResponseDto
{
    constructor(data: Record<string, any>)
    {
        this.id = data.id ?? null
        this.email = data.email
        this.username = data.username
        this.role = data.role ?? null
    }
    id?: number
    email: string
    username: string
    role?: string
}
