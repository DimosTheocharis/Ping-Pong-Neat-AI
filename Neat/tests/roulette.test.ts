import Roulette from "../utils/roulette"

describe("createProbabilityIntervals function", () => {
    it("Should create possiblity intervals that go up to 1", () => {
        const items: Map<number, number> = new Map([
            [1, 47/300],
            [2, 23/300],
            [3, 56/300],
            [4, 32/300],
            [5, 44/300],
            [6, 65/300],
            [7, 33/300]
        ])

        const roulette: Roulette = new Roulette(items);
        expect(Reflect.get(roulette, "probabilityIntervals")[items.size - 1].stop).toBeCloseTo(1, 4);
    })
})


// describe("selectRandomItem function", () => {
//     it("Should select random item", () => {
//         const items: Map<number, number> = new Map([
//             [1, 47/300],
//             [2, 23/300],
//             [3, 56/300],
//             [4, 32/300],
//             [5, 44/300],
//             [6, 65/300],
//             [7, 33/300]
//         ])

//         const roulette: Roulette = new Roulette(items);
    
//         const selections: Map<number, number> = new Map([
//             [1, 0],
//             [2, 0],
//             [3, 0],
//             [4, 0],
//             [5, 0],
//             [6, 0],
//             [7, 0]
//         ]);

//         const trials: number = 1000;

//         let selection: number;
//         for (let i = 0; i < trials; i ++) {
//             selection = roulette.selectRandomItem();
//             selections.set(selection, selections.get(selection)! + 1);
//         }

//         for (let i = 1; i <= 7; i++) {
//             console.log(`Item ${i} has selection possibility equal to ${selections.get(i)! / trials} and its actual percentage of selection was set to ${items.get(i)}.`)
//         }
//     })
// })