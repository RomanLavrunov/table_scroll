import { useMemo } from 'react';
import allDocuments from '../../public/assets/document-list.mocked-data.json' with { type: "json" };
import { DateTime } from 'luxon';

export const DocumentState = {
    submitted: 'SUBMITTED',
    inProcess: 'IN_PROCESS',
    additionalReview: 'ADDITIONAL_REVIEW',
    reviewCompleted: 'REVIEW_COMPLETED',
    invalid: 'INVALID',
  } as const;
  
  type DocumentStateType = typeof DocumentState [keyof typeof DocumentState];
  
  export interface DocumentGeneric<T> {
    id: number,
    state: DocumentStateType,
    stateTime: T,
    documentNumber: string,
    documentName: string,
    documentDate: T,
    documentTotalAmount: number,
  }

export const useData =<T extends string> () => {
  const data = useMemo(() => (allDocuments as DocumentGeneric<T>[]).map((item) => ({
    ...item,
    documentDateMillis: DateTime.fromISO(item.documentDate).toMillis(),
    stateTimeMillis: DateTime.fromISO(item.stateTime).toMillis(),
    documentDate: DateTime.fromISO(item.documentDate).toFormat('dd-MM-yyyy'),
    stateTime: DateTime.fromISO(item.stateTime).toFormat('dd-MM-yyyy')
  })),[allDocuments])

   return [data]
}