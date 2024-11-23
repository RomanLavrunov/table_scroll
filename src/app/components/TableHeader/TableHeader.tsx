import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import arrow from '../../../../public/assets/images/icons/arrow.svg'
import { IDocument } from '@/shared/utilities/dataStorage/data.types';
import { SortData } from '@/shared/utilities/sort/sort.types';
import eventEmitter from '@/shared/utilities/emitters/EventEmitter';


const headers = ["index", "state", "id", "documentName", "documentDate", "stateTime", "documentNumber", "documentTotalAmount"] as (keyof IDocument)[];

const TableHeader = () => { 
  const [sortData, setSortData] = useState<SortData>({tableHeader:'id', isAscending:true, currentCoordinates:{start:0, end:200}})
  const t = useTranslations("Home");
  const [isDisabled, setIsDisabled] = useState(true)
  
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

  useEffect(() => {
    //@ts-ignore
    eventEmitter.on('activateSearchFilterOptions', (isLoading)=>setIsDisabled(!isLoading))
    return () => {
      eventEmitter.unsubscribe('sendSearchText');
    };
  },[])


  return (
    <tr className='table-header-row'>
    {headers.map((header) => {
       if(sortData) {
        let {tableHeader, isAscending} = sortData;
        return (
          <th aria-disabled={isDisabled} key={header} className='table-header' onClick={() => {isDisabled ? () => void (0) : sortHandler(header)}}>
            {t(`headerTitle.${header}`)}
            {(header === tableHeader) && (
              !isDisabled && (<Image
                className={isAscending ? "arrow-up" : "arrow-down"}
                src={arrow}
                alt='sort direction arrow'
              />)
            )}
          </th>
        );}
      })}
    </tr>
  );
};

export default TableHeader;