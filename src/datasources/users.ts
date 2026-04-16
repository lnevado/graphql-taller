import { User } from "../types/users";

const sampleUsers: User[] = [
    { id: "1", name: "John Doe", email: "john.doe@example.com", age: 30 },
    { id: "2", name: "Jane Doe", email: "jane.doe@example.com", age: 25 },
    { id: "3", name: "Jane Doe", email: "jane.doe@example.com", age: 25 },
]


export class UsersAPI {
    getUser(id: string): User | undefined {
        const user = sampleUsers.find(user => user.id = id);
        return user;
    }
}