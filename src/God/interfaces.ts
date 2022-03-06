export interface IGod {
    // Skeleton Builder
    buildSkeleton(email: string): IGodSkeleton,

    // Generators
    generateOTPSecret(): string,
    generateOTPToken(secret: string): string,

    // Validations
    emailValid(email: string): boolean,
    otpSecretValid(secret: string): boolean,
    otpTokenValid(token: string, secret: string): boolean,
}





export interface IGodSkeleton {
    buildDate: string,
    uid: string,
    email: string,
    password: string,
    otpSecret: string
}