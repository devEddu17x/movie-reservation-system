import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class AuthLoginDTO {
  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
    required: true,
    maxLength: 50,
    minLength: 1,
    format: 'email',
  })
  @IsNotEmpty()
  @IsEmail()
  @Length(1, 50)
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
    required: true,
    maxLength: 25,
    minLength: 1,
  })
  @IsNotEmpty()
  @Length(1, 25)
  password: string;
}
