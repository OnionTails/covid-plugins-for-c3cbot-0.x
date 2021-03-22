var fetch = global.nodemodule['node-fetch'];
var merge = global.nodemodule['merge-images'];
var fs = global.nodemodules['fs'];
var path = global.nodemodules['path'];

function ensureExists(path, mask) {
    if (typeof mask != "number") {
        mask = 0o777;
    }
    try {
        fs.mkdirSync(path, {
            mode: mask,
            recursive: true
        });
        return undefined;
    } catch (ex) {
        return { err: ex };
    }
}

var rootpath = path.resolve(__dirname, "..", "markgei-data");
ensureExists(rootpath);
ensureExists(path.join(rootpath, "temp"));
ensureExists(path.join(rootpath, "images"));
ensureExists(path.join(rootpath, "fonts"))

fs.writeFileSync(path.join(rootpath, "images", 'gradient.png'), )

var nameMapping = {
    "gradient": path.join(rootpath, "images", 'gradient.png'),
    "esl": path.join(rootpath, 'font', 'esl.ttf')
} 

for (var n in nameMapping) {
    if (!fs.existsSync(nameMapping[n])) {
        fs.writeFileSync(nameMapping[n], global.fileMap[n]);
    }
}

var covid19 = async function(type, data) {
    var api = 'https://api.apify.com/v2/key-value-stores/EaCBL1JNntjR3EakU/records/LATEST?disableRedirect=true'
    var data = await fetch(api);
    var str = await data.text() 
    var jdata = await JSON.parse(str);
    var inf = jdata.infected;
    var trt = jdata.treated;
    var rec = jdata.recovered;
    var dec = jdata.deceased;
}

module.exports = {
    covid19: covid19
}