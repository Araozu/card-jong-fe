import { Show, createSignal, onCleanup, onMount } from "solid-js";
import LoadingIcon from "../assets/loading.svg";
import ErrorIcon from "../assets/error.svg";
import ConnectedIcon from "../assets/ok.svg";
import { userIdKey } from "./Index";
import { useNavigate } from "@solidjs/router";

enum LobbyStatus {
    Connecting,
    Connected,
    Disconnected,
    Authenticating,
    Error,
}

type LobbyMsg = {
    action: string,
    value: string,
}

const connectionRetryInterval = 5000;

export function Lobby() {
    const [status, setStatus] = createSignal(LobbyStatus.Disconnected);
    const navigate = useNavigate();

    let ws: WebSocket|null = null;

    const lobbyConnect = () => {
        setStatus(LobbyStatus.Connecting);
        ws = new WebSocket(`${import.meta.env.VITE_WS_URL}/lobby/connect`);

        ws.addEventListener("open", onWsOpen);
        ws.addEventListener("message", onWsMessage);
        ws.addEventListener("error", onWsError);
        ws.addEventListener("close", onWsClose);
    };

    const onWsOpen = () => {
        console.log("Connection open. Authenticating...");
        setStatus(LobbyStatus.Authenticating);

        // The first message must be authenticating with the server

        const userId = localStorage.getItem(userIdKey);
        if (userId === null) {
            // Redirect to home page
            ws?.close(1000);
            navigate("/");
            return;
        }

        // Send an auth message to the server
        // The server will respond with either "authenticated" or "unauthenticated"
        ws!.send(JSON.stringify({
            action: "auth",
            value: userId,
        }));
    };

    const onWsMessage = (ev: MessageEvent) => {
        const data = JSON.parse(ev.data) as LobbyMsg;

        switch (data.action) {
            case "auth": {
                if (data.value === "authenticated") {
                    setStatus(LobbyStatus.Connected);
                } else if (data.value === "unauthenticated") {
                    ws?.close(1000);
                    navigate("/");
                }
                break;
            }
        }
    };

    const onWsError = (ev: Event) => {
        console.error("error in connection");
        console.error(ev);
        setStatus(LobbyStatus.Error);
    };

    const onWsClose = (ev: CloseEvent) => {
        if (ev.code === 1000) {
            // The connection was normally closed
            return;
        }

        // If the previous state is "Error", we don't set
        // the state to Disconnected
        if (status() !== LobbyStatus.Error) {
            setStatus(LobbyStatus.Disconnected);
        }

        console.log(`connection closed. reconnecting in ${connectionRetryInterval}ms`);
        setTimeout(lobbyConnect, connectionRetryInterval);
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
    onCleanup(() => {
        console.log("lobby cleanup");
        ws?.close(1000);
    });

    return (
        <div class="w-[40rem] mx-auto bg-c-bg-2 my-4 p-4 rounded shadow-md">
            <h1 class="text-c-on-bg text-3xl font-black pb-4">
                Lobby
            </h1>

            <Show when={status() === LobbyStatus.Disconnected}>
                <p>
                    <img class="inline-block h-6 animate-spin" src={LoadingIcon} alt="..." />
                    Disconected. Attempting reconnection in {connectionRetryInterval / 1000} seconds.
                </p>
            </Show>
            <Show when={status() === LobbyStatus.Connecting}>
                <p>
                    <img class="inline-block h-6 animate-spin" src={LoadingIcon} alt="..." />
                    Connecting to the lobby
                </p>
            </Show>
            <Show when={status() === LobbyStatus.Authenticating}>
                <p>
                    <img class="inline-block h-6 animate-spin" src={LoadingIcon} alt="..." />
                    Authenticating with the server
                </p>
            </Show>

            <Show when={status() === LobbyStatus.Error}>
                <p>
                    <img class="inline-block h-6" src={ErrorIcon} alt="..." />
                    Error connecting to the lobby
                </p>
            </Show>

            <Show when={status() === LobbyStatus.Connected}>
                <p>
                    <img class="inline-block h-6" src={ConnectedIcon} alt="..." />
                    Connected
                </p>

                <button class="bg-cyan-500 p-2 rounded text-white" onClick={send}>Send message</button>
            </Show>

        </div>
    );
}
