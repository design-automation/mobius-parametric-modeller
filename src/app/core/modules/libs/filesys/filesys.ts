import * as fs from "fs";
import * as gs from "gs-json";

/**
 * Write a file.
 */
export function writeThreeToJSONFile(data: any, filename: string): boolean {
    fs.writeFile(filename, JSON.stringify(data, null, 4), (err) => {
        if (err) {
            console.log("Error writing file: " + filename);
            console.error(err);
            return false;
        }
        console.log("File has been created: " + filename);
    });
    return true;
}

/**
 * Write a file.
 */
export function writeGsToJSONFile(model: gs.IModel, filename: string): boolean {
    fs.writeFile(filename, model.toJSON(), (err) => {
        if (err) {
            console.log("Error writing file: " + filename);
            console.error(err);
            return false;
        }
        console.log("File has been created: " + filename);
    });
    return true;
}

/**
 * Read a file.
 */
export function readToJSONFile(filename: string): string {
    // fs.readFile(filename, (err) => {
    //     if (err) {
    //         console.log("Error reading file: " + filename);
    //         console.error(err);
    //         return false;
    //     }
    //     console.log("File has been created: " + filename);
    // });

    const contents: string = fs.readFileSync(filename).toString();
    return contents;
}
