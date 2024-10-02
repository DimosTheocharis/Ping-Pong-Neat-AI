import ConnectionGene from "../ConnectionGene/connectionGene";
import Genome from "../Genome/genome";
import Graph from "../utils/graph";
import { EvaluationData } from "./feedForwardNetwork.types";


class FeedForwardNetwork {
    private layers: number[][];
    private nodeEvaluationData: Map<number, EvaluationData[]>;
    private values: Map<number, number>

    public constructor(layers: number[][], nodeEvaluationData: Map<number, EvaluationData[]>) {
        this.layers = layers;
        this.nodeEvaluationData = nodeEvaluationData;
        this.values = new Map();
    }


    /**
     * Creates a FeedForwardNetwork instance for the given {genome}. The network represents the
     * phenotype of the {genome}.
     * @param genome 
     */
    public static create(genome: Genome): FeedForwardNetwork {
        const nodeKeys: number[] = Array.from(genome._nodes.keys());
        const inputNodeKeys: number[] = genome._inputNodeKeys;
        const connectionKeys: Map<number, number[]> = genome.extractConnectionKeys();

        const layers: number[][] = Graph.feedForwardLayers(nodeKeys, inputNodeKeys, connectionKeys);

        const nodeEvaluationData: Map<number, EvaluationData[]> = new Map();
        layers.forEach((layer: number[]) => {
            layer.forEach((nodeKey: number) => {
                nodeEvaluationData.set(nodeKey, []);
            })
        })


        genome._connections.forEach((connection: ConnectionGene) => {
            // Get the already computed evaluation data for the nodeTo
            const evaluationData: EvaluationData[] = nodeEvaluationData.get(connection._nodeTo.key)!;

            // Add the evaluation data about the nodeFrom of the connection
            evaluationData.push({
                nodeFrom: connection._nodeFrom.key,
                weight: connection._weight,
                bias: connection._nodeTo._bias
            })

            // Update the evaluation data
            nodeEvaluationData.set(connection._nodeTo.key, evaluationData);
        })

        return new FeedForwardNetwork(layers, nodeEvaluationData);
    }


    /*----------------------------------------Private Methods----------------------------------------*/

}


export default FeedForwardNetwork;