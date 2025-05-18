import { PartialType } from '@nestjs/swagger';
import { CreateGenreDTO } from './create-genre.dto';

export class UpdateGenreDTO extends PartialType(CreateGenreDTO) {}
