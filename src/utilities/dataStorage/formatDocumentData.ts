import { IDocument } from "@/utilities/dataStorage/data.types";
import { DateTime } from 'luxon';


export const formatDocumentData = (data: IDocument[]): IDocument[] => {
    return data.map((item) => ({
      ...item,
      documentTotalAmount: Number(item.documentTotalAmount),
      documentDate: DateTime.fromISO(item.documentDate).toFormat('dd-MM-yyyy'),
      stateTime: DateTime.fromISO(item.stateTime).toFormat('dd-MM-yyyy'),
    }));
  };
  