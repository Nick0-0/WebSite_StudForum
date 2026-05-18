const crypto = require('crypto');
require('dotenv').config();

const SECRET_KEY = process.env.LOGIN_SECRET_KEY || '12345678901234567890123456789012';
const ALGORITHM = 'aes-256-cbc';

class CryptoHelper {
    static encrypt(text) {
        if (!text) return '';
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY), iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return iv.toString('hex') + ':' + encrypted;
    }

    static decrypt(text) {
        if (!text || !text.includes(':')) return text;
        try {
            const [ivHex, encryptedText] = text.split(':');
            const iv = Buffer.from(ivHex, 'hex');
            const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(SECRET_KEY), iv);
            let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        } catch (error) {
            console.error("Decrypt login error:", error);
            return text;
        }
    }
}

module.exports = CryptoHelper;