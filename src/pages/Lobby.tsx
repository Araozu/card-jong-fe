import { Show, createSignal, onMount } from "solid-js";
import LoadingIcon from "../assets/loading.svg";
import ErrorIcon from "../assets/error.svg";

enum LobbyStatus {
    Connecting,
    Connected,
    Disconnected,
    Error,
}

export function Lobby() {
    const [status, setStatus] = createSignal(LobbyStatus.Connecting);
    let ws: WebSocket|null = null;

    const lobbyConnect = async() => {
        ws = new WebSocket(`${import.meta.env.VITE_WS_URL}/lobby/connect`);

        ws.addEventListener("open", () => {
            console.log("Connection open!");
            setStatus(LobbyStatus.Connected);
        });

        ws.addEventListener("message", (ev) => {
            console.log("message from ws!");
            console.log(ev);
        });

        ws.addEventListener("error", (ev) => {
            console.error(ev);
            setStatus(LobbyStatus.Error);
        });

        ws.addEventListener("close", () => {
            console.log("connection closed");
        });
    };

    const send = () => {
        if (ws === null) {
            setStatus(LobbyStatus.Disconnected);
            return;
        }

        const message = "hello SEKAI";
        ws.send(message);
    };

    onMount(lobbyConnect);

    return (
        <div class="w-[40rem] mx-auto bg-c-bg-2 my-4 p-4 rounded shadow-md">
            <h1 class="text-c-on-bg text-3xl font-black pb-4">
                Lobby
            </h1>

            <Show when={status() === LobbyStatus.Connecting}>
                <p>
                    <img class="inline-block h-6 animate-spin" src={LoadingIcon} alt="..." />
                    Connecting to the lobby
                </p>
            </Show>

            <Show when={status() === LobbyStatus.Error}>
                <p>
                    <img class="inline-block h-6" src={ErrorIcon} alt="..." />
                    Error connecting to the lobby
                </p>
            </Show>

            <Show when={status() === LobbyStatus.Connected}>
                <button class="bg-cyan-500 p-2 rounded text-white" onClick={send}>Send message</button>
            </Show>

        </div>
    );
}
