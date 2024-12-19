import { Role } from '../../../user/entities/role.entity';
import { RoleType } from '../../../user/enums/role-type.enum';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export default class RoleSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const roleRepository = dataSource.getRepository(Role);
    console.log('seeding roles...');
    for (const role in RoleType) {
      const roleEntity = new Role();
      roleEntity.name = RoleType[role];
      await roleRepository.insert(roleEntity);
    }
  }
}
