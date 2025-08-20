import { IDirectoryHasher, DirectoryHasher } from "./directoryHasher";


let myHasher = new DirectoryHasher();

async function main() {
    const res = await myHasher.getHash(".");
    console.log("Hash of current directory:", res);
}


main();
