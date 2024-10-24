import { useTranslations } from 'next-intl';
import { DocumentGeneric } from '@/app/useData';
import { forwardRef } from 'react';

interface TableRowProps<T> {
  document: DocumentGeneric<T>;
  index: number;
  headers: (keyof DocumentGeneric<T>)[];
  coordinatePoint: number;
  ref?: React.Ref<HTMLTableRowElement>; 
}

const TableRow = <T extends string>(
  { document, index, headers, coordinatePoint }: TableRowProps<T>,
  ref: React.Ref<HTMLTableRowElement> 
) => {
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
            t(`document.state.${document[key as keyof DocumentGeneric<T>]}`)
          ) : (
            document[key as keyof DocumentGeneric<T>] as React.ReactNode
          )}
        </td>
      ))}
    </tr>
  );
};

export default forwardRef(TableRow);