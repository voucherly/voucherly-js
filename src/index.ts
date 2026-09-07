import type { VoucherlyStatic } from "./types.js";

export * from "./types.js";

export const VOUCHERLY_JS_URL = "https://checkout.voucherly.it/embed/v1/voucherly.js";

export interface LoadVoucherlyOptions {
    /** Only for development against a local checkout. Production integrations must load Voucherly.js from checkout.voucherly.it. */
    scriptUrl?: string;
}

let pending: Promise<VoucherlyStatic | null> | null = null;

function findScript(url: string): HTMLScriptElement | null {
    const scripts = document.querySelectorAll<HTMLScriptElement>("script[src]");

    for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src === url) {
            return scripts[i];
        }
    }

    return null;
}

function injectScript(url: string): HTMLScriptElement {
    const script = document.createElement("script");
    script.src = url;
    script.async = true;

    const parent = document.head || document.body;
    if (!parent) {
        throw new Error("[Voucherly] Expected document.head or document.body to exist before loading Voucherly.js.");
    }

    parent.appendChild(script);
    return script;
}

/**
 * Loads Voucherly.js and resolves with the `Voucherly` global once it is available.
 * The script is injected once, on the first call; later calls share the same promise.
 * Resolves with `null` outside a browser, so it is safe to call during server-side rendering.
 */
export function loadVoucherly(options: LoadVoucherlyOptions = {}): Promise<VoucherlyStatic | null> {
    if (typeof window === "undefined" || typeof document === "undefined") {
        return Promise.resolve(null);
    }

    if (window.Voucherly) {
        return Promise.resolve(window.Voucherly);
    }

    if (pending) {
        return pending;
    }

    const url = options.scriptUrl || VOUCHERLY_JS_URL;

    pending = new Promise<VoucherlyStatic | null>((resolve, reject) => {
        let script: HTMLScriptElement;
        try {
            script = findScript(url) || injectScript(url);
        } catch (error) {
            reject(error);
            return;
        }

        script.addEventListener("load", () => {
            if (window.Voucherly) {
                resolve(window.Voucherly);
                return;
            }

            reject(new Error("[Voucherly] Voucherly.js loaded but the Voucherly global is not available."));
        });

        script.addEventListener("error", () => {
            reject(new Error("[Voucherly] Failed to load Voucherly.js from " + url + "."));
        });
    });

    // A failed load must not poison later calls: the next one injects the script again.
    pending.catch(() => {
        pending = null;
    });

    return pending;
}
