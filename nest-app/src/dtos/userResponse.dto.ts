export class UserResponseDto
{
    constructor(data: Record<string, any>)
    {
        this.id = data.id ?? null
        this.email = data.email
        this.username = data.username
    }
    id?: number
    email: string
    username: string
}
