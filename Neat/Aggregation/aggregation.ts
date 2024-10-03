import { AggregationFunction } from "./aggregation.types";

function sumAggregation(values: number[]): number {
    let result: number = 0;
    values.forEach((value: number) => {
        result += value;
    })

    return result;
}


class AggregationFunctionSet {
    /**
     * Returns the aggregation function with the given {functionName}. Available aggregation functions:
     * 1) "sum"
     * @param functionName 
     * @returns 
     */
    public static get(functionName: string): AggregationFunction {
        if (functionName === "sum") {
            return sumAggregation;
        } else {
            console.error(`There isn't any aggregation function named ${functionName}. The sum aggregation is used instead.`);
            return sumAggregation;
        }
    }
}


export default AggregationFunctionSet;