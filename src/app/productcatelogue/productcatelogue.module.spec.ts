import { ProductcatelogueModule } from './productcatelogue.module';

describe('ProductcatelogueModule', () => {
  let productcatelogueModule: ProductcatelogueModule;

  beforeEach(() => {
    productcatelogueModule = new ProductcatelogueModule();
  });

  it('should create an instance', () => {
    expect(productcatelogueModule).toBeTruthy();
  });
});
