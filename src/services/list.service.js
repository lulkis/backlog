const persistence = require("../persistence/list.db");
const {db} = require("../utils/db");

function createList(data){
    const list = {
        name: data.name,
        description: data.description,
        color: data.color
    }
    persistence.createList(list);
}

function getListDetailById(id){
    return persistence.getListDetailById(id)
}

function getFullListById(id){
    return {
        detail: persistence.getListDetailById(id),
        content: persistence.getListContentById(id)
    }
}

function updateListDetails(id, data){
    const list = {
        id: id,
        name: data.name,
        description: data.description,
        color: data.color,
    }
    persistence.updateListDetails(list)
}

function getAllLists(){
    return persistence.getAllLists()
}

module.exports = {
    createList,
    getListDetailById,
    getFullListById,
    updateListDetails,
    getAllLists
}
