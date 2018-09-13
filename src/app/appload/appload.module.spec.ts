import { ApploadModule } from './appload.module';

describe('ApploadModule', () => {
  let apploadModule: ApploadModule;

  beforeEach(() => {
    apploadModule = new ApploadModule();
  });

  it('should create an instance', () => {
    expect(apploadModule).toBeTruthy();
  });
});
