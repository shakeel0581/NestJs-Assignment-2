import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsDateString, IsNumber, IsString } from 'class-validator';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsString()
  title: string;
  @IsString()
  description: string;
  @IsBoolean()
  status: string;
  @IsDateString()
  dueDate: Date;
  @IsDateString()
  createdAt: Date;
  @IsDateString()
  updatedAt: Date;
}
