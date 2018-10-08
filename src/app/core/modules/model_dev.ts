import * as gs from "gs-json";

/**
 * Creates a new model and populates the model with data.
 *
 * @param model_data The model data in gs-json format.
 * @returns New model if successful, null if unsuccessful or on error.
 */
export function FromData(model_data: string): gs.IModel {
    return new gs.Model(JSON.parse(model_data));
}

/**
 * Save a model to file as gs-json data.
 *
 * @param file_path The path where the file should be saved.
 * @returns New model if successful, null if unsuccessful or on error
 */
export function save(model: gs.IModel , filename: string): boolean {
    const file: File = new File([model.toJSON()], filename);
    downloadContent({
        type: "text/plain;charset=utf-8",
        filename: filename,
        content: model.toJSON(),
    });
    return true;
}

/**
 * Save model as JSON
 * @param model The model to convert.
 * @returns New model if successful, null if unsuccessful or on error
 */
export function toJSON2(model: gs.IModel): string {
    return model.toJSON();
}


/**
 * Creates a new Model and populates the model with data that is read from a file.
 * @param filepath The filepath to the file that contains model data in json format.
 * @returns New model if successful, null if unsuccessful or on error.
 */
export function FromFile(filepath: string): gs.IModel {
    throw new Error("Not implemented.");
}

/**
 * Discards unused points from model.
 * @param model Model to discard points from
 * @returns Number of points discarded if successful, null if unsuccessful or on error
 */
export function discardUnusedPoints(model: gs.IModel): number {
    throw new Error("Method not implemented");
}

/**
 * Discards unused geometry from model.
 * @param model Model to discard geometry from
 * @returns True if successful, null if unsuccessful or on error
 */
export function purge(model: gs.IModel): boolean {
    throw new Error("Method not implemented");
}

// - WEEK 2 -
/**
 * Saves model as a JSON file.
 * @param model Model to save
 * @returns JSON file if successful, null if unsuccessful or on error
 */
export function toJSON(model: gs.IModel): JSON {
    throw new Error("Method not implemented");
}

/**
 * Helper for saving files.
 */
export function downloadContent(options) {
    if (window.navigator.msSaveBlob) {
        const blob = new Blob([options.content],
               {type: options.type });
        window.navigator.msSaveBlob(blob, options.filename);
    } else {
        const link = document.createElement("a");
        const content = options.content;
        const uriScheme = ['data:', options.type, ","].join("");
        link.href = uriScheme + content;
        link.download = options.filename;
        //FF requires the link in actual DOM
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
