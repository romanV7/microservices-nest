import { CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

export abstract class AbstractEntity {
  @PrimaryColumn('varchar', {
    length: 36,
    default: () => `'${uuidv4()}'`,
  })
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
