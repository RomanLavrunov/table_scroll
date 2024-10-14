'use client'
import { useCallback, useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { useData, DocumentGeneric } from '../useData';
import { headersMap, sortArray } from '@/utils/sort';
import arrow from '../../../public/assets/images/icons/arrow.svg';
import '../page.css';
import { useTranslations } from 'next-intl';
import { shiftArrayCoordinates } from '@/utils/shiftArrayCoordinates.ts';
import { useVisibility } from '@/utils/useVisibility';

export default function Home<T extends string>() {

  const t = useTranslations("Home");
  const headers = ["index", "state", "id", "documentName", "documentDate", "stateTime", "documentNumber", "documentTotalAmount"] as (keyof DocumentGeneric<T>)[];
  const [tableHeader, setTableHeader] = useState<keyof DocumentGeneric<T>>("id");
  const [isAscending, setIsAscending] = useState(true);
  const [data] = useData();
  const parentArrayLength = data.length;
  const shiftStart: number = 40;
  const shiftEnd: number = 80;
  const idStateBasis = {first:0, middle: 0, last:0}
  const [currentCoordinates, setCurrentCoordinates] = useState({ start: 0, end: 160 });
  const [idState, setIdState] = useState({...idStateBasis})

  const sortedDocuments: DocumentGeneric<T>[] = useMemo(() => sortArray({ data, isAscending, sortKey: tableHeader }) as DocumentGeneric<T>[], [tableHeader, isAscending, data]);
  const visibleDocuments: DocumentGeneric<T>[] = sortedDocuments.slice(currentCoordinates.start, currentCoordinates.end);

  const firstIndex = useMemo(() => 26, [visibleDocuments.length]);
  const middleIndex = useMemo(() => Math.floor(visibleDocuments.length / 2 - 1), [visibleDocuments.length]);
  const lastIndex = useMemo(() => visibleDocuments.length - 11, [visibleDocuments.length]);
 
  const sortHandler = useCallback((key: keyof DocumentGeneric<T> | 'index') => {
    if (key === "index") return;

    //@ts-ignore
    if (key === tableHeader || headersMap[key] === tableHeader) {
      setIsAscending((prev) => !prev);
    } else {
      setIsAscending(true);
      //@ts-ignore
      setTableHeader(headersMap[key] || key);
    }

    setCurrentCoordinates({ start: 0, end: 200 })
    setIdState({...idStateBasis});
  }, [tableHeader])

  const firstElementRef = useVisibility((isVisible: boolean, id: number | null) => {
    if (id !== null) setIdState((prev) => ({...prev, first: id}))
    if (idState.last === idState.middle) return;
    if (isVisible) {
      const newShiftEnd = -shiftEnd;
      const newShiftStart = -shiftStart;
      const newCoordinates = shiftArrayCoordinates({currentCoordinates, parentArrayLength, shiftEnd:newShiftEnd, shiftStart: newShiftStart})
      setCurrentCoordinates(newCoordinates)
    }
  
  }, [currentCoordinates])

  const lastElementRef = useVisibility((isVisible: boolean, id: number | null) => {
    if (id !== null) setIdState((prev) => ({...prev, last: id}))
    if (isVisible) {
        const newCoordinates = shiftArrayCoordinates({currentCoordinates, parentArrayLength, shiftEnd, shiftStart:shiftStart+27})
        setCurrentCoordinates(newCoordinates)
      } 
  }, [currentCoordinates])

  const middleElementRef = useVisibility((isVisible: boolean, id: number | null) => {
    if (id !== null) setIdState((prev) => ({...prev, middle: id}))
    if (isVisible) {
      if (idState.last === 0){
      const newCoordinates = shiftArrayCoordinates({currentCoordinates, parentArrayLength, shiftEnd, shiftStart})
    
      setCurrentCoordinates(newCoordinates)
      } else {
      const newShiftEnd = -shiftEnd;
      const newShiftStart = -shiftStart;
      const newCoordinates = shiftArrayCoordinates({currentCoordinates, parentArrayLength, shiftEnd:newShiftEnd, shiftStart: newShiftStart})
 
      setCurrentCoordinates(newCoordinates)
      }
      
    }
  
  }, [currentCoordinates]);

  console.log(currentCoordinates)
  console.log(idState, 'STATE OF ID');

  return (
    <div className='table-container'>
      <table className='table-block'>
        <thead>
          <tr className='table-header-row'>
            {headers.map((header) =>
              <th key={header} className='table-header' scope='col' onClick={() => sortHandler(header)}>{t(`headerTitle.${header}`)}
                {(header === tableHeader || tableHeader === `${header}Millis`) && <Image className={isAscending ? "arrow-up" : "arrow-down"} src={arrow} alt={'sort direction arrow'} />}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {visibleDocuments.map((document, i) => (
            <tr key={`${document.id}-${i}`} id={`${document.id}`} ref={i === middleIndex ? middleElementRef : i === lastIndex ? lastElementRef : i === firstIndex ? firstElementRef : null} style={{ backgroundColor: i === middleIndex ? 'red' : i === lastIndex ? 'green' : i === firstIndex ? 'yellow' : 'none'}}>
              {!headers.length && "No Items found"}
              {headers.map((key) => (
                <td className='table-cell' key={key}>
                  {/* @ts-ignore */}
                  {key === 'index' ? (
                    i + 1
                  ) : key === 'state' ? (
                    t(`document.state.${document[key as keyof DocumentGeneric<T>]}`)
                  ) : (
                    document[key as keyof DocumentGeneric<T>]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div >
  );
}

