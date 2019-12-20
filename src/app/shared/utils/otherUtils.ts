export function updateLocalViewerSettings(settings: any): boolean {
    if (!settings) { return false; }
    let settings_string;
    if (typeof settings === 'string') {
        settings_string = settings;
        settings = JSON.parse(settings);
    } else {
        settings_string = JSON.stringify(settings);
    }
    if (settings_string === '{}') { return false; }
    const local_settings = JSON.parse(localStorage.getItem('mpm_settings'));
    if (!hasDiffProps(settings, local_settings)) {
        localStorage.setItem('mpm_settings', settings_string);
        return true;
    }
    return false;
}

function hasDiffProps(obj1, obj2) {
    return !Object.keys(obj2).every(e => Object.keys(obj1).includes(e));
}