import { expect } from "chai";
import { shiftArrayCoordinates } from "../src/utils/shiftArrayCoordinates.ts";

describe('shiftArrayCoordinates functionality', () => {
    const parentArrayLength = 10;
    const targetArrayLength = 3;

    let currentCoordinates = {
        start: 0,
        end: targetArrayLength
    };

    describe('when target array is at the beginning of parent array', () => {
        it('should shift coordinates 2 positions right', () => {
            const shiftedCoordinates = shiftArrayCoordinates({ currentCoordinates, parentArrayLength, shift: 2 });
            expect(shiftedCoordinates).deep.equal({ start: 2, end: 5 });
        });

        it('should not shift coordinates left by 2 positions (since already at the start)', () => {
            const shiftedCoordinates = shiftArrayCoordinates({ currentCoordinates, parentArrayLength, shift: -2 });
            expect(shiftedCoordinates).deep.equal({ start: 0, end: 3 });
        });

        it('should not shift coordinates beyond the array length (e.g., shift right by 10)', () => {
            const shiftedCoordinates = shiftArrayCoordinates({ currentCoordinates, parentArrayLength, shift: 10 });
            expect(shiftedCoordinates).deep.equal({ start: 6, end: 9 });
        });
    });

    describe('when target array is somewhere in the middle of parent array', () => {
        beforeEach(() => {
            currentCoordinates = {
                start: 4,
                end: 4 + targetArrayLength
            };
        });

        it('should shift coordinates 2 positions left', () => {
            const shiftedCoordinates = shiftArrayCoordinates({ currentCoordinates, parentArrayLength, shift: -2 });
            expect(shiftedCoordinates).deep.equal({ start: 2, end: 5 });
        });

        it('should not shift coordinates left more than the start of the array (e.g., shift by -5)', () => {
            const shiftedCoordinates = shiftArrayCoordinates({ currentCoordinates, parentArrayLength, shift: -5 });
            expect(shiftedCoordinates).deep.equal({ start: 0, end: 3 });
        });

        it('should shift coordinates right but not beyond parent array length', () => {
            const shiftedCoordinates = shiftArrayCoordinates({ currentCoordinates, parentArrayLength, shift: 5 });
            expect(shiftedCoordinates).deep.equal({ start: 6, end: 9 });
        });
    });
});
