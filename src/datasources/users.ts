import { User } from "../types/users";

const sampleUsers: User[] = [
    { id: "1", name: "John Doe", email: "john.doe@example.com", age: 30 },
    { id: "2", name: "Jane Doe", email: "jane.doe@example.com", age: 25 },
    { id: "3", name: "Anne Doe", email: "anne.doe@example.com", age: 20 },
]


export class UsersAPI {
    getUser(id: string): User | null {
        return sampleUsers.find(u => u.id === id) ?? null;
    }

    listUsers(limit?: number): User[] {
        return limit !== undefined ? sampleUsers.slice(0, limit) : sampleUsers;
    }
}