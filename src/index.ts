import { IDirectoryHasher, DirectoryHasher } from "./directoryHasher";
import {  PollingService } from "./pollingService";
import * as http from "http";



async function main() {
    //create a hasher (instance of my directoryHasher)
    const hasher = new DirectoryHasher();
    //similarly create a poller (instance of pollingservice)
    const poller = new PollingService(hasher, ".", 3000);
    //listen for a changed event from the poller and then log to console
    poller.on("changed", (hash) => {
        console.log("Directory change. New hash:", hash)
    });

    //kicks off the repeating loop using setInterval
    poller.start();
    console.log("Polling started frm for directory every 3 seconds")
    const server = http.createServer((req, res) => {
        //Always response with JSON
        if (req.url == "/hash") {
            //return latest hash
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify({hash: poller.getCurrentHash()}));
        } else if (req.url == "/changes") {
            //return last change timestamp
            res.writeHead(200, {"Content-Type": "application/json"});
            const changed = poller.getLastChanged();
            res.end(JSON.stringify({ lastChanged: changed ? changed.toISOString() : null}));
        } else {
            //unknown route
            res.writeHead(404, {"Content-Type": "application/json"});
            res.end(JSON.stringify({ error: "Not found"}));
        }
    });

    server.listen(3000, () => {
        console.log("Server running");
        console.log("Available endpoints:");
        console.log(" - GET /hash")
        console.log(" - GET /changes")
    });
    
}


main();
