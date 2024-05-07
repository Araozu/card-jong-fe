import { intToCardType } from "../types/cards";
import { ClubIcon } from "./icons/ClubIcon";

export function Card(props: {value: number}) {
    const value = props.value;

    const [cardType, cardValue, [bgColor, textColor]] = intToCardType(value);
    console.log(cardType, cardValue, bgColor, textColor);

    return (
        <div class={"inline-block w-16 h-24 border-2 border-c-border-1 relative"}
            style={{"color": textColor, "background-color": bgColor}}
        >
            <span class="absolute top-1 left-1 font-bold text-4xl font-sans-serif">
                {cardValue}
            </span>
            <ClubIcon class="absolute bottom-1 right-1" fill={textColor} />
        </div>
    );
}


