import { Test, TestingModule } from '@nestjs/testing';
import { PacienteService } from './paciente.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PacienteEntity } from './paciente.entity';
import { Repository } from 'typeorm';
import { BusinessLogicException } from '../shared/errors/business-errors';
import { faker } from '@faker-js/faker';

describe('PacienteService', () => {
  let service: PacienteService;
  let repository: Repository<PacienteEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PacienteService,
        {
          provide: getRepositoryToken(PacienteEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PacienteService>(PacienteService);
    repository = module.get<Repository<PacienteEntity>>(getRepositoryToken(PacienteEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a paciente correctly', async () => {
    const paciente: PacienteEntity = {
      id: '',
      nombre: faker.name.firstName(),
      genero: 'Masculino',
      medicos: [],
      diagnosticos: []
    };

    jest.spyOn(repository, 'save').mockResolvedValue(paciente);
    jest.spyOn(repository, 'findOne').mockResolvedValue(paciente);

    const newPaciente: PacienteEntity = await service.create(paciente);
    expect(newPaciente).not.toBeNull();

    const storedPaciente: PacienteEntity = await repository.findOne({ where: { id: newPaciente.id } });
    expect(storedPaciente).not.toBeNull();
    expect(storedPaciente.nombre).toEqual(newPaciente.nombre);
    expect(storedPaciente.genero).toEqual(newPaciente.genero);
  });

  it('should throw an exception when creating a paciente with a name less than 3 characters', async () => {
    const paciente: PacienteEntity = {
      id: '2',
      nombre: 'Jo',
      genero: 'Masculino',
      medicos: [],
      diagnosticos: []
    };

    await expect(service.create(paciente)).rejects.toHaveProperty("message", "El nombre no puede tener menos de 3 caracteres");
  });
});
