const nodemailer = require('nodemailer');

async function confirmAccountMail(userData) {
    const { email, token, name } = userData;

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    await transport.sendMail({
        from: '"PetPal Finder" <accounts@petpal.com',
        to: email,
        subject: "PetPal Finder - Confirm your account",
        html: `
            <h1>Hi ${name}!</h1>
            <p>Thanks for signing up to PetPal Finder!</p>
            <p>Please confirm your account by clicking the link below:</p>
            <a href="${process.env.FRONTEND_URL}/confirm-account/${token}">Confirm your account</a>
            <p>If you did not sign up to PetPal Finder, please ignore this email.</p>
            `
    });
}

async function forgetPasswordMail(userData) {
    const { email, token, name } = userData;

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    await transport.sendMail({
        from: '"PetPal Finder" <accounts@petpal.com',
        to: email,
        subject: "PetPal Finder - Reset your password",
        html: `
            <h1>Hi ${name}!</h1>
            <p>You have requested to reset your password!</p>
            <p>Please follow the link below in order to create a new password:</p>
            <a href="${process.env.FRONTEND_URL}/forget-password/${token}">Reset Password</a>
            <p>If you did not made the request, please ignore this email.</p>
            `
    });
}

module.exports = { confirmAccountMail, forgetPasswordMail };

