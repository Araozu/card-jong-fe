import { A } from "@solidjs/router";
import { createSignal, onMount, Show } from "solid-js";
import { backend, UserInfo } from "../utils";
import { Card } from "../components/Card";


export function Index() {
    const [loading, setLoading] = createSignal(false);
    const [userInfo, setUserInfo] = createSignal<UserInfo | null>(null);
    const [error, setError] = createSignal("");
    const [username, setUsername] = createSignal("");

    onMount(() => {
        // attempt to get userinfo from localstorage
        // validate userinfo with backend
        console.log("validating userinfo in localstorage");
    });

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

            const response = await backend.get("/register");
            console.log(response.data);
        } catch (_e) {
            const e = _e as Error;
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

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
                    </form>
                </Show>
                <Show when={userInfo() !== null}>
                    <p>:D</p>
                </Show>
                <Show when={error() !== ""}>
                    <p class="bg-red-700 text-red-50 inline-block py-1 px-2 my-2 rounded">Error: {error()}</p>
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
            <div class="h-16" />
            <div class="text-center">
                <Card />
                <Card />
                <Card />
            </div>
        </div>
    );
}
