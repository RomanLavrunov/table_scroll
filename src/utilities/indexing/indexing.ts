import { DocumentStateTranslations, ExtractDocumentsObjectsParams, FilterParams, IndexedArrayParamsBase, IndexedArrayParamsFull, KeyIndexesObject, Locale } from "./indexing.types";

export const indexDocumentsByState = ({
    documentObjectKey,
    documentsArray,
    documentState,
}: IndexedArrayParamsFull) => {
    const keyIndexesObject: KeyIndexesObject = {};
    const locales = ['en', 'et', 'ru'] as Locale[];
    
    locales.forEach((lang) => {
        keyIndexesObject[lang] = {};
    });
    
    documentsArray?.forEach((document, index) => {
        const stateKey = document[documentObjectKey] as keyof DocumentStateTranslations;
       
           locales.forEach((lang) => {
            const translation = documentState.state[stateKey]?.[lang];
           
            if (translation) {
                if (!keyIndexesObject[lang][translation]) {
                    keyIndexesObject[lang][translation] = [];
                }
                
                keyIndexesObject[lang][translation].push(index);
            }
        });
    });

    return keyIndexesObject;

};

export const filterArray = ({ dataObject, searchValue }: FilterParams) => {

    const searchResult: number[] = [];

    Object.keys(dataObject).forEach((key) => {
        const keyLowerCased = key.toLowerCase();
        if (keyLowerCased.includes(searchValue)) {
            searchResult.push(...dataObject[key])
        }
    })
  
    return searchResult;
};

// export const extractObjects = ({ indexesArray, objectsArray, isAscending }: ExtractObjectsParams) => {
//     let result: IDocument[];
//     const indexesSet = new Set(indexesArray);
//     const filteredObjects = objectsArray.filter((_, index) => indexesSet.has(index));
//     return isAscending ? filteredObjects : filteredObjects.reverse()
// }

export const extractObjects = ({ sortedIndexesArray, dataArray}: ExtractDocumentsObjectsParams) => {
    return sortedIndexesArray.map((index) => dataArray[index]);
}

export function indexDocumentsByDate({documentsArray, documentObjectKey}: IndexedArrayParamsBase) {
    const index: Record<string, number[]> = {};

    documentsArray.forEach((document, idx) => {
        const keyValue = String(document[documentObjectKey]);
        const dateKey = keyValue; 
        if (!index[dateKey]) {
            index[dateKey] = [];
        }
        index[dateKey].push(idx);
    });

    return index;
}


export function searchByDate({dataObject, searchValue}:FilterParams) {
    const searchResult: number[] = [];

    for (const dateKey in dataObject) {
        if (dateKey.includes(searchValue)) {
            searchResult.push(...dataObject[dateKey]);
        }
    }

    return searchResult;
}


// export function preprocessStringData({ documentsArray, documentKeys }: PreprocessDataParams): { index: number; combinedString: string }[] {
//     return documentsArray.map((document, index) => {
//         const combinedString = documentKeys.map(key=> document[key]).join("–");
//         return { index, combinedString }; 
//     });
// }

// export function searchInCombinedData({ preprocessedData, searchText }: SearchInCombinedDataParams): number[] {
//     return preprocessedData
//         .filter(item => item.combinedString.includes(searchText))
//         .map(item => item.index); 
// }

