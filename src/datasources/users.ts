import { User } from "../types/users";

export class UsersAPI {
    getUser(id: string): User {
        return {id, name: "John Doe", email: "john.doe@example.com", age: 30};
    }
}