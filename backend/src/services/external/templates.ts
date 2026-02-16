export function genAccVerificationEmailBody(
    name: string,
    accountVerificationSecret: string,
    FRONTEND_URL: string
) {
    if (
        typeof name === "undefined" ||
        typeof accountVerificationSecret === "undefined" ||
        typeof FRONTEND_URL === "undefined"
    ) {
        throw new Error("Undefined parameter");
    }
    return `
        <h1>Hi ${name}!</h1>
        <p>We apreciate you signing up!</p>
        <p>To verify your account, please click on the link below.</p>
        <a href="${FRONTEND_URL}/verify-account?token=${accountVerificationSecret}" style="background-color: 'green'; color='white'">VERIFY</a>
    `;
}
export function genPWResetEmailBody(
    name: string,
    passwordResetSecret: string,
    FRONTEND_URL: string
) {
    if (
        typeof name === "undefined" ||
        typeof passwordResetSecret === "undefined" ||
        typeof FRONTEND_URL === "undefined"
    ) {
        throw new Error("Undefined parameter");
    }
    return `
        <h1>Hi ${name}!</h1>
        <p>We recieved your password reset request!</p>
        <p>To set your new password, please click on the link below.</p>
        <a href="${FRONTEND_URL}/set-new-password?token=${passwordResetSecret}" style="background-color: 'green'; color='white'">VERIFY</a>
        <p style="color:'red'">If the request was not initiated by you, feel free to ignore this email.</p>
    `;
}
