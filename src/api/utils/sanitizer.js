// sanitizer removes unused fields from data
const sanitizer = (item, fieldsToSend) => {
    return Object.keys(item).forEach(key => {
        if (fieldsToSend.indexOf(key) === -1) delete item[key];
    });
};

export default sanitizer;