import { IDirectoryHasher, DirectoryHasher } from "./directoryHasher";
import { PollingService } from "./pollingService";

//test


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

    //auto stop after 40 seconds
    setTimeout(() => {
        poller.stop();
        console.log("Polling stopped.");
    }, 40000);
}


main();
