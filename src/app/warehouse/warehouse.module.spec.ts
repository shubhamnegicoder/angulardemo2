import { WarehouseModule } from './warehouse.module';

describe('WarehouseModule', () => {
  let warehouseModule: WarehouseModule;

  beforeEach(() => {
    warehouseModule = new WarehouseModule();
  });

  it('should create an instance', () => {
    expect(warehouseModule).toBeTruthy();
  });
});
