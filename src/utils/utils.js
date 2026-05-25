const path = require('path');
const { access } = require("fs/promises");
const { constants } = require("fs");

function cleanPath(input) {
    const cleaned = input.toLowerCase()
        .replaceAll(" ", "_")
        .replaceAll(":", "");

    return path.basename(cleaned);
}

function daysToRelease(input_date){
    if(input_date){
        const [year, month, day] = input_date.split("-");
        const date = new Date(year, month - 1, day);
        const current_date = new Date();
        if (current_date < date) {
            const oneDay = 24 * 60 * 60 * 1000;
            return Math.round(Math.abs((current_date - date) / oneDay));
        }
    }
    return 0;
}

function toDatabaseDate(date){
    if(date){
        const [day, month, year] = date.split(".");
        return year + '-' + month + '-' + day;
    }
}

function saveCoverImage(name, route, image) {
    const path = './public/images/' + route +'/'+ name +'.jpg'
    image.mv(path, function(err) {})
}

function saveHeaderImage(name, route, image) {
    const path = './public/images/' + route +'/header/'+ name +'.jpg'
    image.mv(path, function(err) {})
}

async function fileExists(path) {
    try {
        await access(path, constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

module.exports = {
    cleanPath,
    daysToRelease,
    saveCoverImage,
    saveHeaderImage,
    fileExists,
    toDatabaseDate
}
