const persistence = require("../persistence/index.db");

function getHomepageComponents(){
    return {
        recent_added: persistence.getFiveRecentAdded(),
        recent_finished: persistence.getFiveRecentFinished(),
        backlog_stats: persistence.getBacklogStats()
    }
}

module.exports = {
    getHomepageComponents
}
