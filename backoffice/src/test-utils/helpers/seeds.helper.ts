import * as path from 'path'
import {
  Builder,
  fixturesIterator,
  Loader,
  Parser,
  Resolver,
} from 'typeorm-fixtures-cli/dist'
import { getRepository, Connection } from 'typeorm'

export class SeedsHelper {
  private readonly connection: Connection

  private readonly fixturesPath: string

  constructor(connection: Connection, fixturesPath: string) {
    this.connection = connection

    this.fixturesPath = fixturesPath
  }

  public async loadFixtures() {
    await this.connection.synchronize(true)

    const loader = new Loader()
    loader.load(path.resolve(this.fixturesPath))

    const resolver = new Resolver()

    const fixtures = resolver.resolve(loader.fixtureConfigs)
    const builder = new Builder(this.connection, new Parser())

    /* eslint-disable */
    for (const fixture of fixturesIterator(fixtures)) {
      const entity = await builder.build(fixture)
      await getRepository(entity.constructor.name).save(entity)
    }
  }
}
