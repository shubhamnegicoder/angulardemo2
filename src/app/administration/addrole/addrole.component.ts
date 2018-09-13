import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';


import swal from 'sweetalert2';

import { Router } from '@angular/router';
import { APPSETTINGS, AppURLs } from '../../core/interfaces';
import { CommonService } from '../../core/services/common.service';
@Component({
  selector: 'app-addrole',
  templateUrl: './addrole.component.html',
  styleUrls: ['./addrole.component.css']
})
export class AddroleComponent implements OnInit {
  modulelist: Array<any>;
  rolename: string = "";
  isActive: boolean = true;
  submodulelist: Array<any>;
  permission: Array<any> = [];
  finalpermission: Array<any> = [];
  viewpermission: Array<any> = [];
  viewcheck: boolean = true;
  @ViewChild("view") view: ElementRef;
  @ViewChild("add") add: ElementRef;
  @ViewChild("edit") edit: ElementRef;
  @ViewChild("delete") delete: ElementRef;
  @ViewChild("import") import: ElementRef;
  @ViewChild("select") select: ElementRef;
  @ViewChild("selectsubmodule") selectsubmodule: ElementRef;
  @ViewChild("status") status: ElementRef;
  constructor(private commonService: CommonService, private el: ElementRef, private router: Router) {


  }

  ngOnInit() {

    this.moduleslist();
  }

  public modalevent(e) {
    this.modulelist.forEach((item) => {
      if (item.moduleId == e.target.value) {
        this.submodulelist = item.permission;
      }
      console.log(this.submodulelist, "mod")
    })
  }
  submoduleevent(e, parentmodule) {
    this.permission = [];
    this.modulelist.forEach(element => {
      if (element.moduleId == parentmodule) {
        element["permission"].forEach(item => {
          if (item.permissionId == e.target.value) {
            this.permission.push(item);
          }
        })
      }

    });


  }
  public checkallevent(e, moduleid) {
    if (e.target.checked == true) {
      this.modulelist.forEach((item) => {
        if (item.moduleId == moduleid) {
          item.permission.forEach(element => {
            element.addcheck = true
            element.viewcheck = true
            element.deletecheck = true
            element.editcheck = true
            element.importcheck = true

          });

        }
      })

    }
    else if (e.target.checked == false) {
      this.modulelist.forEach((item) => {
        if (item.moduleId == moduleid) {
          item.permission.forEach(element => {
            element.addcheck = false
            element.viewcheck = false
            element.deletecheck = false
            element.editcheck = false
            element.importcheck = false
          });
        }
      })

    }

  }
  // public addpermissionlist(e)
  // { console.log(this.selectsubmodule.nativeElement.value,"val")
  //    if(this.select.nativeElement.value=="" && this.selectsubmodule.nativeElement.value=="")
  //    {
  //     swal({
  //       title: 'Module and Submodule Selection in Mandatory',
  //       text: 'Error',
  //       type: 'warning'
  //     })
  //     return false;
  //    }

  //    if(!this.selectsubmodule.nativeElement.value)
  //    {
  //     swal({
  //       title: 'Submodule Selection is Mandatory ',
  //       text: 'Error',
  //       type: 'warning'
  //     })
  //     return false;
  //    }
  //    if(this.submodulelist.length==0)
  //    {
  //     swal({
  //       title: 'Submodule Selection is Empty ',
  //       text: 'Error',
  //       type: 'warning'
  //     })
  //     return false;
  //    }
  //    if(!this.select.nativeElement.value)
  //    {
  //     swal({
  //       title: "module Selection is Mandatory",
  //       text: 'Error',
  //       type: 'warning'
  //     })
  //     return false;
  //    }
  //    else
  //    {
  //     swal({
  //       title: 'Are you sure?',
  //       text: 'Permission details will be Temporarly added !',
  //       type: 'warning',
  //       showCancelButton: true,
  //        confirmButtonText: 'Yes',
  //       cancelButtonText: 'No'
  //      }).then((result) => {
  //       if (result.value) {
  //         for(let key of this.permission)
  //         {
  //           key.isAddSelected=this.add.nativeElement.checked;
  //           key.isEditSelected=this.edit.nativeElement.checked;
  //           key.isDeleteSelected=this.delete.nativeElement.checked;
  //           key.isViewSelected=this.view.nativeElement.checked;
  //           key.isImportSelected=this.import.nativeElement.checked;
  //         }
  //         this.permission.forEach((item)=>{
  //           this.finalpermission.push(item);
  //         })
  //         for(let key of this.finalpermission)
  //         {
  //           key.parentmodule="";
  //         }
  //         console.log(this.finalpermission,"fina")
  //         swal({
  //           title: 'Check Permission List To View',
  //           text: 'Successfully added',
  //           type: 'success'
  //         })
  //        ;
  //        this.submodulelist= this.submodulelist.filter(item=>!this.finalpermission.includes(item))
  //         this.modulelist.forEach((item)=>{
  //            this.submodulelist.forEach((element)=>{
  //              if(element.parentId==item.moduleId)
  //              {
  //                item.permission=this.submodulelist;
  //              }
  //            })

  //         })

  //         this.modulelist.forEach(element => {
  //             this.finalpermission.forEach(item=>{
  //               if(item.parentId==element.moduleId)
  //               {
  //                   item.parentmodule=element.module;
  //               }
  //             })

  //         });

  //       } 
  //       else if (result.dismiss === swal.DismissReason.cancel) 
  //       {
  //         swal(
  //           'Cancelled',
  //           'error'
  //         )
  //        }
  //       })


  //    }


  // }
  public back() {
    this.router.navigate(['/Role']);
  }
  public removepermission(id) {
    this.modulelist.forEach((item) => {
      this.finalpermission.forEach((element) => {
        if (element.parentId == item.moduleId) {

          if (element.permissionId == id) {
            item.permission.push(element);
            const index = this.finalpermission.indexOf(element)
            this.finalpermission.splice(index, 1);
          }

        }
      })

    })
  }
  public moduleslist() {
    this.commonService.getData(APPSETTINGS.base_url + AppURLs.rolepermission + "1").subscribe((res: any) => {
      console.log(res, "res");

      if (!res.isError) {
        // console.log(response,'res in customerlist');
        this.modulelist = res.model;

        for (let obj of this.modulelist) {

        }
        this.modulelist.forEach((item) => {
          for (let obj of item.permission) {
            obj.addcheck = false;
            obj.editcheck = false;
            obj.viewcheck = true;
            obj.deletecheck = false;
            obj.importcheck = false;
          }

        })
      } else {
        swal({ type: 'error', text: res.errorMessage });
      }
    }, (error: any) => {
     this.commonService.handleError(error);

    })
  }

  public submitrole() {
    let tempdata: Array<any> = [];
    this.modulelist.forEach((item) => {
      item.permission.forEach(element => {

        tempdata.push(JSON.parse(JSON.stringify(element)));

        console.log(tempdata, "el")
      });
    })
    let finaldata = Array.from(tempdata);

    finaldata.forEach((item) => {
      item.isAddSelected = item.addcheck
      delete item.addcheck
      item.isViewSelected = item.viewcheck
      delete item.viewcheck
      item.isImportSelected = item.importcheck
      delete item.importcheck
      item.isEditSelected = item.editcheck
      delete item.editcheck
      item.isDeleteSelected = item.deletecheck
      delete item.deletecheck
    })
    let data = {
      "roleName": this.rolename,
      "isActive": this.isActive,
      "updatePermission": finaldata
    }

    console.log(data, "daaa")

    if (this.rolename == "" || !this.rolename) {
      swal({
        title: 'Role Name  is Mandatory',
        text: 'Error',
        type: 'warning'
      })
      return false;
    }
    else {
      swal({
        title: 'Are you sure?',
        text: 'Role And Permission details will be Created !',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {

          this.commonService.putData(APPSETTINGS.base_url + AppURLs.submitrole, data).subscribe((res: any) => {

            if (res.isError == false) {
              swal({
                title: res.message,
                text: '',
                type: 'success'
              })
              this.router.navigate(['/Role']);
            }

            else if (res.isError == true) {
              swal({
                title: res.message,
                text: '',
                type: 'error'
              })
            }
          })

        }
        else if (result.dismiss === swal.DismissReason.cancel) {
          swal(
            'Cancelled',
            'error'
          )
        }
      })

    }


  }
}
