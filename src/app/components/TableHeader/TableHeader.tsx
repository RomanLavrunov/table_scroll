import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import eventEmitter from '@/utilities/emitters/EventEmitter';
import arrow from '../../../../public/assets/images/icons/arrow.svg'
import { IDocument } from '@/utilities/dataStorage/data.types';
import { SortData } from '@/utilities/sort/sort.types';

const headers = ["index", "state", "id", "documentName", "documentDate", "stateTime", "documentNumber", "documentTotalAmount"] as (keyof IDocument)[];

const TableHeader = () => { 
  const [sortData, setSortData] = useState<SortData>({tableHeader:'id', isAscending:true, currentCoordinates:{start:0, end:200}})
  const t = useTranslations("Home");
  
  const sortHandler = useCallback((header: keyof IDocument | 'index'): void => {
    if (header === "index") return;
    setSortData((prev) => ({
      ...prev,
      tableHeader: header as keyof IDocument,
      isAscending: prev?.tableHeader === header ? !prev?.isAscending : true,
    }));
  }, []);

  useEffect(() => {
    //@ts-ignore
    eventEmitter.emit('sendSortData', sortData);
  }, [sortData])


  return (
    <tr className='table-header-row'>
    {headers.map((header) => {
       if(sortData) {
        let {tableHeader, isAscending} = sortData;
        return (
          <th key={header} className='table-header' scope='col' onClick={() => sortHandler(header)}>
            {t(`headerTitle.${header}`)} 
            {(header === tableHeader) && (
              <Image
                className={isAscending ? "arrow-up" : "arrow-down"}
                src={arrow}
                alt='sort direction arrow'
              />
            )}
          </th>
        );}
      })}
    </tr>
  );
};

export default TableHeader;