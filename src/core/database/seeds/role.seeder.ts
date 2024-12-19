import { Role } from 'src/user/entities/role.entity';
import { RoleType } from 'src/user/enums/role-type.enum';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export default class RoleSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const roleRepository = dataSource.getRepository(Role);
    for (const role in RoleType) {
      await roleRepository.insert({ name: () => role });
    }
  }
}
