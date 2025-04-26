import crypto from 'crypto';

export function decrypt(encryptedData: string, key: string): string | Error {
  try {
    const encryptedBuffer = Buffer.from(encryptedData, 'hex');

    if (encryptedBuffer.length < 16) {
      throw new Error('Invalid encrypted data length.');
    }

    const iv = encryptedBuffer.slice(0, 16); // First 16 bytes are the IV
    const encryptedText = encryptedBuffer.slice(16);

    const derivedKey = crypto.createHash('sha256').update(key).digest();

    const decipher = crypto.createDecipheriv('aes-256-cbc', derivedKey, iv);
    const decryptedText = Buffer.concat([decipher.update(encryptedText), decipher.final()]);

    return decryptedText.toString('utf-8');
  } catch (error) {
    return new Error(`Decryption failed`);
  }
}
