//============================== IMPORTS =========================
const prisma = require('../prisma/client');
const { eventTypes } = require('../utils/eventType');
const {
    formatDate
} = require('../utils/noteHelper');

//============================== CREATE NOTE =========================
const createNoteResponse = async (data) => {
    try{
        const category = await getCategory(data.categoryId);
        const response = {
            id : data.id,
            title: data.title,
            content: data.content,
            icon: category.icon,
            pinned: data.pinned,
            category: category.name,
            createdAt: formatDate(data.createdAt),
            updatedAt: formatDate(data.updateAt)
        };
        return response;
    }catch(err) {
        console.log("!! ERROR IN FUNCTION: createNoteResponse File: src/services/note.service.js UNDER: CREATE NOTE");
    }
};

const ReqValid = (note) => {
    try{
        if (!note.title || !note.content || !note.category) {
            return false;
        }else {
            return true
        }
    } catch(err) {
        console.log("!! ERROR IN FUNCTION: pushNote File: src/services/note.service.js UNDER: CREATE NOTE");
    }
};

const noteReturnValid = async (note) => {
    try{
        if (!note){
            return false;
        }else {
            return true;
        }
    }catch(err){
        console.log("!! ERROR IN FUNCTION: noteReturnValid File: src/services/note.service.js UNDER CREATE NOTE");
    }
};

const pushNote = async (note) => {
    // get the category id 
    try{
        const categoryId = await getCategoryId(note.category);

        return await prisma.note.create({
            data: {
                title: note.title,
                content: note.content,
                pinned: note.pinned,
                categoryId: categoryId
            }
        });
    }catch(err){
        console.log("!! ERROR IN FUNCTION: pushNote File: src/services/note.service.js UNDER: CREATE NOTE");
    }
}

//============================== GET CATEGORY =========================
const getCategoryId = async (category) => {
    try {
        const categoryList = await prisma.category.findMany({
            where: {
                name: category
            }
        });
        return categoryList[0]?.id;
    } catch(err){
        console.log("!! ERROR IN FUNCTION: getCategoryId File: src/services/note.service.js UNDER: GET CATEGORY");
    }
};

const getCategory = async (categoryId) => {
    try{
        const categoryList = await prisma.category.findMany({
            where: {
                id: categoryId
            }
        });
        return categoryList[0]; 
    }catch(err){
        console.log("!! ERROR IN FUNCTION: getCategory File: src/services/note.service.js UNDER: GET CATEGORY");
    }
} 

const createCategoryResponse = async (note) => {
    try{
        const category = await getCategory(note.categoryId);
        return {
            icon: category.icon,
            category: category.name,
            noteCount: 1 
        }
    } catch(err) {
        console.log("!! ERROR IN FUNCTION: createCategoryResponse File: src/services/note.service.js UNDER GET CATEGORY"); 
    }
}

const sortCategory = async (categoryList) => {
    try {
        categoryList = await Promise.all(categoryList.map(note => createCategoryResponse(note)));
        let returnList = [];
        for (const category of categoryList){
            let found = false;
            for (let i = 0; i < returnList.length; i++){
                if(category.category === returnList[i].category){
                    returnList[i].noteCount += 1;
                    found = true;
                    break;
                }
            }
            if (!found){
                returnList.push({ ...category});
            }
        }
        return returnList;
    }catch(err){
        console.log("!! ERROR IN FUNCTION: sortCategory File: src/services/note.service.js UNDER GET CATEGORY"); 
    }
}

//============================== DELETING NOTE =========================
//============================== UPDATING NOTE =========================



//============================== GETTING ALL NOTES =========================
const getAllNotes = async () => {
    try{
        let allNotes = await prisma.note.findMany({
            orderBy: {
                id: 'desc'
            }
        });
        return await Promise.all(allNotes.map(note => createNoteResponse(note)));
    }catch(err) {
        console.log("!! ERROR IN FUNCTION: getAllNotes File: src/services/note.service.js UNDER GETTING ALL NOTES");   
    }
}
//============================== CREATE NOTE EVENT =========================
const createNoteEvent = (item, eventType) => {
    try{
        const eventDetails = getEventDetails(item, eventType);
        return {
            eventType: eventDetails.eventType,
            eventId: item.id,
            icon: eventDetails.icon,
            action: eventDetails.action,
            textBody: eventDetails.textBody,
            timestamp: item.createdAt
        }
    }catch(err) {
        console.log("!! ERROR IN FUNCTION: createNoteEvent File: src/services/note.service.js UNDER CREATE NOTE EVENT");
    }
}

//============================== EVENT HELPER =========================
const getEventDetails = (item, eventType) => {
    try{
        switch(eventType){
            case "createNote":
                return { 
                    eventType: eventTypes.NOTE_CREATED,
                    icon: "create",
                    action: "Created " +  '"' + item.title + '"',
                    textBody: "You created a new note"
                }
            case "deleteNote":
                return { 
                    eventType: eventTypes.NOTE_DELETED,
                    icon: "trash",
                    action: "Deleted " +  '"' + item.title + '"',
                    textBody: "You moved a note to trash"
                }
            case "updateNote":
                return { 
                    eventType: eventTypes.NOTE_UPDATED,
                    icon: "edit",
                    action: "Updated " +  '"' + item.title + '"',
                    textBody: "You edited the note"
                }
            case "createCategory":
                return { 
                    eventType: eventTypes.CATEGORY_CREATED,
                    icon: "create",
                    action: "Created " +  '"' + item.name + '"',
                    textBody: "You created a new category"
                }
            case "addToFavourite":
                return { 
                    eventType: eventTypes.NOTE_CREATED,
                    icon: "star",
                    action: "Added to Favorites " +  '"' + item.title + '"',
                    textBody: "You add a note to favourites"
                }
            default: 
            return null;
        }
    } catch(err) {
        console.log("!! ERROR IN FUNCTION: getEventDetails File: src/services/note.service.js UNDER EVENT HELPER");
    }
}

//============================== GETTING ACTIVITIES =========================
const createActivityResponse = (activity) => {
    try {
        return {
            action: activity.action,
            textBody: activity.textBody,
            icon: activity.icon,
            timestamp: formatDate(activity.timestamp)
        }
    }catch (err) {
        console.log("!! ERROR IN FUNCTION: createActivityResponse File: src/services/note.service.js UNDER GETTING ACTIVITIES");
    }
}
const formatActivities = async (activityList) => {
    try {
        return await Promise.all(activityList.map(activity => createActivityResponse(activity)));
    }catch(err){
        console.log("!! ERROR IN FUNCTION: formatActivities File: src/services/note.service.js UNDER GETTING ACTIVITIES");
    }
}
// Exports 
module.exports = {
    //============================== CREATE NOTE =========================
    createNoteResponse,
    ReqValid,
    pushNote,
    //============================== UPDATING NOTE =========================
 
    //============================== DELETING NOTE  =========================

    //============================== GETTING NOTES =========================
    getAllNotes,
    //============================== GETTING ACTIVITIES =========================
    formatActivities,
    //============================== GETTING CATEGORY =========================
    sortCategory
}