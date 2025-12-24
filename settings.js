const fs = require("fs");
const path = require("path");

const SETTINGS_PATH = path.join(__dirname, "settings.json");

let settings = JSON.parse(
    fs.readFileSync(SETTINGS_PATH, "utf-8")
);

function getSettings() {
    return settings;
}

function updateSetting(key, value) {
    settings[key] = value;
    fs.writeFileSync(
        SETTINGS_PATH,
        JSON.stringify(settings, null, 2)
    );
}

module.exports = {
    getSettings,
    updateSetting
};
