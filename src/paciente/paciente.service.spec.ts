import { Test, TestingModule } from '@nestjs/testing';
import { PacienteService } from './paciente.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PacienteEntity } from './paciente.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { DiagnosticoEntity } from '../diagnostico/diagnostico.entity';

describe('PacienteService', () => {
  let service: PacienteService;
  let repository: Repository<PacienteEntity>;
  let pacientesList: PacienteEntity[];
  let diagnosticoRepository: Repository<DiagnosticoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PacienteService],
    }).compile();

    service = module.get<PacienteService>(PacienteService);
    repository = module.get<Repository<PacienteEntity>>(getRepositoryToken(PacienteEntity));
    diagnosticoRepository = module.get<Repository<DiagnosticoEntity>>(getRepositoryToken(DiagnosticoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    diagnosticoRepository.clear();
    pacientesList = [];
    for (let i = 0; i < 5; i++) {
      const paciente: PacienteEntity = await repository.save({
        nombre: faker.person.fullName(),
        genero: 'Masculino',
        medicos: [],
        diagnosticos: []
      })
      pacientesList.push(paciente);
    }
  }

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

  it('findOne should return a paciente by id', async () => {
    const storedPaciente: PacienteEntity = pacientesList[0];
    const paciente: PacienteEntity = await service.findOne(storedPaciente.id);
    expect(paciente).not.toBeNull();
    expect(paciente.nombre).toEqual(storedPaciente.nombre);
    expect(paciente.genero).toEqual(storedPaciente.genero);
  });

  it('findOne should throw an exception when the paciente does not exist', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "Paciente no encontrado");
  });

  it('findAll should return all pacientes', async () => {
    const pacientes: PacienteEntity[] = await service.findAll();
    expect(pacientes).not.toBeNull();
    expect(pacientes).toHaveLength(pacientesList.length);
  });

  it('delete should remove a paciente by id', async () => {
    const paciente: PacienteEntity = pacientesList[0];
    await service.delete(paciente.id);
    const deletedPaciente: PacienteEntity = await repository.findOne({ where: { id: paciente.id } });
    expect(deletedPaciente).toBeNull();
  });

  it('delete should throw an exception when trying to remove a paciente with a diagnostic associated', async () => {
    const paciente: PacienteEntity = pacientesList[0];
    const diagnostico: DiagnosticoEntity = await diagnosticoRepository.save({
      nombre: faker.person.firstName('female'),
      descripcion: faker.lorem.sentence(),
      paciente: paciente
    });
    paciente.diagnosticos = [diagnostico];
    await repository.save(paciente);
    await expect(() => service.delete(paciente.id)).rejects.toHaveProperty("message", "No se puede eliminar un paciente con diagnósticos asociados");
  });

  it('delete should throw an exception when the paciente does not exist', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "Paciente no encontrado");
  });
});
