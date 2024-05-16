import { A, useNavigate } from "@solidjs/router";
import { createSignal, onMount, Show } from "solid-js";
import { backend, UserInfo } from "../utils";
import { Card } from "../components/Card";
import { AxiosError } from "axios";

const userIdKey = "UserId";
const usernameKey = "Username";

export function Index() {
    const [userInfo, setUserInfo] = createSignal<UserInfo | null>(null);
    const [validated, setValidated] = createSignal(false);

    onMount(async() => {
        // attempt to get userinfo from localstorage
        // validate userinfo with backend
        const UserId = localStorage.getItem(userIdKey);
        const Username = localStorage.getItem(usernameKey);

        if (UserId === null || Username === null) {
            return;
        }

        setUserInfo({
            UserId,
            Username,
        });
        setValidated(false);

        try {
            // validate in backend
            await backend.get("/validate", {
                headers: {
                    "Authorization": `Bearer ${UserId}`,
                },
            });

            // If the previous hasn't throw, the token is valid.
            setValidated(true);
        } catch (e) {
            // If this throws, the userid is not validated
            localStorage.removeItem(userIdKey);
            localStorage.removeItem(usernameKey);
            setUserInfo(null);
            setValidated(false);
        }
    });

    return (
        <div class="w-[40rem] mx-auto bg-c-bg-2 my-4 p-4 rounded shadow-md">
            <h1 class="text-c-on-bg text-3xl font-black pb-4">
                Card-jong
            </h1>
            <p>Mahjong with cards</p>
            <hr />
            <div class="py-4">
                <h2 class="text-xl py-2 font-black">Play:</h2>
                <Show when={userInfo() === null}>
                    <UserRegistration setUserInfo={(i) => {
                        setValidated(true);
                        setUserInfo(i);
                    }}
                    />
                </Show>
                <Show when={userInfo() !== null && !validated()}>
                    <p>Validating user id...</p>
                </Show>
                <Show when={userInfo() !== null && validated()}>
                    <LobbyConnection />
                </Show>
            </div>
            <hr />
            <div class="py-4">
                <h2 class="text-xl py-2 font-black">
                    Learn to play:
                </h2>
                <A
                    class="inline-block py-2 px-4 rounded bg-teal-500 dark:bg-teal-700 text-white
                    disabled:opacity-50 disabled:cursor-not-allowed"
                    href="/rules"
                >
                    Go to game rules
                </A>
            </div>
            <div class="text-center py-8">
                <div class="inline-block -rotate-6 translate-x-2 translate-y-1 hover:-translate-y-2 transition-transform">
                    <Card value={38} />
                </div>
                <div class="inline-block hover:-translate-y-2 transition-transform">
                    <Card value={4} />
                </div>
                <div class="inline-block rotate-6 -translate-x-2 translate-y-1 hover:-translate-y-2 transition-transform">
                    <Card value={37} />
                </div>
            </div>
        </div>
    );
}

function UserRegistration(props: {setUserInfo: (u: UserInfo) => void}) {
    const [loading, setLoading] = createSignal(false);
    const [error, setError] = createSignal("");
    const [username, setUsername] = createSignal("");

    // Register a user in the backend, get their user_id, store it in localStorage.
    const registerUser = async(ev: Event) => {
        ev.preventDefault();

        setLoading(true);
        setError("");
        try {
            const user = username();

            if (user.length === 0) {
                throw new Error("Username is empty");
            }

            const response = await backend.get(`/register?username=${user}`);
            props.setUserInfo(response.data);
            localStorage.setItem(userIdKey, response.data.UserId);
            localStorage.setItem(usernameKey, response.data.Username);
        } catch (_e) {
            const e = _e as AxiosError<{error: string}>;

            if (e.response && e.response.data && e.response.data.error) {
                setError(e.response.data.error);
            } else {
                setError(e.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={(ev) => registerUser(ev)}>
            <label for="index-register-name">Enter your name (3 to 20 letters, numbers or undescores):</label>
            <br />
            <input
                id="index-register-name"
                class="inline-block px-2 py-1 my-2 border border-c-border-1 rounded-md bg-c-bg text-c-on-bg"
                type="text"
                value={username()}
                required
                pattern="[a-zA-Z0-9_]{3,20}"
                onInput={(ev) => setUsername(ev.target.value)}
            />
            <br />
            <button
                class="inline-block py-2 px-4 rounded bg-teal-500 dark:bg-teal-700 text-white
                            disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading()}
            >
                            Register
            </button>
            <Show when={error() !== ""}>
                <p class="bg-red-700 text-red-50 inline-block py-1 px-2 my-2 rounded">Error: {error()}</p>
            </Show>
        </form>
    );
}

function LobbyConnection() {
    const [loading, setLoading] = createSignal(false);
    const [error, setError] = createSignal("");
    const navigate = useNavigate();

    const joinLobby = (ev: Event) => {
        ev.preventDefault();
    };

    const createLobby = async() => {
        setLoading(true);

        try {
            const res = await backend.post<{LobbyId: string}>("/lobby/new");
            console.log(res.data);
            // Redirect to the lobby component using the received lobby id
            navigate(`/lobby/${res.data.LobbyId}`);
        } catch (_e) {
            const e: Error = _e as Error;
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div class="pl-2 border-l border-c-border-1">
            <h3 class="text-xl py-2 font-bold">Join a lobby:</h3>

            <form onSubmit={joinLobby}>
                <label for="lobby-join-input">
                    Enter the ID of the lobby you want to join:
                </label>
                <br />
                <input
                    id="lobby-join-input"
                    type="text"
                    class="bg-c-bg text-c-on-bg py-1 px-2 rounded border border-c-border-1 my-2"
                />
                <br />
                <button
                    class="inline-block py-2 px-4 rounded bg-blue-600 text-white
                    disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={loading() || true}
                >
                    Join lobby
                </button>
            </form>

            <h3 class="text-xl pt-6 pb-2 font-bold">Create a new lobby:</h3>

            <button
                class="inline-block py-2 px-4 rounded bg-blue-600 text-white
                    disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={createLobby}
                disabled={loading()}
            >
                Create a new lobby
            </button>

            <p>{error()}</p>
        </div>
    );
}
