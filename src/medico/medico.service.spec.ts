import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MedicoService } from './medico.service';
import { Repository } from 'typeorm';
import { MedicoEntity } from './medico.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

describe('MedicoService', () => {
  let service: MedicoService;
  let repository: Repository<MedicoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [MedicoService],
    }).compile();

    service = module.get<MedicoService>(MedicoService);
    repository = module.get<Repository<MedicoEntity>>(getRepositoryToken(MedicoEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should return a new medico', async () => {
    const medico: MedicoEntity = {
      id: '',
      nombre: faker.person.fullName(),
      especialidad: faker.lorem.word(),
      telefono: faker.phone.number(),
      pacientes: []
    };

    const newMedico: MedicoEntity = await service.create(medico);
    expect(newMedico).not.toBeNull();

    const storedMedico: MedicoEntity = await repository.findOne({ where: { id: newMedico.id } });
    expect(storedMedico).not.toBeNull();
    expect(storedMedico.nombre).toEqual(newMedico.nombre);
    expect(storedMedico.especialidad).toEqual(newMedico.especialidad);
    expect(storedMedico.telefono).toEqual(newMedico.telefono);
  });

  it('create should throw an exception when creating a medico without a name', async () => {
    const medico: MedicoEntity = {
      id: '',
      nombre: '',
      especialidad: faker.lorem.word(),
      telefono: faker.phone.number(),
      pacientes: []
    };

    await expect(() => service.create(medico)).rejects.toHaveProperty("message", "El nombre no puede estar vacío");
  });

  it('create should throw an exception when creating a medico without a especialidad', async () => {
    const medico: MedicoEntity = {
      id: '',
      nombre: faker.person.fullName(),
      especialidad: '',
      telefono: faker.phone.number(),
      pacientes: []
    };

    await expect(() => service.create(medico)).rejects.toHaveProperty("message", "La especialidad no puede estar vacía");
  });
});
