import { useEffect, useState, useRef} from "react";
import { IDocument } from "../../utilities/dataStorage/data.types";
import { ChunkHandler } from "@/utilities/streammig/chunkHandler";
import eventEmitter from "@/utilities/emitters/EventEmitter";
import { CurrentCoordinates, SortData } from "@/utilities/sort/sort.types";
import { formatDocumentData } from "@/utilities/dataStorage/formatDocumentData";

type LastResponse = {
  ready: boolean;
  documentAmount: number;
};

const isLastResponse = (object: any): object is LastResponse => {
  return object && typeof object.ready === 'boolean' && typeof object.documentAmount === 'number';
};

export async function fetchStreamData(
  setData: (data: IDocument[]) => void,
  setReady: (ready: boolean) => void,
  setDocumentAmount: (documentAmount: number) => void,
  searchParams?: URLSearchParams) {

  const url = searchParams ? `/api/documents/?${searchParams.toString()}` : '/api/documents/';
  const response = await fetch(url, { cache: "no-cache" });
  const reader = response.body?.getReader();
  const decoder = new TextDecoder("utf-8");
  const chunkHandler = new ChunkHandler();
  let isFirstDataFetched = false;

  try {
    while (true) {
      if (!reader) throw new Error("Error: no reader available");

      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      chunkHandler.processChunk(chunk);

      if (!isFirstDataFetched) {
        if (chunkHandler.processedChunks.length >= 200) {
          setData(formatDocumentData(chunkHandler.processedChunks));

          const lastResponse = chunkHandler.processedChunks[200]
          if (isLastResponse(lastResponse)) {
            setDocumentAmount(lastResponse.documentAmount);
            setReady(true);
          }

          chunkHandler.processedChunks = chunkHandler.processedChunks.slice(200);
          isFirstDataFetched = true;
        }
      } else {
        while (chunkHandler.processedChunks.length > 0) {
          const jsonObject = chunkHandler.processedChunks.shift()
          if (isLastResponse(jsonObject)) {
            setReady(true);
            setDocumentAmount(jsonObject.documentAmount)
          }
        }
      }
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

export const useStream = () => {

  const [data, setData] = useState<IDocument[]>([]);
  const [sortData, setSortData] = useState<SortData>({ tableHeader: 'id', isAscending: true, currentCoordinates: { start: 0, end: 200 } })
  const [documentAmount, setDocumentAmount] = useState<number>(0);
  const [ready, setReady] = useState<boolean>(false);
  const isFetching = useRef(false);

  useEffect(() => {

    const searchParams = new URLSearchParams({
      sort: JSON.stringify(sortData),
    });

    if (!isFetching.current) {
      isFetching.current = true;
      fetchStreamData(setData, setReady, setDocumentAmount, searchParams);
      isFetching.current = false;
    }


  }, [sortData]);

  useEffect(() => {

    const handleCurrentCoordinates = (currentCoordinates: CurrentCoordinates) => {
      if (currentCoordinates !== sortData.currentCoordinates) {
        setSortData((prev) => ({ ...prev, currentCoordinates }));
      }
    };

    const handleSortObject = (object: SortData) => {
            if (object !== sortData) {
              setSortData(object);
            }
          };
      
    //@ts-ignore
    eventEmitter.on("sendSortData", (updatedSortData: SortData) => handleSortObject(updatedSortData));
    //@ts-ignore
    eventEmitter.on('sendCurrentCoordinates', (newCoordinates) => handleCurrentCoordinates(newCoordinates));

    return () => {
      //@ts-ignore
      eventEmitter.unsubscribe("sendSortData");
      //@ts-ignore
      eventEmitter.unsubscribe("sendCurrentCoordinates");
    };
  }, [sortData]);

  useEffect(() => {
    eventEmitter.emit('updateDocumentAmount',documentAmount)
  }, [documentAmount]);

  return { data, ready, documentAmount, currentCoordinates: sortData.currentCoordinates };
};
