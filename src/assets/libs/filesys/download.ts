/**
 * Download a file.
 * @param data
 * @param filename
 */
export function download(data: string, filename: string): boolean {
    // console.log('Downloading');

    const file = new File([data], filename, { type: 'plain/text;charset=utf-8' });
    console.log(file.name);


    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(file);
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    // // @ts-ignore
    // window.download = { data: data, filename: filename};
    // // @ts-ignore
    // navigator.webkitPersistentStorage.requestQuota(1024 * 1024 * 1024, function() {
    //     // @ts-ignore
    //     window.webkitRequestFileSystem(window.TEMPORARY , 1024 * 1024 * 1024, SaveDatFileBro);
    // });

    return true;
}

function SaveDatFileBro(localstorage) {
    // @ts-ignore
    const filename = window.download.filename;
    localstorage.root.getFile(filename, {create: true}, function(fileEntry) {
        fileEntry.toURL('text/plain;charset=utf-8');
        // @ts-ignore
        // console.log(window.download.data);
        fileEntry.createWriter(function(fileWriter) {
            // const data_bom = decodeURIComponent('%ef%bb%bf');
            // @ts-ignore
            const blob = new Blob([window.download.data], {type: 'text/plain;charset=utf-8'});
            fileWriter.write(blob);
            const link = document.createElement('a');
            link.href = fileEntry.toURL('text/plain;charset=utf-8');
            link.download = filename;
            link.click();
            // setTimeout(() => {
            //     fileEntry.remove(() => {
            //         console.log('File removed.');
            //     });
            // }, 10000);
        });
    });
    // @ts-ignore
    // window.download = null;
}
