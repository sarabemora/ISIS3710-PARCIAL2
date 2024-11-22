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
  let diagnosticoList: DiagnosticoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [DiagnosticoService],
    }).compile();

    service = module.get<DiagnosticoService>(DiagnosticoService);
    repository = module.get<Repository<DiagnosticoEntity>>(getRepositoryToken(DiagnosticoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    diagnosticoList = [];
    for (let i = 0; i < 5; i++) {
      const diagnostico: DiagnosticoEntity = await repository.save({
        nombre: faker.person.fullName(),
        descripcion: faker.lorem.sentence(),
        paciente: null
      })
      diagnosticoList.push(diagnostico);
    }
  }

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

  it('findOne should return a diagnostico by id', async () => {
    const storedDiagnostico: DiagnosticoEntity = diagnosticoList[0];
    const diagnostico: DiagnosticoEntity = await service.findOne(storedDiagnostico.id);
    expect(diagnostico).not.toBeNull();
    expect(diagnostico.nombre).toEqual(storedDiagnostico.nombre);
    expect(diagnostico.descripcion).toEqual(storedDiagnostico.descripcion);
  });

  it('findOne should throw an exception when the diagnostico does not exist', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty("message", "Diagnostico no encontrado");
  });

  it('findAll should return all diagnosticos', async () => {
    const diagnosticos: DiagnosticoEntity[] = await service.findAll();
    expect(diagnosticos).not.toBeNull();
    expect(diagnosticos.length).toEqual(diagnosticoList.length);
  });

  it('delete should remove a diagnostico by id', async () => {
    const diagnostico: DiagnosticoEntity = diagnosticoList[0];
    await service.delete(diagnostico.id);
    const deletedDiagnostico: DiagnosticoEntity = await repository.findOne({ where: { id: diagnostico.id } });
    expect(deletedDiagnostico).toBeNull();
  });

  it('delete should throw an exception when the diagnostico does not exist', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "Diagnostico no encontrado");
  });
});
