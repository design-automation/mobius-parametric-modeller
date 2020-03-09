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

    // if (!hasDiffProps(settings, local_settings)) {
    //     localStorage.setItem('mpm_settings', settings_string);
    //     return true;
    // }
    // return false;

    if (settings === null) {
        return false;
    } else {
        propCheck(settings, local_settings);
        localStorage.setItem('mpm_settings', JSON.stringify(settings));
    }
    return true;
}

function hasDiffProps(obj1, obj2) {
    return !Object.keys(obj2).every(e => Object.keys(obj1).includes(e));
}

function propCheck(obj1, obj2, checkChildren = true) {
    for (const i in obj2) {
        if (!obj1.hasOwnProperty(i)) {
            obj1[i] = JSON.parse(JSON.stringify(obj2[i]));
        } else if (checkChildren && obj1[i].constructor === {}.constructor && obj2[i].constructor === {}.constructor) {
            propCheck(obj1[i], obj2[i], false);
        }
    }
}
