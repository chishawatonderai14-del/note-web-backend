const prisma = require('../prisma/client');

//============================== TIME FORMATING =========================
const formatDate =  (date) => {
    console.log(date)
    let d = new Date(date).toISOString().slice(0, 16);
    let time = d.slice(11,16);
    let day = parseInt(d.slice(8,10));
    let month = parseInt(d.slice(5,7));
    month = getMonth(month);
    let year = parseInt(d.slice(0,4));
    d = time + "T" +month + " " + day + ", " + year;
    return d;
}
const getMonth = (num) => {
    if (num >= 1 && num <= 12){
        switch(num) {
            case 1:
                return "Jan";
            case 2:
                return "Feb";
            case 3:
                return "Mar";
            case 4:
                return "Apr";
            case 5:
                return "May";
            case 6:
                return "Jun";
            case 7:
                return "Jul";
            case 8:
                return "Aug";
            case 9:
                return "Sep";
            case 10:
                return "Oct";
            case 11:
                return "Nov";
            case 12:
                return "Dec";
        }
    }else {
        console.log("!!INVAID MONTH!!");
    }
}
module.exports = {
    formatDate
}