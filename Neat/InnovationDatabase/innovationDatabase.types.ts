

interface AddNodeMutation {
    id: number;
    nodeFrom: number;
    nodeTo: number;
    innovationNumberA: number;
    innovationNumberB: number;
    nodeID: number;
}

interface AddConnectionMutation {
    id: number;
    nodeFrom: number;
    nodeTo: number;
    innovationNumber: number;
}

export { AddNodeMutation, AddConnectionMutation };