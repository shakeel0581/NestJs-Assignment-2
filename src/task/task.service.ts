import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { StATUS } from './enum/task.enum';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}

  async create(createRoleDto: CreateTaskDto) {
    const title = createRoleDto.title.toLocaleLowerCase();
    const existingRole = await this.taskRepository.findOne({
      where: { title: title },
    });

    if (existingRole) {
      throw new HttpException('Task already exist', 400);
    }

    const createdTask = await this.taskRepository.save(createRoleDto);

    await this.taskRepository.update(createdTask.id, {
      owner_id: createdTask.id,
    });

    return createdTask;
  }

  // async findAll() {
  //   const getAllRecord = await this.taskRepository.find({where:{}})
  //   return getAllRecord;
  // }

  async findOne(id: number, owner_id: any) {
    const getAllRecord = await this.taskRepository.find({ where: { id } });

    if (owner_id != id) {
      throw new HttpException(
        "You're not allow to view data, becouse you're not owner.",
        400,
      );
    }

    return getAllRecord;
    return `This action returns a #${id} role`;
  }

  async update(id: number, updateTaskTdo: UpdateTaskDto, owner_id: any) {
    const title = updateTaskTdo.title.toLocaleLowerCase();
    const TaskData = await this.taskRepository.findOne({
      where: { id },
    });

    if (owner_id != id) {
      throw new HttpException(
        "You're not allow to update data, becouse you're not owner.",
        400,
      );
    }

    if (!TaskData) {
      throw new HttpException("Task doesn't exist", 400);
    }
    await this.taskRepository.update(id, updateTaskTdo);

    const updated = await this.taskRepository.findOne({
      where: { id },
    });
    return updated;
    return `This action updates a #${id} role`;
  }

  async remove(id: number, owner_id: any) {
    const existing = await this.taskRepository.findOne({
      where: { id },
    });

    if (owner_id != id) {
      throw new HttpException(
        "You're not allow to delete data, becouse you're not owner.",
        400,
      );
    }

    if (!existing) {
      throw new HttpException("Task doesn't exist", 400);
    }
    await this.taskRepository.delete(id);

    return existing;
  }
}
