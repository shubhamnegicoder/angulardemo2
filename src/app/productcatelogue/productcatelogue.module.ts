import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ProductcatelogueComponent } from './productcatelogue/productcatelogue.component';
import { ProductComponent } from '../product/product.component';
import { CanactivateGuard } from '../core/canactivate.guard';
import { CreateProductComponent } from '../product/create-product/create-product.component';
import { EditProductComponent } from '../product/edit-product/edit-product.component';
import { BrandComponent } from '../brand/brand.component';
import { SubBrandComponent } from '../sub-brand/sub-brand.component';
import { CategoryComponent } from '../category/category.component';
import { SubCategoryComponent } from '../sub-category/sub-category.component';
import { DepartmentComponent } from '../department/department.component';
import { CompanyComponent } from '../company/company.component';
import { TaxComponent } from '../tax/tax.component';
import { ProductTypeComponent } from '../product-type/product-type.component';
import { ProductMarginComponent } from '../product-margin/product-margin.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VendorComponent } from '../vendor/vendor.component';
import { GrnComponent } from '../grn/grn.component';
import { EditGrnComponent } from '../grn/edit-grn/edit-grn.component';
import { ViewGrnComponent } from '../grn/view-grn/view-grn.component';
const productRoutes: Routes = [
  {
    path: '',
    component: ProductcatelogueComponent,
    pathMatch: 'prefix',
    children: [
      { path: '', component: BrandComponent },
      { path: 'Product', component: ProductComponent, canActivate: [CanactivateGuard] },
      { path: 'Product/Create', component: CreateProductComponent, canActivate: [CanactivateGuard] },
      { path: 'Product/Update/:id', component: EditProductComponent, canActivate: [CanactivateGuard] },
      { path: 'Brand', component: BrandComponent, canActivate: [CanactivateGuard] },
      { path: 'SubBrand', component: SubBrandComponent, canActivate: [CanactivateGuard] },
      { path: 'Category', component: CategoryComponent, canActivate: [CanactivateGuard] },
      { path: 'Subcategory', component: SubCategoryComponent, canActivate: [CanactivateGuard] },
      { path: 'Department', component: DepartmentComponent, canActivate: [CanactivateGuard] },
      { path: 'Company', component: CompanyComponent, canActivate: [CanactivateGuard] },
      { path: 'Tax', component: TaxComponent, canActivate: [CanactivateGuard] },
      { path: 'ProductType', component: ProductTypeComponent, canActivate: [CanactivateGuard] },
      { path: 'ProductMargin', component: ProductMarginComponent, canActivate: [CanactivateGuard] },
      { path: 'Vendor', component: VendorComponent, canActivate: [CanactivateGuard] }
    ]
  }

];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(productRoutes),
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [RouterModule],
  declarations: [
    ProductcatelogueComponent,
    ProductComponent,
    ProductMarginComponent,
    ProductTypeComponent,
    TaxComponent,
    BrandComponent,
    SubBrandComponent,
    CategoryComponent,
    SubCategoryComponent,
    DepartmentComponent,
    CompanyComponent,
    EditProductComponent,
    CreateProductComponent,
    VendorComponent

  ]
})
export class ProductcatelogueModule { }
