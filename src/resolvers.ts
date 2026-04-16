export const resolvers = {
    Query: {
        getUser: (_: any, args: any, { usersApi } : any ) => {
            const user = usersApi.getUser(args.id)
            return user;
        }
    }
}