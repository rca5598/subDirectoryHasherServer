//Want this to know which directory to watch, how often to check it, and which hasher service to use

import { IDirectoryHasher, DirectoryHasher } from "./directoryHasher";
import { EventEmitter } from "events";


//interface for the shape of the class, to come
interface IPollingService {
    //start and stop of the polling loop
    start(): void;
    stop(): void;
}

//class of the shape of IPollingService
export class PollingService extends EventEmitter implements IPollingService {
    //use private so they cannot be called from outside (encapsulation)
    private hasher: IDirectoryHasher;
    private directoryPath: string;
    private intervalMs: number;
    //can sometimes be a timer, sometimes null
    private intervalId: NodeJS.Timeout | null = null;
    //can sometimes be a string, sometimes null
    private lastHash: string | null = null;

    //constructor is the recipe for how to create and initialize a pollingService
    constructor(hasher: IDirectoryHasher, directoryPath: string, intervalMs: number) {
        super();
        this.hasher = hasher;
        this.directoryPath = directoryPath;
        this.intervalMs = intervalMs;

    }
    start(): void {
        //set up a arrow function, which is not async by default so declare that. 
        this.intervalId = setInterval(async() => {
            //create a new hash for comparison
            const newHash = await this.hasher.getHash(this.directoryPath)
            //check if there is no current hash and append if so
            if (this.lastHash == null) {
                this.lastHash = newHash;
            //check if the new hash is different. for now just write something to console and append
            } else if (this.lastHash != newHash) {
                this.emit("changed", newHash);
                this.lastHash = newHash;
            }
        }, this.intervalMs);
    }

    //stop method implementation
    stop(): void {
        //check if there is an intervalID which means polling is occuring
        if (this.intervalId) {
            //clear it to reset the poll
            clearInterval(this.intervalId);
            //empty the ID so that it will start again
            this.intervalId = null; 
        }
    }
}