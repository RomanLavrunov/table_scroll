import { forwardRef } from 'react';
import TableHeader from '../TableHeader/TableHeader';
import TableRow from '../TableRow/TableRow';
import { DocumentGeneric } from '@/app/useData';

interface TableProps<T> {
  headers: (keyof DocumentGeneric<T>)[];
  visibleDocuments: DocumentGeneric<T>[];
  tableHeader: keyof DocumentGeneric<T>;
  isAscending: boolean;
  sortHandler: (key: keyof DocumentGeneric<T> | 'index') => void;
  coordinatePoint: number;
  rowRef: { [key: number]: React.Ref<HTMLTableRowElement> };
}

const Table = <T extends string>({ headers, visibleDocuments, tableHeader, isAscending, sortHandler, coordinatePoint, rowRef}: TableProps<T>) => {

  return (
    <table className='table-block'>
      <thead>
        <TableHeader headers={headers} tableHeader={tableHeader} isAscending={isAscending} sortHandler={sortHandler} />
      </thead>
      <tbody>
        {visibleDocuments.map((document, i) => (
          <TableRow key={document.id} document={document} index={i} headers={headers} coordinatePoint={coordinatePoint} ref={rowRef[i] || null}/>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
