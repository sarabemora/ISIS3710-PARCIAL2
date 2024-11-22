import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MedicoService } from './medico.service';
import { Repository } from 'typeorm';
import { MedicoEntity } from './medico.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { PacienteEntity } from '../paciente/paciente.entity';

describe('MedicoService', () => {
  let service: MedicoService;
  let repository: Repository<MedicoEntity>;
  let pacienteRepository: Repository<PacienteEntity>;
  let medicoList: MedicoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [MedicoService],
    }).compile();

    service = module.get<MedicoService>(MedicoService);
    repository = module.get<Repository<MedicoEntity>>(getRepositoryToken(MedicoEntity));
    pacienteRepository = module.get<Repository<PacienteEntity>>(getRepositoryToken(PacienteEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    await pacienteRepository.clear();
    medicoList = [];
    for (let i = 0; i < 5; i++) {
      const medico: MedicoEntity = await repository.save({
        nombre: faker.person.fullName(),
        especialidad: faker.lorem.word(),
        telefono: faker.phone.number(),
        pacientes: []
      });
      medicoList.push(medico);
    }
  };

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

  it('findOne should return a medico by id', async () => {
    const storedMedico: MedicoEntity = medicoList[0];
    const medico: MedicoEntity = await service.findOne(storedMedico.id);
    expect(medico).not.toBeNull();
    expect(medico.nombre).toEqual(storedMedico.nombre);
    expect(medico.especialidad).toEqual(storedMedico.especialidad);
    expect(medico.telefono).toEqual(storedMedico.telefono);
  });

  it('findOne should throw an exception when the medico does not exist', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "Médico no encontrado");
  })

  it('findAll should return all medicos', async () => {
    const medicos: MedicoEntity[] = await service.findAll();
    expect(medicos).not.toBeNull();
    expect(medicos).toHaveLength(medicoList.length);
  });

  it('delete should remove a medico by id', async () => {
    const medico: MedicoEntity = medicoList[0];
    await service.delete(medico.id);
    const deletedMedico: MedicoEntity = await repository.findOne({ where: { id: medico.id } });
    expect(deletedMedico).toBeNull();
  });

  it('delete should throw an exception when trying to remove a medico with a patient associated', async () => {
    const medico: MedicoEntity = medicoList[0];
    const paciente: PacienteEntity = await pacienteRepository.save({
      nombre: faker.person.fullName(),
      genero: 'Masculino',
      medicos: [medico],
      diagnosticos: []
    });
    medico.pacientes = [paciente];
    await repository.save(medico);

    await expect(service.delete(medico.id)).rejects.toHaveProperty("message", "No se puede eliminar un médico con pacientes asociados");
  });

  it('delete should throw an exception when the medico does not exist', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "Médico no encontrado");
  });
});
