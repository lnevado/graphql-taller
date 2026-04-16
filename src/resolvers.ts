type GetUserArgs = {
    id: string;
};

type ListUsersArgs = {
    limit?: number;
};

export const resolvers = {
    Query: {
        getUser: (_: any, args: GetUserArgs, { usersApi }: any) => {
            const user = usersApi.getUser(args.id);
            return user;
        },
        listUsers: (_: any, args: ListUsersArgs, { usersApi }: any) => {
            const users = usersApi.listUsers(args.limit);
            return users;
        },
    },
};