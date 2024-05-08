import { A } from "@solidjs/router";
import { createSignal, onMount, Show } from "solid-js";
import { backend, UserInfo } from "../utils";
import { Card } from "../components/Card";
import { AxiosError } from "axios";

const userIdKey = "UserId";
const usernameKey = "Username";

export function Index() {
    const [userInfo, setUserInfo] = createSignal<UserInfo | null>(null);

    onMount(() => {
        // attempt to get userinfo from localstorage
        // validate userinfo with backend
        console.log("validating userinfo in localstorage");
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
                    <UserRegistration setUserInfo={setUserInfo} />
                </Show>
                <Show when={userInfo() !== null}>
                    <p>:D (user registered)</p>
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

