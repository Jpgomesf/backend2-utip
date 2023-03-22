import { ApiProperty } from "@nestjs/swagger";

export class CreateProcessDto {
    @ApiProperty({ example: 112313123, description: 'process number' })
    processNumber: number;

    @ApiProperty({ example: "robert", description: 'defendant name', required: false })
    defendantName: string;

    @ApiProperty({ example: "Matt Murdock", description: 'attorney name', required: false})
    attorneyName: string;

    @ApiProperty({ example: "inq", description: 'status' })
    status: string;
    
    @ApiProperty({ example: "(32) 9923123123", description: 'phone number', required: false })
    phoneNumber: string;
  }