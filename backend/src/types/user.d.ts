interface User {
    id: string;
    companyId: string;
    restaurantId: string;
    name: string;
    email: string;
    roleId: number;
    createdAt: Date;
    password: string;
}
type Hashes = { pwHash: string; pwSalt: string };
type UserSecretToken = {userSecretToken: string};

export type UserManager = Omit<
    User,
    "id" | "restaurantId" | "roleId" | "createdAt"
>;
export type UserManagerNew = Omit<
    User,
    "id" | "restaurantId" | "roleId" | "createdAt" | "password"
> &
    Hashes & UserSecretToken;
export type UserRegural = Omit<User, "id" | "email" | "createdAt">;
export type UserReguralNew = Omit<
    User,
    "id" | "email" | "password" | "createdAt"
> &
    Hashes;
