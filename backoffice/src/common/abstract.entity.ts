import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

export abstract class AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn({
    type: 'timestamp without time zone',
  })
  createdAt: Date

  @UpdateDateColumn({
    type: 'timestamp without time zone',
  })
  updatedAt: Date
}
