export class UserResponseDto
{
    constructor(data: Record<string, any>)
    {
        this.id = data.id ?? null
        this.email = data.email
        this.username = data.username
        this.role = data.role ?? null
        this.type = data.type ?? null
        this.isPlan = data.isPlan ?? null
    }
    id?: number
    email: string
    username: string
    role?: string
    type?: string
    isPlan?: boolean

}
