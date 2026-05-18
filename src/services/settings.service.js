const settings = require("../utils/settings");

function getSettings() {
    return settings.getSettings();
}

function updateSettings(data) {
    settings.updateSetting("time_in_minutes", data.m_in_min === "on")
    settings.updateSetting("streaming", data.streaming === "on")
}

module.exports = {
    getSettings,
    getSettingById: updateSettings
}
