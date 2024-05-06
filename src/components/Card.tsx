import { ClubIcon } from "./icons/ClubIcon";
import { JokerIcon } from "./icons/JokerIcon";

export function Card() {
    return (
        <div class="inline-block w-16 h-24 border-2 border-c-border-1 bg-black text-white relative">
            <span class="absolute top-1 left-1 font-bold text-4xl font-sans-serif">
                1
            </span>
            <ClubIcon class="absolute bottom-1 right-1" fill="white" />
        </div>
    );
}
