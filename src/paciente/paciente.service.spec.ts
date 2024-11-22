import { Test, TestingModule } from '@nestjs/testing';
import { PacienteService } from './paciente.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PacienteEntity } from './paciente.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('PacienteService', () => {
  let service: PacienteService;
  let repository: Repository<PacienteEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PacienteService],
    }).compile();

    service = module.get<PacienteService>(PacienteService);
    repository = module.get<Repository<PacienteEntity>>(getRepositoryToken(PacienteEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should return a new paciente', async () => {
    const paciente: PacienteEntity = {
      id: '',
      nombre: faker.person.fullName(), 
      genero: 'Masculino',
      medicos: [],
      diagnosticos: []
    };

    const newPaciente: PacienteEntity = await service.create(paciente);
    expect(newPaciente).not.toBeNull();

    const storedPaciente: PacienteEntity = await repository.findOne({ where: { id: newPaciente.id } });
    expect(storedPaciente).not.toBeNull();
    expect(storedPaciente.nombre).toEqual(newPaciente.nombre);
    expect(storedPaciente.genero).toEqual(newPaciente.genero);
  });

  it('create should throw an exception when creating a paciente with a name less than 3 characters', async () => {
    const paciente: PacienteEntity = {
      id: '2',
      nombre: 'Jo',
      genero: 'Masculino',
      medicos: [],
      diagnosticos: []
    };

    await expect(() => service.create(paciente)).rejects.toHaveProperty("message", "El nombre no puede tener menos de 3 caracteres");
  });
});
