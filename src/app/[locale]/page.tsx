'use client'
import { useCallback, useState, useMemo, useEffect, useRef } from 'react';
import { useData, DocumentGeneric } from '../useData';
import { headersMap, sortArray } from '@/utils/sort';
import { useTranslations } from 'next-intl';
import { shiftArrayCoordinates } from '@/utils/shiftArrayCoordinates.ts';
import { useVisibility } from '@/utils/useVisibility';
import Table from '../components/Table/Table';
import { Link } from "@/i18n/routing";
import '../page.css';

export default function Home<T extends string>() {
  const t = useTranslations("Home");
  const shiftStep: number = 40;
  const mainContainerRef = useRef<HTMLDivElement | null>(null);
  const [data] = useData();
  const parentArrayLength = data.length;
  const [tableHeader, setTableHeader] = useState<keyof DocumentGeneric<T>>("id");
  const [isAscending, setIsAscending] = useState(true);
  const headers = ["index", "state", "id", "documentName", "documentDate", "stateTime", "documentNumber", "documentTotalAmount"] as (keyof DocumentGeneric<T>)[];

  const baseCoordiantes = { start: 0, end: 160 };
  const [currentCoordinates, setCurrentCoordinates] = useState(baseCoordiantes);

  const sortedDocuments: DocumentGeneric<T>[] = useMemo(() => {
    return sortArray({ data, isAscending, sortKey: tableHeader }) as DocumentGeneric<T>[];
  }, [tableHeader, isAscending, data]);

  const visibleDocuments: DocumentGeneric<T>[] = sortedDocuments.slice(currentCoordinates.start, currentCoordinates.end);

  const firstIndex = 10;
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

  }, [tableHeader])

  const firstElementRef = useVisibility((isVisible: boolean) => {
    if (isVisible) {
      if (currentCoordinates.start === 0) return;
      if (mainContainerRef.current) {
        mainContainerRef.current.scrollTo({
          top: 1500,
          left: 0,
        });
        const newShiftStep = -shiftStep;
        const newCoordinates = shiftArrayCoordinates({ currentCoordinates, parentArrayLength, shiftStep: newShiftStep })
        setCurrentCoordinates(newCoordinates)
      }
    }

  }, [currentCoordinates])

  const lastElementRef = useVisibility((isVisible: boolean) => {
    if (isVisible) {
      if (currentCoordinates.end === sortedDocuments.length - 1) return;
      if (mainContainerRef.current) {
        mainContainerRef.current.scrollTop = Math.max(
          mainContainerRef.current.scrollTop * 0.7,
          0
        );
        const newCoordinates = shiftArrayCoordinates({ currentCoordinates, parentArrayLength, shiftStep })
        setCurrentCoordinates(newCoordinates)
      }
    }
  }, [currentCoordinates])

  const refCheck = {
    [firstIndex]: firstElementRef,
    [lastIndex]: lastElementRef,
  };
 
  return (
    <div className='table-container' ref={mainContainerRef} >
      <div className='sticky-header'>
        <p style={{textDecoration:'none'}}className='languages'>LANGUAGES:</p>
        <Link className='languages' href={'/'} locale="en">EN</Link>
        <Link className='languages' href={'/'} locale="ru">RU</Link>
        <Link className='languages' href={'/'} locale="et">ET</Link>
      </div>
      <Table visibleDocuments={visibleDocuments} headers={headers} tableHeader={tableHeader} sortHandler={sortHandler} isAscending={isAscending} coordinatePoint={currentCoordinates.start} rowRef={refCheck}></Table>
    </div >
  );
}

