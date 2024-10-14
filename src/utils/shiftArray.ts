export interface ShiftedArrayParams {
    currentPosition: {start: number, end: number},
    parentArray: any[],
    right?: number,
    left?: number
}

export function shiftArray({ currentPosition, parentArray, right = 0, left = 0 }: ShiftedArrayParams){
    let {start, end} = currentPosition;
    const targetArrayLength = end - start;

    if(right > 0){
        start = start + right;
        end = end + right;
        
        if(end > parentArray.length) {
        start = right + parentArray.length - end;
        end = parentArray.length; 
        }

    }

    if (left > 0) {
        if (start > 0) {
            start = start - left;
            end = end - left;

            if (start < 0) {
                start = 0;
                end = targetArrayLength;
            }
        }
    }

    return parentArray.slice(start,end);
    
}