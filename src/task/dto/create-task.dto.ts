import { IsBoolean, IsDateString, IsString } from 'class-validator';

export class CreateTaskDto {
  //   @IsString()
  //   owner_id: string;
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

export default CreateTaskDto;
