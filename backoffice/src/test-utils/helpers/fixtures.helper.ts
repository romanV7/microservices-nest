import { execSync } from 'child_process'

export class FixturesHelper {
  public async load() {
    execSync('npm run seed:run')
  }

  public async unLoad() {
    execSync('bash src/test-utils/revert.sh')
  }
}
