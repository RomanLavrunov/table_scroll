import { expect } from "chai";
import { shiftArray } from "../src/utils/shiftArray.ts";

const parentArray = [1,2,3,4,5,6,7,8,9,10];
const targetArray = [1,2,3];
const shiftRange = 2;

describe('slicing functionality',()=>{

    const targetArrayLength = targetArray.length;
    const parentArraylength = parentArray.length;
    const currentPosition = {
        start: 0,
        end: targetArrayLength
    }

    describe('when target array is at the begnning relative to parent array',()=>{
        it('should slice shift 2 elemnts right',()=>{
            const shiftedTargetArray = shiftArray({currentPosition,parentArray,right:2}); 
            expect(shiftedTargetArray).deep.equal([3,4,5]);
        })
        it('should not shift 2 elemnts left',()=>{
            const shiftedTargetArray = shiftArray({currentPosition,parentArray,left:2}); 
            expect(shiftedTargetArray).deep.equal([1,2,3]);
        })
        it('should not shift more than 7',()=>{
            const shiftedTargetArray = shiftArray({currentPosition,parentArray,right:10}); 
            expect(shiftedTargetArray).deep.equal([8,9,10]);
        })
    })

    describe('when target array is somwhere in the middle of parent array',()=>{
        it('should shift 2 elements left',()=>{
            currentPosition.start = 2;
            currentPosition.end = currentPosition.start + targetArrayLength;
            const shiftedTargetArray = shiftArray({currentPosition,parentArray,left:2}); 
            expect(shiftedTargetArray).deep.equal([1,2,3]);
        })
        it('should not shift more than 2 elements left',()=>{
            currentPosition.start = 2;
            currentPosition.end = currentPosition.start + targetArrayLength;
            const shiftedTargetArray = shiftArray({currentPosition,parentArray,left:3}); 
            expect(shiftedTargetArray).deep.equal([1,2,3]);
        })
    })
})
