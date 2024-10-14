export interface ShiftedArrayCoordinatesParams {
    currentCoordinates: {start: number, end: number},
    parentArrayLength: number,
    shiftEnd: number,
    shiftStart: number
}

export const shiftArrayCoordinates = ( { currentCoordinates, parentArrayLength, shiftEnd, shiftStart }: ShiftedArrayCoordinatesParams) => {
    let start = currentCoordinates.start
    let end = currentCoordinates.end
    const targetArrayLength = end - start;

    start = start + shiftStart;
    end = end + shiftEnd;

    if (end > parentArrayLength) {
        end = parentArrayLength - 1;
        start = parentArrayLength - targetArrayLength - 1
    }
    if (start < 0) {
        start = 0;
        end = targetArrayLength;
    }

    start = Math.max(start, 0);
    end = Math.min(end, parentArrayLength);

    return { start, end };
}