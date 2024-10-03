

interface EvaluationData {
    bias: number;
    connections: {
        nodeFrom: number;
        weight: number;
    }[];
}

export type { EvaluationData };