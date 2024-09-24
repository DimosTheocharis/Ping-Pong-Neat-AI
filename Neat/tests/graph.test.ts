import Graph from "../utils/graph";

describe("createsCircle function", () => {
    it("Should detect the presence of the circle I.", () => {
        const connections: Map<number, number[]> = new Map();

        connections.set(0, [1, 2]);
        connections.set(1, []);
        connections.set(2, [0, 3]);
        connections.set(3, []);
        
        expect(Graph.createsCircle(connections, {nodeFrom: 1, nodeTo: 2})).toBe(true);
    })

    it("Should detect the presence of the circle II.", () => {
        const connections: Map<number, number[]> = new Map();

        connections.set(0, [1]);
        connections.set(1, []);
        connections.set(2, [1, 3]);
        connections.set(3, [4]);
        connections.set(4, [0]);
        
        expect(Graph.createsCircle(connections, {nodeFrom: 4, nodeTo: 2})).toBe(true);
    })


    it("Should detect the absence of the circle I1.", () => {
        const connections: Map<number, number[]> = new Map();

        connections.set(1, [2]);
        connections.set(2, []);
        connections.set(3, []);
        
        expect(Graph.createsCircle(connections, {nodeFrom: 2, nodeTo: 3})).toBe(false);
    })

    
})