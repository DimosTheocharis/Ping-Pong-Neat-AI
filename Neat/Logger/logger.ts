
/**
 * Responsible for logging meaningful messages with a distinctive format
 */
class Logger {
    private static frameBorderWidth: number = 2;
    private static frameSideThreshold: number = 1;

    public static logMessages(title: string, messages: string[]): void {
        const frameLength: number = this.findLongestMessageLength(messages) + 2 * this.frameBorderWidth + 2 * this.frameSideThreshold;

        console.log("\n");
        console.log("\\".repeat(frameLength));
        console.log(this.centerTitle(title, frameLength));
        console.log("\\".repeat(frameLength));
        messages.forEach((message: string) => {
            console.log(
                "\\".repeat(this.frameBorderWidth) + 
                " ".repeat(this.frameSideThreshold) +
                message + 
                " ".repeat(frameLength - 2 * this.frameBorderWidth - 2 * this.frameSideThreshold - message.length + 1) +
                "\\".repeat(this.frameBorderWidth)
            );
        });
        console.log("\\".repeat(frameLength));
        console.log("\n")
    }

    private static findLongestMessageLength(messages: string[]): number {
        let longestMessage: string = messages[0];
        
        messages.forEach((message: string) => {
            if (message.length > longestMessage.length) {
                longestMessage = message;
            }
        })

        return longestMessage.length;
    }

    private static centerTitle(title: string, frameLength: number): string {
        const blankSpaces: number = frameLength - title.length - 2 * this.frameBorderWidth;

        return "\\".repeat(this.frameBorderWidth) + 
                " ".repeat(Math.floor(blankSpaces / 2)) +
                title + 
                " ".repeat(Math.floor(blankSpaces / 2) + (blankSpaces % 2 === 0 ? 0 : 1)) + 
                "\\".repeat(this.frameBorderWidth);
    }
}

export { Logger };