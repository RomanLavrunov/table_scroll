import { IDocument } from '../dataStorage/data.types';
import { extractObjects } from '../indexing/indexing';
import { DocumentIndexOrder, sortIndexedArrayParams} from './sort.types';

const compareValues = (a: any, b: any) => {
    if (typeof a === "number" && typeof b === "number") {
        return a - b;
    }
    const nameA = (a as string).toUpperCase();
    const nameB = (b as string).toUpperCase();

    return nameA.localeCompare(nameB);
};

export const getSortedIndexesByKey = (array: IDocument[], key: keyof IDocument): number[] => {
    return array
        .map((item, index) => ({ item, index }))
        .sort((a, b) => compareValues(a.item[key], b.item[key]))
        .map(({ index }) => index); 
};

export const buildSortedIndexMap = (array: IDocument[], keys: (keyof IDocument)[]) => {
    const result: DocumentIndexOrder = {};
    keys.forEach((key: keyof IDocument) => 
        result[key] = {isAscending: getSortedIndexesByKey([...array],key)});
    return result;
}

export function generateDocumentsIndexMap(array: IDocument[]) {
    const exceptions = ["eligiblePercentage", "eligibleAmount", "version"];
    if (array.length === 0) return {};
    const keys: (keyof IDocument)[] = Object.keys(array[0]).filter((key) => !exceptions.includes(key)) as (keyof IDocument)[];
    return buildSortedIndexMap(array, keys)
}

export function sortIndexedDocumentsByHeader({
    sortData,
    documentsIndexMap,
    dataArray,
}: sortIndexedArrayParams): IDocument[] {

    const { tableHeader, isAscending } = sortData;
    const { start, end } = sortData.currentCoordinates;

    if (!documentsIndexMap || !documentsIndexMap[tableHeader]) return [];

    const fullIndexesArray = documentsIndexMap[tableHeader]?.isAscending;

    if (!fullIndexesArray) return [];

    const sortedIndexesArray = isAscending
        ? fullIndexesArray.slice(start, end)
        : [...fullIndexesArray].reverse().slice(start, end);


    return extractObjects({ sortedIndexesArray, dataArray });
}
