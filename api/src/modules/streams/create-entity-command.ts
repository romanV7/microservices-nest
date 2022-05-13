import { EEntityNames } from './constants/entity-names'
import { EntityOperation } from './constants/entity-operation'

export function createEntityCommand(
  entityName: EEntityNames,
  operation: EntityOperation,
) {
  return {
    cmd: `${operation}-${entityName}`,
  }
}
