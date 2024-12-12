import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class AuthLoginDTO {
  @IsNotEmpty()
  @IsEmail()
  @Length(1, 50)
  email: string;

  @IsNotEmpty()
  @Length(1, 25)
  password: string;
}
