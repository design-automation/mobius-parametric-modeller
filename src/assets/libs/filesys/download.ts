/**
 * Download a file.
 * @param data
 * @param filename
 */
export function download(data: string, filename: string): boolean {
    //   const data_type = 'text/plain;charset=utf-8';
    //   const data_bom = decodeURIComponent('%ef%bb%bf');
    //   if (window.navigator.msSaveBlob) {
    //       const blob = new Blob([data_bom + data], { type: data_type } );
    //       window.navigator.msSaveBlob(blob, data);
    //   } else {
    //       const link = document.createElement('a');
    //       const content = data_bom + data;
    //       const uriScheme = ['data:', data_type, ','].join('');
    //       link.href = uriScheme + content;
    //       link.download = filename;
    //       // FF requires the link in actual DOM
    //       document.body.appendChild(link);
    //       link.click();
    //       document.body.removeChild(link);
    //   }
    //   return true;
    // console.log('Downloading');
    // @ts-ignore
    window.download = { data: data, filename: filename};
    // @ts-ignore
    navigator.webkitPersistentStorage.requestQuota(1024 * 1024 * 1024, function() {
        // @ts-ignore
        window.webkitRequestFileSystem(window.TEMPORARY , 1024 * 1024 * 1024, SaveDatFileBro);
    });
    return true;
}

function SaveDatFileBro(localstorage) {
    // @ts-ignore
    const filename = window.download.filename;
    localstorage.root.getFile(filename, {create: true}, function(DatFile) {
      DatFile.createWriter(function(DatContent) {
        const data_bom = decodeURIComponent('%ef%bb%bf');
        // @ts-ignore
        const blob = new Blob([data_bom + window.download.data], {type: 'text/plain;charset=utf-8'});
        DatContent.write(blob);
        const link = document.createElement('a');
        link.href = 'filesystem:' + window.location.protocol + '//' + window.location.hostname + '/temporary/' + filename;
        link.download = filename;
        link.click();
      });
    });
  }
