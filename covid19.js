var fetch = global.nodemodule['node-fetch'];
var merge = global.nodemodule['merge-images'];
var fs = global.nodemodule['fs'];
var path = global.nodemodule['path'];
var {Canvas , Image} = global.nodemodule['canvas'];
var text2png = global.nodemodule['text2png'];
var datetime = global.nodemodule['luxon'];
var waiton = global.nodemodule['wait-on']
var time = new Date()

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
ensureExists(path.join(rootpath, "font"));

var img = 'https://raw.githubusercontent.com/CuSO4-c3c/covid-plugins-for-c3cbot-0.x/main/images/gradient.png'
var gradientc = await fetch(img)
await fs.writeFileSync(path.join(rootpath, "images", 'gradient.png'), gradientc)
var font = 'https://raw.githubusercontent.com/CuSO4-c3c/covid-plugins-for-c3cbot-0.x/main/font/esl.ttf'
var fontc = await fetch(font)
await fs.writeFileSync(path.join(rootpath, 'font', 'esl.ttf'), fontc)
var fimg = 'https://raw.githubusercontent.com/CuSO4-c3c/covid-plugins-for-c3cbot-0.x/main/images/flag.png'
var fimgc = await fetch(fimg)
fs.writeFileSync(path.join(rootpath, "images", 'flag.png'), fimgc)

var nameMapping = {
    "gradient": path.join(rootpath, "images", 'gradient.png'),
    "esl": path.join(rootpath, 'font', 'esl.ttf'),
    "flag": path.join(rootpath, 'images', 'flag.png')
} 

for (var n in nameMapping) {
    if (!fs.existsSync(nameMapping[n])) {
        fs.writeFileSync(nameMapping[n], global.fileMap[n]);
    }
}

var covid19 = async function(type, data) {
    var dt = datetime.now()
    var d = dt.day()
    var m = dt.month()
    var y = dt.year()
    var h = dt.hour()
    var mi = dt.minute()
    var cdt = d + '/' + m + '/' + y + ' | ' + h + ':' + mi
    var infimg = 'inf_' + Date.now() + '.png'
    var trtimg = 'trt_' + Date.now() + '.png'
    var recimg = 'rec_' + Date.now() + '.png'
    var decimg = 'dec_' + Date.now() + '.png'
    var succ = 'succ_' + Date.now() + '.png'
    var api = 'https://api.apify.com/v2/key-value-stores/EaCBL1JNntjR3EakU/records/LATEST?disableRedirect=true'
    var data = await fetch(api);
    var str = await data.text() 
    var jdata = await JSON.parse(str);
    var inf = jdata.infected;
    var trt = jdata.treated;
    var rec = jdata.recovered;
    var dec = jdata.deceased;
    fs.writeFileSync(path.join(rootpath, 'temp', 'vn.png'),text2png('VIETNAM', {
        color: '#ffffff',
        font: '46px ESLUnicode',
        localFontPath: path.join(rootpath, 'font', 'esl.ttf'),
        localFontName: 'ESLUnicode'
    }));
    fs.writeFileSync(path.join(rootpath, 'temp', 'ex.png'),text2png('COVID-19 STATS', {
        color: '#ffffff',
        font: '42px ESLUnicode',
        localFontPath: path.join(rootpath, 'font', 'esl.ttf'),
        localFontName: 'ESLUnicode'
    }));
    fs.writeFileSync(path.join(rootpath, 'temp', infimg),text2png(`${inf}\nCASES`, {
        color: '#ffffff',
        font: '44px ESLUnicode',
        localFontPath: path.join(rootpath, 'font', 'esl.ttf'),
        localFontName: 'ESLUnicode',
        lineSpacing: '6'
    }));
    fs.writeFileSync(path.join(rootpath, 'temp', trtimg),text2png(`${trt}\nBEING TREATEDs`, {
        color: '#ffffff',
        font: '44px ESLUnicode',
        localFontPath: path.join(rootpath, 'font', 'esl.ttf'),
        localFontName: 'ESLUnicode',
        lineSpacing: '6'
    }));
    fs.writeFileSync(path.join(rootpath, 'temp', recimg),text2png(`${rec}\nRECOVERED`, {
        color: '#ffffff',
        font: '44px ESLUnicode',
        localFontPath: path.join(rootpath, 'font', 'esl.ttf'),
        localFontName: 'ESLUnicode',
        lineSpacing: '6'
    }));
    fs.writeFileSync(path.join(rootpath, 'temp', decimg),text2png(`${dec}\nDEATHS`, {
        color: '#ffffff',
        font: '44px ESLUnicode',
        localFontPath: path.join(rootpath, 'font', 'esl.ttf'),
        localFontName: 'ESLUnicode',
        lineSpacing: '6'
    }));
    fs.writeFileSync(path.join(rootpath, 'temp', 'date.png'),text2png(`NGUỒN: HTTPS://NCOV.MOH.GOV.VN \n THỜI GIAN: ${cdt}`, {
        color: '#ffffff',
        font: '17px ESLUnicode',
        localFontPath: path.join(rootpath, 'font', 'esl.ttf'),
        localFontName: 'ESLUnicode',
        lineSpacing: '15'
    }));
    waiton({
        resources: [
            path.join(rootpath, 'temp', infimg),
            path.join(rootpath, 'temp', trtimg),
            path.join(rootpath, 'temp', recimg),
            path.join(rootpath, 'temp', decimg),
            path.join(rootpath, 'temp', 'vn.png'),
            path.join(rootpath, 'temp', 'ex.png'),
            path.join(rootpath, 'temp', 'date.png'),
        ],
        timeout: 7000
    }).then(function(){
        merge([
            {
                src: path.join(rootpath, 'images', 'gradient.png'),
            },
            {
                src: path.join(rootpath, 'temp', 'vn.png'),
                x: 41,
                y: 33
            },
            {
                src: path.join(rootpath, 'temp', 'ex.png'),
                x: 41,
                y: 87
            },
            {
                src: path.join(rootpath, 'temp', 'date.png'),
                x: 941,
                y: 39
            },
            {
                src: path.join(rootpath, 'images', 'flag.png'),
                x: 234,
                y: 34
            },
            {
                src: path.join(rootpath, 'temp', infimg),
                x: 269,
                y: 267
            },
            {
                src: path.join(rootpath, 'temp', recimg),
                x: 269,
                y: 433
            }, 
            {
                src: path.join(rootpath, 'temp', trtimg),
                x: 768,
                y: 267
            },
            {
                src: path.join(rootpath, 'temp', decimg),
                x: 768,
                y: 433
            }],{
                Canvas: Canvas,
                Image: Image
            }).then(function(res){
            fs.writeFile(
                path.join(rootpath, "temp", succ), 
                res.replace(/^data:image\/png;base64,/, ""), 
                'base64', 
                function (err) {
                    
                if (err) data.log(err);
                
                    var img = fs.createReadStream(path.join(rootpath, "temp", succ));
                    
                    data.return({
                        handler: "internal-raw",
                        data: {
                            body: "",
                            attachment: ([img])
                        }
                    });
                    img.on("close", () => {
                    try {
                    fs.unlinkSync(path.join(rootpath, "temp"));
                    } catch (err) {}
                    })
            });
        })
    })
}

module.exports = {
    covid19: covid19
}