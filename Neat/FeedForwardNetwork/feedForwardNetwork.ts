import ActivationFunctionSet from "../Activation/activation";
import { ActivationFunction } from "../Activation/activation.types";
import AggregationFunctionSet from "../Aggregation/aggregation";
import { AggregationFunction } from "../Aggregation/aggregation.types";
import ConnectionGene from "../ConnectionGene/connectionGene";
import Genome from "../Genome/genome";
import Graph from "../utils/graph";
import { EvaluationData } from "./feedForwardNetwork.types";


class FeedForwardNetwork {
    private layers: number[][];
    private nodeEvaluationData: Map<number, EvaluationData>;
    private values: Map<number, number>;
    private inputNodeKeys: number[];
    private outputNodeKeys: number[];

    public constructor(layers: number[][], nodeEvaluationData: Map<number, EvaluationData>, 
        inputNodeKeys: number[], outputNodeKeys: number[]) {
        this.layers = layers;
        this.nodeEvaluationData = nodeEvaluationData;
        this.values = new Map();
        this.inputNodeKeys = inputNodeKeys.sort();
        this.outputNodeKeys = outputNodeKeys.sort();
    }


    /**
     * Creates a FeedForwardNetwork instance for the given {genome}. The network represents the
     * phenotype of the {genome}.
     * @param genome 
     */
    public static create(genome: Genome): FeedForwardNetwork {
        const nodeKeys: number[] = Array.from(genome._nodes.keys());
        const inputNodeKeys: number[] = genome._inputNodeKeys;
        const outputNodeKeys: number[] = genome._outputNodeKeys;
        const connectionKeys: Map<number, number[]> = genome.extractConnectionKeys();

        const layers: number[][] = Graph.feedForwardLayers(nodeKeys, inputNodeKeys, connectionKeys);

        const nodeEvaluationData: Map<number, EvaluationData> = new Map();
        layers.forEach((layer: number[]) => {
            layer.forEach((nodeKey: number) => {
                nodeEvaluationData.set(nodeKey, {bias: genome._nodes.get(nodeKey)!._bias, connections: []});
            })
        })


        genome._connections.forEach((connection: ConnectionGene) => {
            // Get the already computed evaluation data for the nodeTo
            const evaluationData: EvaluationData = nodeEvaluationData.get(connection._nodeTo.key)!;

            // Add the evaluation data about the nodeFrom of the connection
            evaluationData.connections.push({
                nodeFrom: connection._nodeFrom.key,
                weight: connection._weight,
            })

            // Update the evaluation data
            nodeEvaluationData.set(connection._nodeTo.key, evaluationData);
        })

        return new FeedForwardNetwork(layers, nodeEvaluationData, inputNodeKeys, outputNodeKeys);
    }

    /**
     * It will pass the given {inputs} through the network and return the final value that network
     * produces from its output nodes.
     * @param inputs 
     */
    public activate(inputs: number[]): number[] {
        console.assert(inputs.length == this.inputNodeKeys.length, "You must provide as many inputs as the input nodes!");

        // The final value that produces each input node, is the input itself
        this.inputNodeKeys.forEach((inputNodeKey: number, index: number) => {
            this.values.set(inputNodeKey, inputs[index]);
        })

        this.layers.forEach((layer: number[]) => {
            this.computeLayerNodeValues(layer);
        })

        const output: number[] = [];
        this.outputNodeKeys.forEach((key: number) => {
            output.push(this.values.get(key)!);
        })

        return output;
    }


    /*----------------------------------------Private Methods----------------------------------------*/
    /**
     * Computes the value that every node outputs, of the given {layer}, one by one.
     * Due to the nature of the network, there could be some connections connecting nodes of the same layer.
     * As a result, we might come to a scenario where we try to compute the value of a node which depends on another 
     * node whose value is not yet computed. In that case, we move to the next node of the layer. When we reach
     * the end of the layer, we move back to the start. The process ends when we evaluate all the nodes.
     * For example lets say we have the layer [8, 5, 7, 4] and the needs:
     * 1. node 8 needs the values of nodes [7, 3]
     * 2. node 5 needs the values of nodes [2, 4]
     * 3. node 7 needs the values of nodes [3]
     * 4. node 4 needs the values of nodes [2]
     * 5. In the first iteration, only the nodes 7, 4 will be evaluated because the other have unsatisfied needs
     * 6. In the second iteration, the nodes 8 and 5 will finally be evaluated  
     * 7. ** a need represent a connection, its weight and other information
     * @param layer contains the keys of the nodes that consist this {layer}
     */
    private computeLayerNodeValues(layer: number[]): void {
        // Keeps track of how many nodes have been evaluated
        let evaluatedNodesCounter: number = 0;

        // Moves to the end of the list and back to the start
        let index: number = 0;

        while (evaluatedNodesCounter < layer.length) {

            if (this.values.get(layer[index]) === undefined) {
                const nodeValues: number[] = [];

                // Get the information that the current node needs in order to compute its value
                const evaluationData: EvaluationData = this.nodeEvaluationData.get(layer[index])!;
                
                let stop: boolean = false;
                let value: number;

                // Iterate through all needs
                for (let i = 0; i < evaluationData.connections.length && !stop; i++) {
                    // If one need is unsatisfied, then postpone the evaluation of the current node
                    if (this.values.get(evaluationData.connections[i].nodeFrom) === undefined) {
                        stop = true;
                    } else {
                        value = evaluationData.connections[i].weight * this.values.get(evaluationData.connections[i].nodeFrom)!;
                        nodeValues.push(value);
                    }
                }

                if (stop == false) {
                    // The current node succesfully got evaluated
                    const aggregationFunction: AggregationFunction = AggregationFunctionSet.get("sum");
                    const activationFunction: ActivationFunction =  ActivationFunctionSet.get("sigmoid")
                    
                    const aggregated: number = aggregationFunction(nodeValues);
                    const activated: number = activationFunction(aggregated + evaluationData.bias);

                    // Set the evaluation of the current node
                    this.values.set(layer[index], activated);

                    // Increment the counter of the already evaluated nodes
                    evaluatedNodesCounter += 1;
                }
            }

            index += 1;
            // If index moved to the end of the list, then move it back to the beginnig
            if (index == layer.length) {
                index = 0;
            }
        }
    }
}


export default FeedForwardNetwork;