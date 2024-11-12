import nodemailer from 'nodemailer';
import fs from 'fs';
import { promisify } from 'util';
import config from '../../config.js';

const readFileAsync = promisify(fs.readFile);

const transporter = nodemailer.createTransport({
    host: config.emailConfig.host,
    secure: true, 
    secureConnection: false,
    tls: {
        ciphers: "SSLv3",
    },
    requireTLS: true,
    port: config.emailConfig.port,
    debug: true,
    connectionTimeout: 10000,
    auth: {
        user: config.emailConfig.user,
        pass: config.emailConfig.password,
    },
});


export const sendEmailConfirmation = async (recipient, subject, subscriber_uuid) => {
    const htmlTemplate = await readFileAsync(`../../templates/newSubscriber.html`, 'utf-8');
    const imageAttachment = await readFileAsync('../../templates/logo-white.png');
    
    const info = await transporter.sendMail({
        from: config.emailConfig.sender,
        to: recipient,
        subject: subject,
        html: htmlTemplate.replaceAll('$id', subscriber_uuid),
        attachments: [{
            filename: 'logo-white.png',
            content: imageAttachment,
            encoding: 'base64',
            cid: 'rhb-logo',
        }],
    });

    console.log('Email Confirmation Sent:', info.messageId);
};