const prisma = require('../prisma/client');
const {
    formatDate
} = require('../utils/noteHelper');
//============================== Creating Note =========================
const createNoteResponse = async (data) => {
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
    console.log(response);
    return response;
};
const getCategoryId = async (category) => {
    const categoryList = await prisma.category.findMany({
        where: {
            name: category
        }
    });
    return categoryList[0]?.id;
};
const getCategory = async (categoryId) => {
    const categoryList = await prisma.category.findMany({
        where: {
            id: categoryId
        }
    });
    return categoryList[0];
}
const ReqValid = (note) => {
    if (!note.title || !note.content || !note.category) {
        return false;
    }else {
        return true
    }
};
const noteReturnValid = async (note) => {
    if (!note){
        return false;
    }else {
        return true;
    }
};
const pushNote = async (note) => {
    // get the category id 
    const categoryId = await getCategoryId(note.category);

    return await prisma.note.create({
        data: {
            title: note.title,
            content: note.content,
            pinned: note.pinned,
            categoryId: categoryId
        }
    });
}

//============================== Deleting Note =========================


//============================== Updating Note =========================



//============================== Getting Notes =========================
const getAllNotes = async () => {
    let allNotes = await prisma.note.findMany({
        orderBy: {
            id: 'desc'
        }
    });
    return await Promise.all(allNotes.map(note => createNoteResponse(note)));
}
// Exports 
module.exports = {
    //============================== Creating Note =========================
    createNoteResponse,
    ReqValid,
    pushNote,
    //============================== Updating Note =========================

    //============================== Deleting Note =========================

    //============================== Getting Notes =========================
    getAllNotes,
    // export for category service
    getCategory
}