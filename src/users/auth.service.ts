import {UsersService} from './users.service';
import {BadRequestException, Injectable, NotFoundException,} from '@nestjs/common';
import {randomBytes, scrypt as _scrypt} from 'crypto';
import {promisify} from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signUp(email: string, password: string) {
    const users = await this.usersService.find(email);

    if (users.length) {
      throw new BadRequestException('This email are in use');
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');

    return await this.usersService.create(email, result);
  }

  async signIn(email: string, password: string) {
    const [user] = await this.usersService.find(email);

    if (!user) throw new NotFoundException('User not found');

    const [salt, storeHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storeHash !== hash.toString('hex')) {
      throw new BadRequestException('Incorrect email or password');
    }

    return user;
  }
}
