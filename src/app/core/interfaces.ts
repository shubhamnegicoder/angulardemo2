
export class APPSETTINGS {
    static base_url: string;
    static operator_base_url: string;
    static ims_url: string;
    static printBase_url: string;
    static import_url: string;
    static payment_url: string;
}
export class AppURLs {
    static authUrl = 'Account/Authenticate';
    static getUser = 'Account?userId=';
    static changePassword = 'Account/ChangePassword';
    static getCountryList = 'api/Country/GetCountryList';
    static createCountry = 'api/Country';
    static updateCountry = 'api/Country';
    static statusCountry = 'api/Country';
    static machineListing = 'Machine/List';
    static GetMachineMake = 'Machine/Make';
    static GetMachineType = 'Machine/Type';
    static GetMachineModel = 'Machine/Model';
    static CreatePlanogramTemplate = 'PlanogramTemplate';
    static GetPlanogramTemplateById = 'PlanogramTemplate'
    static planogramListing = 'PlanogramTemplate/Search';
    static rolelist = 'Role?roleId=';
    static vendorList = 'api/Vendor/GetVendorSeacrh';
    static customerListing = 'Customer/Search';
    static CreateCustomer = 'Customer';
    static getCountryalllist = 'api/Country/GetAllCountry';
    static getstatebycountry = 'api/Region/GetRegionByCountry?CountryId=';
    static getcitybystate = 'api/City/GetCitiesByState?StateId=';
    static GetRole = 'Role/Permission?roleId=';
    static getCustomerLocation = 'Customer/Location/Search';
    static operationLocationList = 'Operator/OperationLocation/List';
    static getCustomerList = 'Customer/List';
    static createCustomerLocation = 'Customer/Location';
    static getEditcustomerDetail = 'Customer?customerId=';
    static editCustomer = 'Customer';
    static getEditCustomerLocationDetail = 'Customer/Location?customerLocationId=';
    static editCustomerLocation = 'Customer/Location'
    static GetMachineList = 'Machine/Search';
    static GetVposList_DD = 'VPOS/List';
    static GetCashBoxList_DD = 'CashBox/List';
    static GetTelemetryList_DD = 'Telemetry/List';
    static GetCustomerList_DD = '';
    static GetCustomerLocationList_DD = 'Customer/Location/List';
    static GetPlanogramTemplateList_DD = 'PlanogramTemplate/List';
    static GetOperatorLocationList_DD = 'Operator/OperationLocation/List';
    static GetMachineComponentType_DD = 'Machine/Component/Type';
    static GetMachineComponentListByMachineId = 'Machine/Component/List';
    static CreateMachine = 'Machine';
    static getproduct = 'api/Item/GetItemSeacrh';
    static categoryForDropdown = 'api/Category/GetAll';
    static brandForDropdown = 'api/Brand/GetAll';
    static importProduct = 'api/item/import';
    static dataToGetCreateProduct = 'api/Item/GetAllProductMasters';
    static createBrand = 'api/Brand';
    static createSubBrand = 'api/SubBrand';
    static getProductTypeList = 'api/ProductType/GetProductTypeList';
    static productType = 'api/ProductType';
    static selectBrand = 'api/SubBrand/GetByParentId?Id=';
    static createCategory = 'api/Category';
    static selectCategory = 'api/SubCategory/GetByParentId';
    static createSubCategory = 'api/SubCategory';
    static createDepartment = 'api/Department';
    static createCompany = 'api/Company';
    static allCountry = 'api/Country/GetAllCountry';
    static createTax = 'api/Tax';
    static oneProduct = 'api/Item?Id=';
    static apiForProduct = '/api/Item';
    static getBrandList = 'api/Brand/GetBrandList';
    static getCategoryList = 'api/Category/GetCategoryList';
    static getCompanyList = 'api/Company/GetCompanyList';
    static getDepartmentList = 'api/Department/GetDepartmentList';
    static getItemMargin = 'api/ItemMargin/GetItemMarginCityItem';
    static getItemMarginList = 'api/ItemMargin/GetItemMarginList';
    static itemMargin = 'api/ItemMargin';
    static getSubBrand = 'api/SubBrand/GetSubBrandList';
    static getSubCategoryList = 'api/SubCategory/GetSubCategoryList';
    static getTaxList = 'api/Tax/GetTaxList';

    static AddMachineComponent = 'Machine/Component';
    static SaveMachinePlanogramTemplateId = 'Machine/PlanogramTemplate';
    static SaveMachineLocationData = 'Machine/Location';

    static getPurchaseOrderList = 'api/Inbound/GetPurchaseOrderList';
    static getIbsearchData = 'api/Inbound/GetIBListSearchDetails';
    static getVendoeWHbycity = 'api/Inbound/GetVendorWHByCity?CityId=';
    static getAutoName = 'api/Item/GetSearchedItemList?Name=';
    static getWHCity = 'api/City/GetWHCities';
    static getWHbyCity = 'api/Inbound/GetVendorWHByCity?CityId=';
    static getPoList = 'api/Inbound/GetClosedPOList?WHId=';
    static searchPoitem = 'api/Inbound/GetAllSearchedPOItems';
    static vendorAddDetail = 'api/Vendor/GetVendorDetail?Id=';
    static CreatePO = 'api/Inbound/CreatePO';
    static editPODetail = 'api/Inbound/GetPurchaseOrderDetail?Id=';
    static CanclePO = 'api/Inbound/CancelPO?Id=';
    static DelectPOitem = 'api/Inbound/DeletePOItem?Id=';
    static AddPOitem = 'api/Inbound/InsertPOItems';
    static updatePO = 'api/Inbound/UpdatePOItems';
    static getState = 'api/Region/GetRegionList';
    static createState = 'api/Region/';
    static getCity = 'api/City/GetCityList';
    static createCity = 'api/City';
    static InboundDetails = 'api/Inbound/GetIBListSearchDetails';
    static AccountList = '/Account/Search';
    static getGrnList = 'api/Inbound/GetGRNList';

    static getCities = 'api/City/GetCitiesByState?StateId=';
    static printGrn = 'api/Inbound/PrintGRN';
    static getWarehouseByPendingPo = 'api/Warehouse/GetWarehouseByPendingPO';
    static getVendorByPendingPo = 'api/Vendor/GetVendorforPendingPO?WHId=';
    static getPOList = 'api/Inbound/GetPurchaseOrderDetail?Id=';
    static manageGrn = 'api/Inbound/ManageGRNDetails';
    static getOneGrn = 'api/Inbound/GetGRNDetails?Id=';

    static getSearchedGrnItems = 'api/Inbound/GetAllSearchedGRNItems';
    static releaseGrn = 'api/Inbound/ReleaseGRN';
    static newItemsInGrn = 'api/Inbound/InsertNewGRNDetails';
    // static vendorList = 'api/Vendor/GetVendorSeacrh';

    static TelemetryList = 'Telemetry/Search';
    static SaveTelemetry = 'Telemetry';
    static CashBoxList = 'CashBox/Search';
    static VPOSList = 'VPOS/Search';
    static OperationLocationDropdown = 'Operator/OperationLocation/List';
    static getWarehouseList = 'api/Warehouse/GetWarehouseSeacrh';
    static importWarehouse = 'api/Warehouse/Import';
    static getWarehouse = 'api/Warehouse/GetWarehouseByUserId?UserId=';
    static getTransferOrderList = 'api/TransferOrder/GetTransferOrderList';
    static getTransferOrderDetail = 'api/TransferOrder/GetTODetail?Id=';
    static getTransferOrderLocation = 'api/TransferOrder/GetTOLocations?TransferType=';

    static getTOSearchedItems = '/api/TransferOrder/GetAllSearchedTOItems';
    static CreateTO = 'api/TransferOrder/CreateTO';
    static deleteTO = 'api/TransferOrder/DeleteTOI?Id=1';
    static insertTransferOrder = 'api/TransferOrder/InsertTOItems';
    static updateTransferOrder = 'api/TransferOrder/UpdateTO';
    static releaseTO = 'api/TransferOrder/ReleaseTO?Id=';

    static rolepermission = "Role/Permission?roleId=";
    static submitrole = "Role/Permission";

    static getPurchaseReturnList = 'api/Outbound/GetPurchaseReturnList';
    static editPRODetail = 'api/Outbound/GetPRODetail?Id=';
    static GetPaymentMode = 'getPaymentMode';
    static SearchPRO = 'api/Outbound/GetAllSearchedPROItems';
    static CraetePRO = 'api/Outbound';
    static insertPROitem = 'api/Outbound/InsertItems';
    static DeletePROitem = 'api/Outbound/DeletePROItem?Id=';
    static updatePRO = 'api/Outbound/UpdatePROItems';
    static ReleasePRO = 'api/Outbound/ReleasePurchaseReturn';
    static getTRNList = 'api/TransferReceiptNote/GetTransferReceiptNoteList';
    static getTRNdetail = 'api/TransferReceiptNote/GetById?Id=';
    static getTRNitem = 'api/TransferReceiptNote/GetAllTRNItems';
    static ADDTRNitem = 'api/TransferReceiptNote/AddTRNItems';
    static releaseTRN = 'api/TransferReceiptNote/ReleaseTRN';
    static updateTRN = 'api/TransferReceiptNote/UpdateTRN';
    // static AddMachineComponent = 'Machine/Component';
    // static SaveMachinePlanogramTemplateId = 'Machine/PlanogramTemplate';
    // static SaveMachineLocationData = 'Machine/Location';
    static GetMachineInfo = 'Machine';
    static trnMismatchLocations = 'api/TransferReceiptNote/GetTRNLocations';
    static trnMismatchList = 'api/TransferReceiptNote/GetTRNMismatchList';
    static releasedTrnMismatch = 'api/TransferReceiptNote/ReleaseTRNMismatch';
    static getOneTrnMismatch = 'api/TransferReceiptNote/GetById?Id=';
    static operationLocationSearch = 'Operator/OperationLocation/Search';
    //ims api's
    static GetSearchedItemList = 'api/Item/GetSearchedItemList';
    static SendPlanogramProductsData = 'api/Planogram';
}
export interface trnmismatch {
    name: string;
    id: number;
    address1: string;
    address2: string;
    billingAddress1: string;
    billingAddress2: string;
    billingCINNo: string;
    billingCityId: string;
    billingCountryId: string;
    billingEmail: string;
    billingGSTIN: string;
    billingPOBox: string;
    billingPhone: string;
    billingStateId: string;
    cityName: string;
    countryName: string;
    isActive: boolean;
    mainWarehouse: boolean;
    panNo: string;
    phone: string;
    poBox: string;
    regionName: string;
    shippingAddress1: string;
    shippingAddress2: string;
    shippingCINNo: string;
    shippingCityId: string;
    shippingCountryId: string;
    shippingEmail: string;
    shippingGSTIN: string;
    shippingPOBox: string;
    shippingPhone: string;
    shippingStateId: string;
    userId: string;
}
export interface Telemetry {
    'name': string;
    'serialNo': string;
    'operationLocation': string;
}

export interface VPOS {
    'name': string;
    'serialNo': string;
    'operationLocation': string;
}

export interface CashBox {
    'name': string;
    'serialNo': string;
    'operationLocation': string;
}

export interface OperatorModuleDropdown {
    'id': number;
    'name': string;
}

export interface planogramObject {
    'planogramTemplateRowId': number;
    'rowNum': number;
    'numOfBins': number;
    'spiralPerBin': number;
    'colspanArr': Array<any>;
    'numOfColToBeCreated': number;
}

export interface PlanogramTemplateObject {
    "machineMakeId": number,
    "machineModelId": number,
    "machineTypeId": number,
    "rowsCount": number,
    "perRowBinCount": number,
    "statusId": number,
    "planogramTemplateRows": Array<PlanogramTemplateRowObject>
}

export interface PlanogramTemplateRowObject {

    "planogramTemplateRowId": number,
    "perRowBinCount": number,
    "perBinSpiralCount": number,
    "rowId": number,
    "planogramTemplateBins": Array<any>
}



export interface IUser {
    email: string;
    password: string;
}
export interface Product {
    uom: string;
    price: string;
    barCode: string;
    hsnCode: string;
    taxPercentage: string;
    margin: string;
    landingPrice: string;
    basePrice: string;
    amount: string;
    stock: string;
    quantity: string;
    conversion: number;
    departmentId: string;
    companyId: string;
    productTypeId: string;
    brandId: string;
    categorId: string;
    uomId: number;
    taxId: string;
    subBrandId: string;
    subCategoryId: string;
    id: number;
    name: string;
    isActive: number;
    categoryName: string;
    brandName: string;
}
export interface UserProfile {
    userId: string;
    username: string;
    operatorId: string;
    operatorName: string;
    email: string;
    rolePermission: any;
    roleData: any;
}

export interface TokenController {
    expiresAt: string;
    token: string;
}

export interface NavModule {
    'module': string;
    'moduleId': string;
    'roleName': string;
    'roleId': number;
    'permission': Array<RolePermission>;
}

export interface RolePermission {

    'subModule': string;
    'isSelected': boolean;
    'component': string;
    'action': string;
    'permissionId': string;
    'isAddSelected': string;
    'isEditSelected': number;
    'isDeleteSelected': number;
    'isImportSelected': number;
    'isViewSelected': number;
    'parentId': number;


}
export interface StateListModal {
    code: string;
    countryName: string;
    countryId: string;
    id: string;
    name: string;
    isActive: string;
}



