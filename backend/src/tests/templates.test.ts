import {
    genAccVerificationEmailBody,
    genPWResetEmailBody,
} from "../services/external/templates";

describe("HTML email body templates", () => {
    it("should return account verification html email body with the appropriate data", () => {
        const name = "John";
        const accountVerificationSecret = "some_secret";
        const FRONTEND_URL = "fe.domain.com";

        const expectedVerificationBody = `
        <h1>Hi ${name}!</h1>
        <p>We apreciate you signing up!</p>
        <p>To verify your account, please click on the link below.</p>
        <a href="${FRONTEND_URL}/verify-account?token=${accountVerificationSecret}" style="background-color: 'green'; color='white'">VERIFY</a>
    `;

        expect(
            genAccVerificationEmailBody(
                name,
                accountVerificationSecret,
                FRONTEND_URL
            )
        ).toBe(expectedVerificationBody);
    });

    it("should throw error if one of the parameters are undefined", () => {
        const name = undefined;
        const accountVerificationSecret = "some_secret";
        const FRONTEND_URL = "fe.domain.com";

        const expectedVerificationBody = `
        <h1>Hi ${name}!</h1>
        <p>We apreciate you signing up!</p>
        <p>To verify your account, please click on the link below.</p>
        <a href="${FRONTEND_URL}/verify-account?token=${accountVerificationSecret}" style="background-color: 'green'; color='white'">VERIFY</a>
    `;

        expect(() => {
            genAccVerificationEmailBody(
                name!,
                accountVerificationSecret,
                FRONTEND_URL
            );
        }).toThrow("Undefined parameter");
    });

    it("should return password reset html email body with the appropriate data", () => {
        const name = "John";
        const pwResetSecret = "some_secret";
        const FRONTEND_URL = "fe.domain.com";

        const expectedResetBody = `
        <h1>Hi ${name}!</h1>
        <p>We recieved your password reset request!</p>
        <p>To set your new password, please click on the link below.</p>
        <a href="${FRONTEND_URL}/set-new-password?token=${pwResetSecret}" style="background-color: 'green'; color='white'">VERIFY</a>
        <p style="color:'red'">If the request was not initiated by you, feel free to ignore this email.</p>
    `;

        expect(genPWResetEmailBody(name, pwResetSecret, FRONTEND_URL)).toBe(
            expectedResetBody
        );
    });

    it("should throw an error if one of the arguments are undefined", () => {
        const name = undefined;
        const pwResetSecret = "some_secret";
        const FRONTEND_URL = "fe.domain.com";

        const expectedResetBody = `
    <h1>Hi ${name}!</h1>
    <p>We recieved your password reset request!</p>
    <p>To set your new password, please click on the link below.</p>
    <a href="${FRONTEND_URL}/set-new-password?token=${pwResetSecret}" style="background-color: 'green'; color='white'">VERIFY</a>
    <p style="color:'red'">If the request was not initiated by you, feel free to ignore this email.</p>
`;

        expect(() => {
            genPWResetEmailBody(name!, pwResetSecret, FRONTEND_URL);
        }).toThrow("Undefined parameter");
    });
});
