import { DocumentGeneric } from '../app/useData';

export const headersMap = {
    stateTime: "stateTimeMillis",
    documentDate: "documentDateMillis"
  }

export interface SortArrayParams<T> {
    data: DocumentGeneric<T>[], 
    sortKey: keyof DocumentGeneric<T>, 
    isAscending: boolean
}
export function sortArray({data, sortKey, isAscending: isAscending}: SortArrayParams<string>):DocumentGeneric<string>[] {

    return data.sort((a, b) => {
        if(typeof a[sortKey] === "number" && typeof b[sortKey] === "number"){ 
            return isAscending ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey];
        }  
        const nameA = (a[sortKey] as string).toUpperCase();
        const nameB = (b[sortKey] as string).toUpperCase();
  
        return isAscending ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);

    }) 
}