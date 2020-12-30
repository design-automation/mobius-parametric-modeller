export function updateLocalViewerSettings(settings: any): boolean {
    if (!settings) { return false; }
    let settings_string;
    if (typeof settings === 'string') {
        settings = JSON.parse(settings);
    }
    if (settings.cesium) {
        delete settings['cesium'];
    }
    settings_string = JSON.stringify(settings);
    if (settings_string === '{}') { return false; }
    const local_settings = JSON.parse(localStorage.getItem('mpm_settings'));

    if (settings === null) {
        return false;
    } else {
        propCheck(settings, local_settings);
        localStorage.setItem('mpm_settings', JSON.stringify(settings));
        if (settings.camera) {
            // console.log(JSON.stringify(settings.camera))
            localStorage.setItem('gi_camera', JSON.stringify(settings.camera));
        }
    }
    return true;
}

export function updateCesiumViewerSettings(settings: any): boolean {
    if (!settings) { return false; }
    let settings_string;
    if (typeof settings === 'string') {
        settings = JSON.parse(settings);
    }
    if (!settings || !settings.cesium) {
        return false;
    }
    settings = settings.cesium;
    settings_string = JSON.stringify(settings);
    if (settings_string === '{}') { return false; }
    const local_settings = JSON.parse(localStorage.getItem('cesium_settings'));

    if (settings === null) {
        return false;
    } else {
        propCheck(settings, local_settings);
        settings.updated = true;
        localStorage.setItem('cesium_settings', JSON.stringify(settings));
    }
    return true;
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
