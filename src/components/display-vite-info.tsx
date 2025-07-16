import { component$ } from "@builder.io/qwik";
import { pluginNames, viteMode, viteCommand, viteConfigRoot } from "virtual:vite-info";

export default component$(() => {

    return <div>
        <h2>Vite Info:</h2>
        <ul>
            <li>Mode: {viteMode}</li>
            <li>Command: {viteCommand}</li>
            <li>Root: {viteConfigRoot}</li>
        </ul>
        <p>
            Plugins included:
        </p>
        <ul>
            {pluginNames.map(p => (<>
                <li>{p}</li>
            </>))}
        </ul>
    </div>
})