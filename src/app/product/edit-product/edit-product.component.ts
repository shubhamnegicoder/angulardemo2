import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import swal from 'sweetalert2';
import { CommonService } from '../../core/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { APPSETTINGS, AppURLs } from '../../core/interfaces';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  id;
  productTypeId;
  dataToEditList: any = {};
  brandViewModels1: Array<any> = [];
  categoryViewModels1: Array<any> = [];
  companyViewModels1: Array<any> = [];
  departmentViewModels1: Array<any> = [];
  itemViewModel1: any = {};
  productTypeViewModels1: Array<any> = [];
  subBrandViewModels1: Array<any> = [];
  subCategories1: Array<any> = [];
  taxViewModels1: Array<any> = [];
  uOMViewModels1: Array<any> = [];
  status: boolean = false;
  productTypeName: string = '';
  data = {
    'name': '',
    'mainName': '',
    'cess': '',
    'taxField': '',
    'country': ''
  };
  data1 = {
    'status': ''
  };
  data2 = {
    'brand': '',
    'category': '',
    'tax': '',
    'subBrand': '',
    'subCategory': '',
    'department': '',
    'productType': '',
    'company': ''
  };
  countryList: Array<any> = [];
  constructor(private router: Router, private route: ActivatedRoute, private spinner: NgxSpinnerService, private commonService: CommonService) { }

  ngOnInit() {
    this.commonService.setTitle('IMS-Catalogue-Product-Edit');
    this.id = this.route.snapshot.params['id'];
    this.getOneProduct(this.id);
    this.getCountryList();
  }
  isItemExistInArray(data: Array<any>, idToFind: number): boolean {
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === idToFind) {
        return true;
      }
    }
    return false;
  }

  public getOneProduct(id) {
    this.spinner.show();
    this.commonService.getData(APPSETTINGS.ims_url + AppURLs.oneProduct + id).subscribe((res: any) => {
      console.log('res in getOneProduct', res);
      this.spinner.hide();
      if (!res.didError) {
        this.dataToEditList = res.model;
        this.brandViewModels1 = res.model.brandViewModels;
        this.categoryViewModels1 = res.model.categoryViewModels;
        console.log(' this.brandViewModels1', this.brandViewModels1)
        this.companyViewModels1 = res.model.companyViewModels;
        this.departmentViewModels1 = res.model.departmentViewModels;
        this.itemViewModel1 = res.model.itemViewModel;
        if (this.itemViewModel1.isActive == 1) {
          this.data1.status = 'true';
        } else {
          this.data1.status = 'false';
        }
        this.productTypeViewModels1 = res.model.productTypeViewModels;
        this.subBrandViewModels1 = res.model.subBrandViewModels;
        this.subCategories1 = res.model.subCategories;
        this.taxViewModels1 = res.model.taxViewModels;
        this.uOMViewModels1 = res.model.uOMViewModels;
        this.data2 = {
          'brand': (this.isItemExistInArray(this.brandViewModels1, eval(this.itemViewModel1.brandId))) === true ? this.itemViewModel1.brandId : '',
          'category': (this.isItemExistInArray(this.categoryViewModels1, eval(this.itemViewModel1.categorId))) === true ? this.itemViewModel1.categorId : '',
          'tax': (this.isItemExistInArray(this.taxViewModels1, eval(this.itemViewModel1.taxId))) === true ? this.itemViewModel1.taxId : '',
          'subBrand': (this.isItemExistInArray(this.subBrandViewModels1, eval(this.itemViewModel1.subBrandId))) === true ? this.itemViewModel1.subBrandId : '',
          'subCategory': (this.isItemExistInArray(this.subCategories1, eval(this.itemViewModel1.subCategoryId))) === true ? this.itemViewModel1.subCategoryId : '',
          'department': (this.isItemExistInArray(this.departmentViewModels1, eval(this.itemViewModel1.departmentId))) === true ? this.itemViewModel1.departmentId : '',
          'productType': (this.isItemExistInArray(this.productTypeViewModels1, eval(this.itemViewModel1.productTypeId))) === true ? this.itemViewModel1.productTypeId : '',
          'company': (this.isItemExistInArray(this.companyViewModels1, eval(this.itemViewModel1.companyId))) === true ? this.itemViewModel1.companyId : ''
        };
      } else {
        swal({ type: 'warning', text: 'Error in processing the request', showConfirmButton: true });
      }
    }, err => {
      this.spinner.hide();
       this.commonService.handleError(err);
    });
  }

  back() {
    this.router.navigate(['/Product']);
  }


  public update(name, price, hsnCode, barCode) {
    let isActive;
    if (this.data1.status) {
      isActive = '1';
    } else {
      isActive = '0';
    }
    let dataToUpdate = {
      "itemId": this.itemViewModel1.id,
      "name": name,
      "isActive": isActive,
      "brandId": this.data2.brand,
      "uomId": this.itemViewModel1.uomId,
      "categoryId": this.data2.category,
      "taxId": this.data2.tax,
      "userId": "1",
      "price": price,
      "subBrandId": this.data2.subBrand,
      "subCategoryId": this.data2.subCategory,
      "barCode": barCode,
      "hsnCode": hsnCode,
      "departmentId": this.data2.department,
      "itemTypeId": this.data2.productType,
      "companyId": this.data2.company
    }
    let msg = '';
    console.log('dataToUpdate', dataToUpdate);
    if (dataToUpdate.name === "" || dataToUpdate.brandId === "" || dataToUpdate.taxId === "" || dataToUpdate.categoryId === "" ||
      dataToUpdate.price === "" || dataToUpdate.hsnCode === "" || dataToUpdate.departmentId === "" || dataToUpdate.itemTypeId === "" || dataToUpdate.companyId === "") {
      msg = 'Please fill all the required fields';
    }
    if (msg != '') {
      swal({ type: 'warning', text: msg, showConfirmButton: true });
    } else {
      this.spinner.show();
      this.commonService.putData(APPSETTINGS.ims_url + AppURLs.apiForProduct, dataToUpdate).subscribe((res: any) => {
        this.spinner.hide();
        if (!res.didError) {
          console.log('res in edit function', res);
          swal({ type: 'success', text: 'Product updated successfully', showConfirmButton: true });
          this.router.navigate(['/Product']);
        } else {
          swal({ type: 'warning', text: 'Error in processing the request', showConfirmButton: true });
        }
      }, err => {
        this.spinner.hide();
        this.commonService.handleError(err);
    });
  }
  }

  createBrand(name) {
    if (name === '') {
      swal({ type: 'warning', text: 'Please select a name', showConfirmButton: true });
    } else {
      let data = {
        "id": "",
        "name": name,
        "status": "",
        "isList": "1"
      }
      this.spinner.show();
      this.commonService.postData(APPSETTINGS.ims_url + AppURLs.createBrand, data).subscribe((res: any) => {
        this.spinner.hide();
        this.data.name = '';
        if (!res.didError) {
          this.brandViewModels1 = res.model.brandViewModels;
          swal({ type: 'success', text: 'Brand added successfully', showConfirmButton: true });
          this.data2.brand = this.brandViewModels1[0].id;
        } else {
          swal({ type: 'warning', text: 'Error in processing the request', showConfirmButton: true });
        }
      }, err => {
        this.spinner.hide();
       // swal({ type: 'error', text: err.error.errorMessage, showConfirmButton: true });
       this.commonService.handleError(err);
       this.data.name = '';
      });
    }
  }

  public createSubBrand(name, brandName1) {
    let msg = '';
    if (name === '') {
      msg = 'Please enter a sub brand name';
    }
    if (brandName1 === '') {
      msg = 'Please select a brand name';
    }
    if (msg != '') {
      swal({ type: 'warning', text: msg, showConfirmButton: true });
    } else {
      let data = {
        "parentId": brandName1,
        "id": "",
        "name": name,
        "status": "",
        "isList": "1"
      }
      this.spinner.show();
      this.commonService.postData(APPSETTINGS.ims_url + AppURLs.createSubBrand, data).subscribe((res: any) => {
        this.spinner.hide();
        this.data.name = '';
        this.data.mainName = '';
        if (!res.didError) {
          this.subBrandViewModels1 = res.model.subBrandViewModels;
          swal({ type: 'success', text: 'Sub brand added successfully', showConfirmButton: true });
          this.data2.subBrand = this.subBrandViewModels1[0].id;
        } else {
          swal({ type: 'warning', text: 'Error in processing the request', showConfirmButton: true });
        }

      }, err => {
        this.spinner.hide();
      //  swal({ type: 'error', text: err.error.errorMessage, showConfirmButton: true });
      this.commonService.handleError(err);  
      this.data.name = '';
        this.data.mainName = '';
      });
    }
  }

  public selectBrand(event) {
    let id = event.target.value;
    this.commonService.getData(APPSETTINGS.ims_url + AppURLs.selectBrand + id).subscribe((res: any) => {
      this.subBrandViewModels1 = res.model;
    })
  }

  public createCategory(categoryName) {
    let data = {
      "id": "",
      "name": categoryName,
      "status": "",
      "isList": "1"
    }
    this.spinner.show();
    this.commonService.postData(APPSETTINGS.ims_url + AppURLs.createCategory, data).subscribe((res: any) => {
      this.spinner.hide();
      this.data.name = '';
      if (!res.didError) {
        this.categoryViewModels1 = res.model.categoryViewModels;
        swal({ type: 'success', text: 'Category added successfully', showConfirmButton: true });
        this.data2.category = this.categoryViewModels1[0].id;
      } else {
        swal({ type: 'warning', text: 'Error in processing the request', showConfirmButton: true });
      }

    }, err => {
      this.spinner.hide();
     // swal({ type: 'error', text: err.error.errorMessage, showConfirmButton: true });
     this.commonService.handleError(err);
     this.data.name = '';
    });
  }

  public selectCategory(event) {
    let data = {
      "requestedId": event.target.value,
    }
    this.commonService.postData(APPSETTINGS.ims_url + AppURLs.selectCategory, data).subscribe((res: any) => {
      this.subCategories1 = res.model;
    })
  }

  public createSubCategory(subCategoryName, categoryId) {
    let msg = '';
    if (subCategoryName === '') {
      msg = 'Please enter a sub category name';
    }
    if (categoryId === '') {
      msg = 'Please select a category name';
    }
    if (msg != '') {
      swal({ type: 'warning', text: msg, showConfirmButton: true });
    } else {
      let data = {
        "parentId": categoryId,
        "id": "",
        "name": subCategoryName,
        "status": "",
        "isList": "1"
      }
      this.spinner.show();
      this.commonService.postData(APPSETTINGS.ims_url + AppURLs.createSubCategory, data).subscribe((res: any) => {
        this.spinner.hide();
        this.data.name = '';
        this.data.mainName = '';
        if (!res.didError) {
          this.subCategories1 = res.model.subCategoryViewModels;
          swal({ type: 'success', text: 'Sub Category added successfully', showConfirmButton: true });

          this.data2.subCategory = this.subCategories1[0].id;
        } else {
          swal({ type: 'warning', text: 'Error in processing the request', showConfirmButton: true });
        }

      }, err => {
        this.spinner.hide();
       // swal({ type: 'error', text: err.error.errorMessage, showConfirmButton: true });
       this.commonService.handleError(err); 
       this.data.name = '';
        this.data.mainName = '';
      });
    }
  }

  public createDepartment(departName) {
    let msg = '';
    if (departName === '') {
      msg = 'Please enter a department name';
    }
    if (msg != '') {
      swal({ type: 'warning', text: msg, showConfirmButton: true });
    } else {
      let data = {
        "id": "",
        "name": departName,
        "status": "",
        "isList": "1"

      }
      this.spinner.show();
      this.commonService.postData(APPSETTINGS.ims_url + AppURLs.createDepartment, data).subscribe((res: any) => {
        this.spinner.hide();
        this.data.name = '';
        if (!res.didError) {
          this.departmentViewModels1 = res.model.departmentViewModels;
          swal({ type: 'success', text: 'Department added successfully', showConfirmButton: true });

          this.data2.department = this.departmentViewModels1[0].id;
        } else {
          swal({ type: 'warning', text: 'Error in processing the request', showConfirmButton: true });
        }
      }, err => {
        this.spinner.hide();
        //swal({ type: 'error', text: err.error.errorMessage, showConfirmButton: true });
        this.commonService.handleError(err);
        this.data.name = '';
      });
    }

  }

  public createCompany(companyName) {
    let msg = '';
    if (companyName === '') {
      msg = 'Please enter a company name';
    }
    if (msg != '') {
      swal({ type: 'warning', text: msg, showConfirmButton: true });
    } else {
      let data = {
        "id": "",
        "name": companyName,
        "status": "",
        "isList": "1"
      }
      this.spinner.show();
      this.commonService.postData(APPSETTINGS.ims_url + AppURLs.createCompany, data).subscribe((res: any) => {
        this.spinner.hide();
        this.data.name = '';
        if (!res.didError) {
          this.companyViewModels1 = res.model.companyViewModels;
          swal({ type: 'success', text: 'Company added successfully', showConfirmButton: true });
          this.data2.company = this.companyViewModels1[0].id;
        } else {
          swal({ type: 'warning', text: 'Error in processing the request', showConfirmButton: true });
        }

      }, err => {
        this.spinner.hide();
        this.commonService.handleError(err);
      //  swal({ type: 'error', text: err.error.errorMessage, showConfirmButton: true });
        this.data.name = '';
      });
    }
  }

  public close() {
    this.data.name = '';
  }

  public close1() {
    this.data.name = '';
    this.data.mainName = '';
  }

  public close2() {
    this.data.name = '';
    this.data.taxField = '';
    this.data.cess = '';
    this.data.country = '';
  }

  public getCountryList() {
    this.commonService.getData(APPSETTINGS.ims_url + AppURLs.allCountry).subscribe((res: any) => {
      if (!res.didiError) {
        this.countryList = res.model;
      }
    });
  }

  public createTax(taxName, tax, cess, countryId) {
    let data = {
      "id": "",
      "name": taxName,
      "igst": tax,
      "cess": cess,
      "isList": "1",
      "status": "",
      "countryId": countryId
    }

    this.spinner.show();
    this.commonService.postData(APPSETTINGS.ims_url + AppURLs.createTax, data).subscribe((res: any) => {
      this.spinner.hide();
      this.data.name = '';
      this.data.taxField = '';
      this.data.cess = '';
      this.data.country = '';
      if (!res.didError) {
        this.taxViewModels1 = res.model.taxViewModels;
        swal({ type: 'success', text: 'Tax added successfully', showConfirmButton: true });
        this.data2.tax = this.taxViewModels1[0].id;
      } else {
        swal({ type: 'warning', text: 'Error in processing the request', showConfirmButton: true });
      }
    }, err => {
      this.spinner.hide();
    //  swal({ type: 'error', text: err.error.errorMessage, showConfirmButton: true });
    this.commonService.handleError(err); 
    this.data.name = '';
      this.data.taxField = '';
      this.data.cess = '';
      this.data.country = '';
    })

  }

  public createProductType(prodName) {
    let data = {
      "id": "",
      "name": prodName,
      "status": "",
      "isList": "1"
    }
    this.spinner.show();
    this.commonService.postData(APPSETTINGS.ims_url + AppURLs.productType, data).subscribe((res: any) => {
      this.spinner.hide();
      this.data.name = '';
      if (!res.didiError) {
        this.productTypeViewModels1 = res.model.productTypeViewModels;
        swal({ type: 'success', text: 'Product type added successfully', showConfirmButton: true });
        this.data2.productType = this.productTypeViewModels1[0].id;
      } else {
        swal({ type: 'warning', text: 'Error in processing the request', showConfirmButton: true });
      }
    }, err => {
      this.spinner.hide();
      this.commonService.handleError(err);
     // swal({ type: 'error', text: err.error.errorMessage, showConfirmButton: true });
      this.data.name = '';
    });
  }
}
