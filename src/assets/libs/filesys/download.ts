/**
 * Download a file.
 * @param data
 * @param filename
 */
export function download(data: string, filename: string): boolean {
    // console.log('Downloading');

    const file = new File([data], filename, { type: 'plain/text;charset=utf-8' });
    // console.log(file.name);

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(file);
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    return true;
}
