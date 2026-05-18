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

function getAllLists_Minimum(){
    return persistence.getAllLists_Minimum()
}

function insertMovieIntoList(data){
    const media = {
        media: data.media,
        type: data.type,
    }
    persistence.insertMovieIntoList(data.list, media);
}

function deleteList(data){
    const id = parseInt(data.id);
    persistence.deleteList(id)
}

function deleteMediaFromList(data){
    const id = data.list
    const media = data.element
    persistence.deleteMediaFromList(id, media);
}

module.exports = {
    createList,
    getListDetailById,
    getFullListById,
    updateListDetails,
    getAllLists,
    getAllLists_Minimum,
    insertMovieIntoList,
    deleteList,
    deleteMediaFromList
}
