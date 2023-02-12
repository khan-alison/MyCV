import { CreateUserDto } from './dto/create-user.dto';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    console.log(body);
  }
}
