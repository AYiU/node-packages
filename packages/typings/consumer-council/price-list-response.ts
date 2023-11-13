export interface ConsumerCouncilPriceListResponse {
  result: boolean;
  redirect: string;
  sysmsg: string;
  errors: any[];
  data: Datum[];
  filter: any[];
  total: number;
  more: boolean;
}

export interface Datum {
  name: string;
  nameEN: string;
  nameSC: string;
  brand: string;
  brandEN: string;
  brandSC: string;
  cat1: string;
  cat2: string;
  cat3: string;
  code: string;
  barcode: string;
  salt: Salt;
  sugar: Salt;
  data: Data;
  lastUpdate: Date;
}

export interface Data {
  JASONS?: PriceData;
  PARKNSHOP: PriceData;
  WELLCOME?: PriceData;
  AEON?: PriceData;
  DCHFOOD?: PriceData;
  ZTORE?: PriceData;
}

export interface PriceData {
  ItemCode: string;
  SupermarketCode: SupermarketCode;
  Price: number | string;
  PriceDateShort: Date;
  PriceRemark: string;
  PriceRemarkEN: string;
  PriceRemarkSC: string;
  PriceAvgRemark: string;
  PriceAvgRemarkEN: string;
  PriceAvgRemarkSC: string;
  PriceAvg: number;
  PricePerUnit: number;
  PriceAvgPerUnit: number;
}

export enum SupermarketCode {
  Jasons = "JASONS",
  Parknshop = "PARKNSHOP",
  Wellcome = "WELLCOME",
}

export enum Salt {
  Y = "Y",
}
