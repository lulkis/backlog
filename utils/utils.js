const path = require('path');

function cleanPath(input) {
    const cleaned = input.toLowerCase()
        .replaceAll(" ", "_")
        .replaceAll(":", "");

    return path.basename(cleaned);
}

module.exports = {
    cleanPath
}
