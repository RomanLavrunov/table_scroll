import { IDocument } from "@/utilities/dataStorage/data.types";

export type DocumentIndexOrder = {
    [K in keyof IDocument]?: {
      isAscending: number[]
    }
  }

export interface SortArrayParams {
    data: IDocument[],
    sortKey: keyof IDocument,
    isAscending: boolean
}

export interface CurrentCoordinates {
  start: number, 
  end: number
}

export interface SortData {
  tableHeader: keyof IDocument,
  isAscending: boolean,
  currentCoordinates: CurrentCoordinates;
}

export interface sortIndexedArrayParams {
  sortData: SortData,
  documentsIndexMap: DocumentIndexOrder,
  dataArray: IDocument[]
}