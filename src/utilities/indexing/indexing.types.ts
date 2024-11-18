import { IDocument } from "@/utilities/dataStorage/data.types";

export type Locale = 'en' | 'et' | 'ru';

export interface Translation {
    en: string;
    et: string;
    ru: string;
}

export interface DocumentStateTranslations {
    SUBMITTED: Translation;
    IN_PROCESS: Translation;
    ADDITIONAL_REVIEW: Translation;
    REVIEW_COMPLETED: Translation;
    INVALID: Translation;
}

export interface DocumentState {
    state: DocumentStateTranslations;
}

export interface IndexedArrayParamsBase {
    documentObjectKey: keyof IDocument;
    documentsArray: IDocument[];
}

export interface IndexedArrayParamsFull extends IndexedArrayParamsBase {
    documentState: DocumentState;
}

export interface FilterParams {
    dataObject: Record<string, number[]>;
    searchValue: string;
}

export interface ExtractDocumentsObjectsParams {
    sortedIndexesArray: number[];
    dataArray: IDocument[];
}

export interface PreprocessDataParams {
    documentsArray: IDocument[];
    documentKeys: (keyof IDocument)[];
}

export interface SearchInCombinedDataParams {
    preprocessedData: { 
        index: number; 
        combinedString: string 
    }[];
    searchText: string;
}


export const DocumentStateSet: DocumentState = {
    state: {
        SUBMITTED: {
            en: "Submitted",
            et: "Esitatud",
            ru: "Отправлено"
        },
        IN_PROCESS: {
            en: "In process",
            et: "Töötlemisel",
            ru: "В процессе"
        },
        ADDITIONAL_REVIEW: {
            en: "Additional Review",
            et: "Täiendav läbivaatus",
            ru: "Доп. проверка"
        },
        REVIEW_COMPLETED: {
            en: "Review Completed",
            et: "Läbivaatus lõpetatud",
            ru: "Проверка завершена"
        },
        INVALID: {
            en: "Invalid",
            et: "Kehtetu",
            ru: "Недействительно"
        }
    }
};


interface TranslationIndex {
    [translation: string]: number[];
  }
  
export interface KeyIndexesObject {
    [lang: string]: TranslationIndex;
  }