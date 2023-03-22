import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class CreateProcessDto {
  @ApiProperty({ example: 112313123, description: 'process number' })
  @IsString()
  processNumber: string;

  @ApiProperty({ example: 'robert', description: 'defendant name' })
  @IsOptional()
  defendantName: string;

  @ApiProperty({ example: 'Matt Murdock', description: 'attorney name' })
  @IsOptional()
  attorneyName: string;

  @ApiProperty({ example: 'inq', description: 'status' })
  @IsString()
  status: string;

  @ApiProperty({ example: '(32) 9923123123', description: 'phone number' })
  @IsOptional()
  @IsPhoneNumber('BR')
  phoneNumber: string;
}