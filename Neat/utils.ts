
/**
 * Restricts the access of a variabe whose purpose is to count. 
 */
class Counter {
    private value: number;

    /**
     * 
     * @param initialValue Default value is 0
     */
    public constructor(initialValue: number = 0) {
        this.value = initialValue;
    }

    /**
     * Increments the value of the counter by one, and returns it
     */
    public next(): number {
        return ++this.value;
    }

    /**
     * Returns the current value of the counter
     */
    public getValue(): number {
        return this.value;
    }
}

export { Counter };