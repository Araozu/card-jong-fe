import { CardType, intToCardType } from "../types/cards";
import { ClubIcon } from "./icons/ClubIcon";
import { DiamondIcon } from "./icons/DiamondIcon";
import { HeartIcon } from "./icons/HeartIcon";
import { JokerIcon } from "./icons/JokerIcon";
import { SpadeIcon } from "./icons/SpadeIcon";


export function Card(props: {value: number}) {
    const value = props.value;

    const [cardType, cardValue, [bgColor, textColor]] = intToCardType(value);
    console.log(cardType, cardValue, bgColor, textColor);

    let icon = null;
    switch (cardType) {
        case CardType.Hidden:
            icon = <span class="inline-block absolute left-2 top-2 w-[2.75rem] h-[4.75rem] border-2 border-c-border-1" />;
            break;
        case CardType.Club:
            icon = <ClubIcon class="absolute bottom-1 right-1" fill={textColor} />;
            break;
        case CardType.Diamond:
            icon = <DiamondIcon class="absolute bottom-1 right-1" fill={textColor} />;
            break;
        case CardType.Heart:
            icon = <HeartIcon class="absolute bottom-1 right-1" fill={textColor} />;
            break;
        case CardType.Spade:
            icon = <SpadeIcon class="absolute bottom-1 right-1" fill={textColor} />;
            break;
        case CardType.BlackJoker:
        case CardType.RedJoker:
        case CardType.BlueJoker:
        case CardType.GreenJoker:
            icon = <JokerIcon class="absolute left-2 top-6" fill={textColor} />;
            break;
    }

    return (
        <button class={"inline-block w-16 h-24 border-2 border-c-border-1 relative select-none"}
            style={{"color": textColor, "background-color": bgColor}}
        >
            <span class="absolute top-1 left-1 font-bold text-4xl font-sans-serif">
                {cardValue}
            </span>
            {icon}
        </button>
    );
}


