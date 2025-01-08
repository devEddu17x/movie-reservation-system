import { dataSource } from './typeorm.config';
import { Genre } from '../../movie/entities/genre.entity';
import { Movie } from '../../movie/entities/movie.entity';
import { Role } from '../../user/entities/role.entity';
import { User } from '../../user/entities/user.entity';
import { Room } from '../../room/entities/room.entity';
import { Seat } from '../../room/entities/seat.entity';
import * as readline from 'node:readline/promises';

async function ask(): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const confirmation = await rl.question(
    'Are you sure you want to clear the database?\nWARNING: THIS CAN NOT BE UNDONE\nAnswer (y/n): ',
  );

  return confirmation.toLowerCase() === 'y';
}
// clears all database entities in a transaction and prints a success message.
async function clearDatabase() {
  // verify if the user wants to clear the database
  try {
    const sucess = await ask();
    if (!sucess) {
      console.log('Process canceled.');
      return;
    }
  } catch {
    console.log('Unexpected error');
    return;
  }

  await dataSource.initialize();
  // it deletes the data in reverse order to respect foreign key constraints
  await dataSource.transaction(async (transactionalEntityManager) => {
    try {
      await transactionalEntityManager.delete(Seat, {});
      await transactionalEntityManager.delete(Room, {});
      await transactionalEntityManager.delete(Genre, {});
      await transactionalEntityManager.delete(Movie, {});
      await transactionalEntityManager.delete(User, {});
      await transactionalEntityManager.delete(Role, {});

      console.log('Data deleted successfully.');
    } catch (error) {
      console.error('An unexpected error: \n', error);
      throw error; // revert the transaction if an error occurs
    }
  });

  // close connection
  await dataSource.destroy();
}

// execute the function
clearDatabase()
  .then(() => {
    console.log('Process completed successfully.');
    process.exit(0);
  })
  .catch((error) => console.error('Error in process: \n', error));
