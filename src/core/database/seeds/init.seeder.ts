import { DataSource } from 'typeorm';
import { runSeeders, Seeder } from 'typeorm-extension';

import UserSeeder from './user.seeder';
import RoleSeeder from './role.seeder';
import userFactory from '../factories/user.factory';

export default class InitSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    await runSeeders(dataSource, {
      seeds: [RoleSeeder, UserSeeder],
      factories: [userFactory],
    });
  }
}
