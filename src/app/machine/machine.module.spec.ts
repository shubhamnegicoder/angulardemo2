import { MachineModule } from './machine.module';

describe('MachineModule', () => {
  let machineModule: MachineModule;

  beforeEach(() => {
    machineModule = new MachineModule();
  });

  it('should create an instance', () => {
    expect(machineModule).toBeTruthy();
  });
});
