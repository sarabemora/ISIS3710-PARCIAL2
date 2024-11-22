import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PacienteMedicoService } from './paciente-medico.service';
import { Repository } from 'typeorm';
import { PacienteEntity } from '../paciente/paciente.entity';
import { MedicoEntity } from '../medico/medico.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

describe('PacienteMedicoService', () => {
  let service: PacienteMedicoService;
  let pacienteRepository: Repository<PacienteEntity>;
  let medicoRepository: Repository<MedicoEntity>;
  let paciente: PacienteEntity;
  let medicosList: MedicoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PacienteMedicoService],
    }).compile();

    service = module.get<PacienteMedicoService>(PacienteMedicoService);
    pacienteRepository = module.get<Repository<PacienteEntity>>(getRepositoryToken(PacienteEntity));
    medicoRepository = module.get<Repository<MedicoEntity>>(getRepositoryToken(MedicoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    pacienteRepository.clear();
    medicoRepository.clear();

    medicosList = [];
    for(let i = 0; i < 5; i++) {
      const medico: MedicoEntity = await medicoRepository.save({
        nombre: faker.person.fullName(),
        especialidad: faker.lorem.word(),
        telefono: faker.phone.number(),
        pacientes: []
      });
      medicosList.push(medico);
    }

    paciente = await pacienteRepository.save({
      nombre: faker.person.fullName(),
      genero: "Masculino",
      medicos: medicosList,
      diagnosticos: []
    });
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addMedicoToPaciente should return add medico to a paciente', async () => {
    const newMedico: MedicoEntity = await medicoRepository.save({
      nombre: faker.person.fullName(),
      especialidad: faker.lorem.word(),
      telefono: faker.phone.number(),
      pacientes: []
    });

    const newPaciente: PacienteEntity = await pacienteRepository.save({
      nombre: faker.person.fullName(),
      genero: "Masculino",
      medicos: [],
      diagnosticos: []
    });

    const result: PacienteEntity = await service.addMedicoToPaciente(newPaciente.id, newMedico.id);

    expect(result.medicos.length).toBe(1);
    expect(result.medicos[0]).not.toBeNull();
    expect(result.medicos[0].nombre).toBe(newMedico.nombre);
    expect(result.medicos[0].especialidad).toBe(newMedico.especialidad);
    expect(result.medicos[0].telefono).toBe(newMedico.telefono);
  });

  it('addMedicoToPaciente should throw an exception when adding a invalid medico', async () => {
    const newPaciente: PacienteEntity = await pacienteRepository.save({
      nombre: faker.person.fullName(),
      genero: "Masculino",
      medicos: [],
      diagnosticos: []
    });

    await expect(() => service.addMedicoToPaciente(newPaciente.id, '0')).rejects.toHaveProperty("message", "Médico no encontrado");
  });

  it('addMedicoToPaciente should throw an exception when adding a invalid paciente', async () => {
    const newMedico: MedicoEntity = await medicoRepository.save({
      nombre: faker.person.fullName(),
      especialidad: faker.lorem.word(),
      telefono: faker.phone.number(),
      pacientes: []
    });

    await expect(() => service.addMedicoToPaciente('0', newMedico.id)).rejects.toHaveProperty("message", "Paciente no encontrado");
  });

  it('addMedicoToPaciente should throw an exception when adding more than 5 medicos to a paciente', async () => {
    const paciente: PacienteEntity = await pacienteRepository.save({
      nombre: faker.person.fullName(),
      genero: 'Masculino',
      medicos: [],
      diagnosticos: []
    });

    for (let i = 0; i < 5; i++) {
      const medico: MedicoEntity = await medicoRepository.save({
        nombre: faker.person.fullName(),
        especialidad: faker.lorem.word(),
        telefono: faker.phone.number(),
        pacientes: []
      });
      await service.addMedicoToPaciente(paciente.id, medico.id);
    }

    const sextoMedico: MedicoEntity = await medicoRepository.save({
      nombre: faker.person.fullName(),
      especialidad: faker.lorem.word(),
      telefono: faker.phone.number(),
      pacientes: []
    });

    await expect(service.addMedicoToPaciente(paciente.id, sextoMedico.id)).rejects.toHaveProperty("message", "El paciente no puede tener más de 5 médicos asignados");
  });
});
