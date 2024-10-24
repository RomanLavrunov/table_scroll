import Image from 'next/image';
import { useTranslations } from 'next-intl';
import arrow from '../../../../public/assets/images/icons/arrow.svg'

interface TableHeaderProps<T> {
  headers: Array<keyof T>;
  tableHeader: keyof T;
  isAscending: boolean;
  sortHandler: (key: keyof T | 'index') => void;
}

const TableHeader = <T extends object>({ headers, tableHeader, isAscending, sortHandler }: TableHeaderProps<T>) => {
  const t = useTranslations("Home");

  return (
    <tr className='table-header-row'>
      {headers.map((header) => (
        <th key={header as string} className='table-header' scope='col' onClick={() => sortHandler(header)}>
          {t(`headerTitle.${header as string}`)}
          {(header === tableHeader || tableHeader === `${header as string}Millis`) && (
            <Image className={isAscending ? "arrow-up" : "arrow-down"} src={arrow} alt='sort direction arrow' />
          )}
        </th>
      ))}
    </tr>
  );
};
export default TableHeader;