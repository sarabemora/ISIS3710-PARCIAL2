import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DiagnosticoService } from './diagnostico.service';
import { Repository } from 'typeorm';
import { DiagnosticoEntity } from './diagnostico.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

describe('DiagnosticoService', () => {
  let service: DiagnosticoService;
  let repository: Repository<DiagnosticoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [DiagnosticoService],
    }).compile();

    service = module.get<DiagnosticoService>(DiagnosticoService);
    repository = module.get<Repository<DiagnosticoEntity>>(getRepositoryToken(DiagnosticoEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should return a new diagnostico', async () => {
    const diagnostico: DiagnosticoEntity = {
      id: '',
      nombre: faker.person.firstName('female'),
      descripcion: faker.lorem.sentence(),
      paciente: null
    };

    const newDiagnostico: DiagnosticoEntity = await service.create(diagnostico);
    expect(newDiagnostico).not.toBeNull();

    const storedDiagnostico: DiagnosticoEntity = await repository.findOne({ where: { id: newDiagnostico.id } });
    expect(storedDiagnostico).not.toBeNull();
    expect(storedDiagnostico.nombre).toEqual(newDiagnostico.nombre);
    expect(storedDiagnostico.descripcion).toEqual(newDiagnostico.descripcion);
  });

  it('create should throw an exception when creating a diagnostico without a descripcion longer than 200 caracteres', async () => {
    const diagnostico: DiagnosticoEntity = {
      id: '',
      nombre: faker.person.fullName(),
      descripcion: faker.lorem.paragraphs(3),
      paciente: null
    };

    await expect(() => service.create(diagnostico)).rejects.toHaveProperty("message", "La descripción no puede tener más de 200 caracteres");
  });
});
