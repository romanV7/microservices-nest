import { EEntityNames } from './constraints/entity-names'
import { EntityOperation } from './constraints/entity-operation'

export function createEntityCommand(
  entityName: EEntityNames,
  operation: EntityOperation,
) {
  return {
    cmd: `${operation}-${entityName}`,
  }
}
