import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity('Task')
export class Task {
  @PrimaryGeneratedColumn()
  public id: number;
  @Column()
  public owner_id: number;
  @Column()
  public title: string;
  @Column()
  public description: string;
  @Column()
  public status: string;
  @Column()
  public dueDate: Date;
  @Column()
  public createdAt: Date;
  @Column()
  public updatedAt: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
