
function idGenerator() {
    const random = Math.random().toString(32).substring(2);
    const date = Date.now().toString(32);
    const id = random + date;
    return id;
}

module.exports = idGenerator;