/**
 * Download a file.
 * @param data
 * @param filename
 */
export function download(data: string, filename: string): boolean {
      const data_type = 'text/plain;charset=utf-8';
      const data_bom = decodeURIComponent('%ef%bb%bf');
      if (window.navigator.msSaveBlob) {
          const blob = new Blob([data_bom + data], { type: data_type } );
          window.navigator.msSaveBlob(blob, data);
      } else {
          const link = document.createElement('a');
          const content = data_bom + data;
          const uriScheme = ['data:', data_type, ','].join('');
          link.href = uriScheme + content;
          link.download = filename;
          // FF requires the link in actual DOM
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      }
      return true;
}
