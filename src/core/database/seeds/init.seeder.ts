import { dataSource } from '../typeorm.config';
import { runSeeders } from 'typeorm-extension';
dataSource.initialize().then(async () => {
  console.log('Database connected');
  await runSeeders(dataSource);
  console.log('Database seeded');
  process.exit();
});
