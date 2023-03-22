import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({ example: "example@gmail.com" })
    email: string;

    @ApiProperty({ example: "Rodolf" })
    name: string;

    @ApiProperty({ example: "shovel123" })
    password: string;
  }