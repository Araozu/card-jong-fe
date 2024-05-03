import type { Component } from "solid-js";

import logo from "./logo.svg";
import styles from "./App.module.css";

const App: Component = () => (
    <div class={styles.App}>
        <header class={styles.header}>
            <img src={logo} class={styles.logo} alt="logo" />
            <p class="text-red-400 font-black border border-green-500 rounded-lg py-2 px-4">
                Edit <code>src/App.tsx</code> and save to reload.
            </p>
            <a
                class={styles.link}
                href="https://github.com/solidjs/solid"
                target="_blank"
                rel="noopener noreferrer"
            >
                Learn Solid
            </a>
        </header>
    </div>
);

export default App;
