import { IDocument } from "@/utilities/dataStorage/data.types";
import dataStorage from "@/utilities/dataStorage/DataStorage";
import { ChunkHandler } from "@/utilities/streammig/chunkHandler";
import { NextRequest, NextResponse } from "next/server";

const createStream = (path: string) => {
  return new ReadableStream({
    async start(controller) {
      const response = await fetch(path, { cache: "no-cache" });
      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      const chunkHandler = new ChunkHandler();
      let isFirstBatchSent = false;

      try {
        while (true) {
          const { done, value } = await reader!.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          chunkHandler.processChunk(chunk)

          while (chunkHandler.processedChunks.length >= 200) {
            const chunkToSend: IDocument[] = chunkHandler.processedChunks.splice(0, 200)

            if (!isFirstBatchSent) {
              controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(chunkToSend)}`));
              isFirstBatchSent = true;
            } else {
              controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(chunkToSend)}`));
            }

            dataStorage.addToStorage(chunkToSend);
          }
        }
      } catch (error) {
        console.error("Error data streaming...", error);
        controller.error(error);
      } finally {
        if (chunkHandler.processedChunks.length) {
          dataStorage.addToStorage(chunkHandler.processedChunks);
          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(chunkHandler.processedChunks)}`));
        }
        controller.enqueue(
          new TextEncoder().encode(
            `data: ${JSON.stringify({
              ready: true,
              documentAmount: dataStorage.documentAmout,
            })}`
          )
        );
        dataStorage.downloaded = true;
        controller.close();
      }
    },
  });
}

export async function GET(req: NextRequest) {
  const path = `${process.env.API_URL_2M}`;
  const { searchParams } = new URL(req.url);
  const sortParam = searchParams.get("sort");

  let sortData = null;
  if (sortParam) {
    try {
      sortData = JSON.parse(sortParam);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  }

  if (dataStorage.storage.length) {

    console.log("CACHE DATA IN USE")
    if (sortData) {
      let filteredDocuments: IDocument[] = dataStorage.setSortData(sortData);
      return NextResponse.json([
        filteredDocuments,
        { ready: true, documentAmount: dataStorage.documentAmout },
      ]);
    }
  }

  const stream = createStream(path);

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
