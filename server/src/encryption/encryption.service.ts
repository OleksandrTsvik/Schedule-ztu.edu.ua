import * as crypto from 'crypto';

import { Injectable, InternalServerErrorException } from '@nestjs/common';

import configuration from '../config/configuration';
import { EncryptionConfig } from './interfaces/encryption-config.interface';

@Injectable()
export class EncryptionService {
  encryption(dataToCrypt: string): string {
    const { algorithm, key, iv } = this.getEncryptionConfig();

    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update(dataToCrypt, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return encrypted;
  }

  decryption(dataToDecrypt: string): string {
    const { algorithm, key, iv } = this.getEncryptionConfig();

    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    let decrypted = decipher.update(dataToDecrypt, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  getEncryptionConfig(): EncryptionConfig {
    const config = configuration();
    const { algorithm, key, iv } = config.encryption;

    if (!algorithm || !key || !iv) {
      throw new InternalServerErrorException();
    }

    return { algorithm, key, iv };
  }
}
