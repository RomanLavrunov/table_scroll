'use client'
import './page.css';
import { useStream } from "@/app/components/useStreamData";
import TableHeader from "@/app/components/TableHeader/TableHeader";
import { IDocument } from "@/utilities/dataStorage/data.types";
import TableRow from "@/app/components/TableRow/TableRow";
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import returnArrow from '../../../../public/assets/images/icons/return_arrow.svg';
import eventEmitter from '@/utilities/emitters/EventEmitter';
import { Link } from "@/i18n/routing";
import SearchBar from '@/app/components/SearchBar/SearchBar';
import { useTranslations } from 'next-intl';
import { useVisibility } from '@/app/hooks/useVisibility';
import Spinner from '@/app/components/Spinner/Spinner';
import { shiftArrayCoordinates } from '@/utilities/shiftArrayCoordinates';

const headers = ["index", "state", "id", "documentName", "documentDate", "stateTime", "documentNumber", "documentTotalAmount"] as (keyof IDocument)[];
const shiftStep: number = 40;

export default function Table() {
  const { data, ready, currentCoordinates } = useStream();
  const t = useTranslations("Home");
  const mainContainerRef = useRef<HTMLDivElement | null>(null);

  const [documentAmount, setDocumentAmount] = useState<number>(0)

  useEffect(()=>{
    //@ts-ignore
    eventEmitter.on('updateDocumentAmount',(documentAmount)=>setDocumentAmount(documentAmount))

    return () => {
      eventEmitter.unsubscribe('updateDocumentAmount');
    }
  },[documentAmount])

  const firstIndex = 10;
  const lastIndex = data.length - 11;

  const firstElementRef = useVisibility((isVisible: boolean) => {
    if (isVisible) {
      if (currentCoordinates.start === 0) return;
      if (mainContainerRef.current) {
        mainContainerRef.current.scrollTo({
          top: 1500,
          left: 0,
        });
        const newShiftStep = -shiftStep;
        
        const newCoordinates = shiftArrayCoordinates({ currentCoordinates, parentArrayLength:documentAmount, shiftStep: newShiftStep })
        eventEmitter.emit('sendCurrentCoordinates', newCoordinates);
      }
    }
  }, [currentCoordinates])

  const lastElementRef = useVisibility((isVisible: boolean) => {

    if (isVisible) {
      if (currentCoordinates.end === data.length - 1) return;
      if (mainContainerRef.current) {
        mainContainerRef.current.scrollTop = Math.max(
          mainContainerRef.current.scrollTop * 0.7,
          0
        );
    
        const newCoordinates = shiftArrayCoordinates({ currentCoordinates, parentArrayLength:documentAmount, shiftStep})
        eventEmitter.emit('sendCurrentCoordinates', newCoordinates);
      }
    }
  }, [currentCoordinates])

  const refCheck = {
    [firstIndex]: firstElementRef,
    [lastIndex]: lastElementRef,
  };

  const filteredData = data.filter((document) => document && document.id);

  return (
    <div className='table-container' ref={mainContainerRef} >
      <div className='sticky-header'>
        <nav className='nav-bar'>
          <Link className='nav-link' href={'/'}>
            <Image src={returnArrow} alt="return arrow" />
          </Link>
          <Link className='nav-link' href={'/mock'} locale="en">EN</Link>
          <Link className='nav-link' href={'/mock'} locale="ru">RU</Link>
          <Link className='nav-link' href={'/mock'} locale="et">ET</Link>
        </nav>
        <p style={{ margin: 20 }}>{ready ? "Ready" : "Not ready"}</p>
        <SearchBar />
      </div>
      <table>
        <thead>
          <TableHeader />
        </thead>
        <tbody style={{ width: '100vw' }}>
          {(!data.length || filteredData.length === 0) && <Spinner />}
          {data.map((document, i) => (
            document && document.id ? (
              <TableRow
                key={document.id}
                document={document}
                index={i}
                headers={headers}
                coordinatePoint={currentCoordinates.start}
                ref={refCheck[i] || null}
              />
            ) : null))}
        </tbody>
      </table>
    </div >
  );
}

