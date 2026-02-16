export interface BcryptInterf {
    genSalt(rounds?: number, minor?: "a" | "b"): Promise<string>;
    hash(data: string | Buffer, saltOrRounds: string | number): Promise<string>;
}
