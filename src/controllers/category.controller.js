const prisma = require('../prisma/client');
const { getCategory } = require('../services/note.service');
const createCategoryResponse = async (note) => {
    const category = await getCategory(note.categoryId);
    return {
        icon: category.icon,
        category: category.name,
        noteCount: 1 
    }

}
const sortCategory = (categoryList) => {
    let returnList = [];
    for (const category of categoryList){
        console.log(category);
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
}
const getCategories = async (req, res) => {
    const notes = await prisma.note.findMany({
        orderBy: {
            id: 'desc'
        }
    });
    const formatedCategory = await Promise.all(notes.map(note => createCategoryResponse(note)))
    res.json({categories: await sortCategory(formatedCategory)});
    
}

module.exports = {
    getCategories
}