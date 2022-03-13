import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { AbstractDto } from './dto/abstract.dto'

export abstract class AbstractEntity<T extends AbstractDto = AbstractDto> {
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
