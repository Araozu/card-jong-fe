
export enum CardType {
    Club,
    Diamond,
    Heart,
    Spade,
    King, Queen, Jack,
    RedJoker,
    GreenJoker,
    BlackJoker,
    BlueJoker,
}

const tailwindCardColors: Array<[string, string]> = [
    // black
    ["var(--card-black-bg)", "var(--card-on-black-bg)"],
    // red
    ["var(--card-red-bg)", "var(--card-on-red-bg)"],
    // green
    ["var(--card-green-bg)", "var(--card-on-green-bg)"],
    // blue
    ["var(--card-blue-bg)", "var(--card-on-blue-bg)"],
];


/**
 * Cards are encoded as integers, and their types and values depend of their bits:
 *
 * @param value number that encodes the card value
 * @returns The type of card and its value (A, 1, 2, etc), if any
 */
export function intToCardType(value: number): [CardType, string, [string, string]] {
    switch ((value << 23) >>> 28) {
        case 0: {
            const type = ((value & 1) === 1) ? CardType.Club : CardType.Spade;
            let number = ((value << 27) >>> 28).toString();
            if (number === "1") {
                number = "A";
            }

            return [type, number, tailwindCardColors[0]];
        }
        case 1: {
            const type = ((value & 1) === 1) ? CardType.Heart : CardType.Diamond;
            let number = ((value << 27) >>> 28).toString();
            if (number === "1") {
                number = "A";
            }

            return [type, number, tailwindCardColors[1]];
        }
        case 2:
            return [CardType.BlackJoker,"", tailwindCardColors[0]];
        case 3:
            return [CardType.RedJoker, "", tailwindCardColors[1]];
        case 4:
            return [CardType.GreenJoker,"", tailwindCardColors[2]];
        case 5:
            return [CardType.BlueJoker,"", tailwindCardColors[3]];
        case 6:
            return [CardType.Jack,"J", tailwindCardColors[2]];
        case 7:
            return [CardType.Queen,"Q", tailwindCardColors[2]];
        case 8:
            return [CardType.King,"K", tailwindCardColors[2]];
        default:
        {
            console.error("Encountered a badly encoded card: ", value);
            throw new Error(`Badly encoded card value: ${value}`);
        }
    }
}

