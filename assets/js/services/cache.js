const cache = {};

//fonction cache qui permet de mettre en cache les données utilisé reguliérement
function set(key, data){
    cache[key] = {
        data: data,
        cachedAt: new Date().getTime(),

    }
}

function get(key){
    return new Promise((resolve, reject) => {
        resolve(cache[key] && cache[key].cachedAt + 15*60*1000 > new Date().getTime() ? cache[key].data : null);
})

}

export default {
    set,
    get
}