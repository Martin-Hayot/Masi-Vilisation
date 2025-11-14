export declare const userRepository: {
    getAllUsers(): Promise<any>;
    getUserById(id: string): Promise<any>;
    getUserByUsername(username: string): Promise<any>;
    getUserByEmail(email: string): Promise<any>;
    createUser(data: {
        username: string;
        email: string;
        password: string;
    }): Promise<any>;
};
//# sourceMappingURL=user.d.ts.map