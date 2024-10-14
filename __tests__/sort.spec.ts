import { expect } from "chai";
import { sortArray } from "../src/utils/sort.ts";
import { DocumentState } from "../src/app/useData.tsx";

const data = [{
    "id": 1,
    "state": "SUBMITTED",
    "stateTime": "2024-09-30T23:17:04.956798",
    "documentNumber": "1",
    "documentName": "Doc c4ca4238a0",
    "documentDate": "2024-07-17",
    "documentTotalAmount": 317.00,
    "eligibleAmount": null,
    "version": 0,
    "eligiblePercentage": null
},
{
    "id": 2,
    "state": "IN_PROCESS",
    "stateTime": "2024-07-11T20:52:20.318551",
    "documentNumber": "2",
    "documentName": "Doc c81e728d9d",
    "documentDate": "2024-08-24",
    "documentTotalAmount": 1047.00,
    "eligibleAmount": null,
    "version": 0,
    "eligiblePercentage": null
},
{
    "id": 3,
    "state": "INVALID",
    "stateTime": "2024-08-23T12:55:18.468287",
    "documentNumber": "3",
    "documentName": "Doc eccbc87e4b",
    "documentDate": "2024-07-17",
    "documentTotalAmount": 8524.00,
    "eligibleAmount": null,
    "version": 0,
    "eligiblePercentage": null
}]

describe('Sort by object key value', () => {

    describe('Passable test cases', () => {
        //@ts-ignore
        const cases =
            [
                {
                    sortKey: "id",
                    isAscending: false,
                    expectedValue: [3, 1]
                },
                {
                    sortKey: "id",
                    isAscending: true,
                    expectedValue: [1, 3]
                },
                {
                    sortKey: "state",
                    isAscending: true,
                    expectedValue: [DocumentState.inProcess, DocumentState.submitted]
                },
                {
                    sortKey: "state",
                    isAscending: false,
                    expectedValue: [DocumentState.submitted,DocumentState.inProcess]
                },
                {
                    sortKey: "stateTime",
                    isAscending: true,
                    expectedValue: ["2024-07-11T20:52:20.318551", "2024-09-30T23:17:04.956798"]
                },
                {
                    sortKey: "documentDate",
                    isAscending: false,
                    expectedValue: ["2024-08-24","2024-07-17"]
                },
            ];

        cases.map(
            //@ts-ignore
            ({ sortKey: sortKey, isAscending: isAscending, expectedValue }) => {
                it(`Should sort by ${sortKey} in ${isAscending ? 'ASC' : 'DESC'} order`, () => {
                    //@ts-ignore
                    const sortedData = sortArray({data, isAscending, sortKey})
                    //@ts-ignore
                    expect(sortedData[0][sortKey]).equals(expectedValue[0])
                    //@ts-ignore
                    expect(sortedData[2][sortKey]).equals(expectedValue[1])
                })
            })

    })
    

    
})