type ProbabilityInterval = {
    start: number;
    stop: number;
}

/**
 * Handles the random selection of an item among a set of items with different 
 * probability of selection for each.
 */
class Roulette {
    // Two paraller arrays containing one the item and the other its probability to get selected
    private items: number[];
    private probabilityIntervals: ProbabilityInterval[];

    /**
     * Creates a Roulette instance with the given {items}. The keys of the map represent the items
     * and the values represent their probabilities of selection
     * @param items 
     */
    public constructor(items: Map<number, number>) {
        this.items = Array.from(items.keys());
        this.probabilityIntervals = [];

        let totalProbability: number = 0;
        items.forEach((probability: number, item: number) => {
            totalProbability += probability;
        })

        console.assert(Math.abs(totalProbability - 1) < 0.001, "The probabilities are not normalized");

        this.probabilityIntervals = this.createProbabilityIntervals(items);
    }

    /**
     * It randomly selects an item respecting the probability of selecting each item over the others.
     */
    public selectRandomItem(): number {
        const randomNumber: number = Math.random();

        let found: boolean = false;
        let index: number = 0;
        let item: number = this.items[index];

        while (!found && index < this.items.length)  {
            if (this.probabilityIntervals[index].start < randomNumber && this.probabilityIntervals[index].stop >= randomNumber) {
                found = true;
                item = this.items[index];
            } else {
                index += 1;
            }
        }

        return item;
    }

    private createProbabilityIntervals(items: Map<number, number>): ProbabilityInterval[] {
        const result: ProbabilityInterval[] = [];

        result.push({
            start: 0,
            stop: items.get(this.items[0])!
        });

        for (let i = 1; i < this.items.length; i++) {
            result.push({
                start: result[i - 1].stop,
                stop: result[i - 1].stop + items.get(this.items[i])!
            })
        }

        return result;
    }
}

export default Roulette;