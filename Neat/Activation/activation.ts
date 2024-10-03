import { ActivationFunction } from "./activation.types";


function sigmoidActivation(value: number): number {
    return 1 / (1 + Math.exp(-value));
}


class ActivationFunctionSet {

    /**
     * Returns the activation function with the given {functionName}. Available activation functions:
     * 1) "sigmoid"
     * @param functionName 
     * @returns 
     */
    public static get(functionName: string): ActivationFunction {
        if (functionName === "sigmoid") {
            return sigmoidActivation;
        } else {
            console.error(`There isn't any activation function named ${functionName}. The sigmoid activation is used instead.`);
            return sigmoidActivation;
        }
    }

}


export default ActivationFunctionSet;