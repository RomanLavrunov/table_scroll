import { IDocument } from "@/utilities/dataStorage/data.types";
import { DocumentIndexOrder, SortData } from "../sort/sort.types";
import { generateDocumentsIndexMap, sortIndexedDocumentsByHeader } from "../sort/sort";
import { DocumentStateSet, KeyIndexesObject } from "../indexing/indexing.types";
import { indexDocumentsByState } from "../indexing/indexing";

export class DataStorage {
    storage: IDocument[];
    documentsIndexMap: DocumentIndexOrder;
    isDownloaded: boolean;
    documentStateMap: KeyIndexesObject;

    constructor() {
        this.storage = [];
        this.documentsIndexMap = {};
        this.isDownloaded = false;
        this.documentStateMap = {};
    }

    addToStorage(documents: IDocument[]) {
        this.storage.push(...documents);
    }

    clearStorage() {
        this.storage = [];
    }

    setSortData (sortData: SortData) { 
        return this.sortByHeader(sortData);
    }

    set downloaded(finished: boolean) {
        this.isDownloaded = finished
        this.updateIndexMap();
        this.updateStateIndexMap()
    }

    get downloaded ():boolean {
        return this.isDownloaded
    }

    get stateIndexMap(): KeyIndexesObject {
        return this.documentStateMap;
    }

    get indexMap(): DocumentIndexOrder {
        return this.documentsIndexMap;
    }

    get documentAmout() {
        return this.storage.length
    }

    private updateIndexMap() {
        this.documentsIndexMap = generateDocumentsIndexMap(this.storage);
        console.log("Document indexes are automatically updated");
    }    

    private sortByHeader(sortData:SortData) {
        console.log(`Table is sorted by header ${sortData.tableHeader.toUpperCase()}`);
        return sortIndexedDocumentsByHeader({sortData, documentsIndexMap:this.documentsIndexMap, dataArray:this.storage});    
    }

    private updateStateIndexMap() {
        this.documentStateMap = indexDocumentsByState({ documentObjectKey: "state", documentsArray: this.storage, documentState: DocumentStateSet })
        console.log("Doucments have been indexed by state");
    }

}
