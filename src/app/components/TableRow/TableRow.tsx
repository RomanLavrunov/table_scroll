<<<<<<< HEAD
import { IDocument } from '@/shared/utilities/dataStorage/data.types';
import { useTranslations } from 'next-intl';
=======
import {IDocument} from '../../../shared/utilities/dataStorage/data.types'
import { useTranslations } from 'next-intl';
import React from 'react';
>>>>>>> Project migration
import { forwardRef } from 'react';


interface TableRowProps {
  document: IDocument;
  index: number;
  headers: (keyof IDocument)[];
  coordinatePoint: number;
  ref?: React.Ref<HTMLTableRowElement>; 
}

const TableRow = ({ document, index, headers, coordinatePoint }: TableRowProps,ref: React.Ref<HTMLTableRowElement>) => {
  const t = useTranslations("Home");

  if (headers.length === 0 || !document) {
    return (
      <tr>
        <td colSpan={headers.length} className='table-cell'>No Items found</td>
      </tr>
    );
  }

  return (
    <tr key={`${document.id}-${index}`} id={`${document.id}`} ref={ref}>
      {headers.map((key) => (
        <td className='table-cell' key={key as string}>
          {key as string === 'index' ? (
            index + 1 + coordinatePoint
          ) : key === 'state' ? (
            t(`document.state.${document[key as keyof IDocument]}`)
          ) : (
            document[key as keyof IDocument] as React.ReactNode
          )}
        </td>
      ))}
    </tr>
  );
};

export default forwardRef(TableRow);