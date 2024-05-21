/* @refresh reload */
import { render } from "solid-js/web";
import {HashRouter, Route} from "@solidjs/router";

import "./index.css";
import {Index} from "./pages/Index";
import {Lobby} from "./pages/Lobby";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
    throw new Error("Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?");
}

render(
    () => (
        <HashRouter>
            <Route path="/" component={Index} />
            <Route path="/lobby/:id" component={Lobby} />
        </HashRouter>
    ),
    root!,
);
