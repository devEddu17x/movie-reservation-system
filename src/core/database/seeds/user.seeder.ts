import { User } from '../../../user/entities/user.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { hash } from 'bcrypt';
import { Role } from '../../../user/entities/role.entity';
import { RoleType } from '../../../user/enums/role-type.enum';
export default class UserSeeder implements Seeder {
  public async run(
    datasource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = datasource.getRepository(User);
    const roleRepository = datasource.getRepository(Role);

    console.log('seeding admin...');
    const adminData = {
      email: 'admin@admin.com',
      name: 'admin',
      lastname: 'lastname',
      password: await hash('admin', 5),
      role: {
        id: (await roleRepository.findOneBy({ name: RoleType.ADMIN })).id,
      },
    };

    const user = await repository.findOneBy({ email: adminData.email });
    if (!user) {
      await repository.insert(adminData);
    }
    const userFactory = factoryManager.get(User);
    userFactory.setMeta(
      (await roleRepository.findOneBy({ name: RoleType.REGULAR })).id,
    );
    console.log('seeding users...');
    await userFactory.saveMany(20);
  }
}
