import * as fs from "fs/promises";
import fg from "fast-glob";
import crypto from "crypto";


//Interface defining the shape of the class to follow, defining that any DirectoryHasher must provide a getHash function, which takes a string directory path and gives back (later, async), a hash(Promise<string>)
export interface IDirectoryHasher {
    getHash(directoryPath: string): Promise<string>;
}
//Class which follows IDirectoryHasher rules
export class DirectoryHasher implements IDirectoryHasher{
    //gethash method as per interface
    async getHash(directoryPath: string): Promise<string> {
        //lists every file (recursively) inside the given directory, and is sorted
        const files = (await fg(["**/*"], {cwd: directoryPath, onlyFiles: true })).sort();
        //creates a hashing object
        const hash = crypto.createHash("sha256");

        //loop through each file in files from above, and updates the hash with filename & content (so that renaming or editing changes the result)
        for (const file of files) {
            const data = await fs.readFile(`${directoryPath}/${file}`);
            hash.update(file);
            hash.update(data);
        }
        //finalise the hashing process and gives back the unique string
        return hash.digest("hex");

    }
}


