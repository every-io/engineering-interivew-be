import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ example: HttpStatus.NOT_FOUND })
  public readonly statusCode!: HttpStatus;

  @ApiProperty({ example: '2020-04-02T17:51:57.465Z' })
  public readonly timestamp!: string;

  @ApiProperty({ example: '/sample/9478' })
  public readonly path!: string;

  @ApiProperty({ example: 'Sample with ID 9478 not found!' })
  public readonly message!: string;
}
