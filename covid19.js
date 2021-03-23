var fetch = global.nodemodule['node-fetch'];
var merge = global.nodemodule['merge-images'];
var fs = global.nodemodule['fs'];
var path = global.nodemodule['path'];
var { Canvas, Image } = global.nodemodule['canvas'];
var text2png = global.nodemodule['text2png'];
/*
var rootpatha = path.resolve(__dirname, "..",'nodemodules', 'node_modules', 'luxon', 'src')
const DateTime = require(path.join(rootpatha, 'luxon.js'))
*/
var DateTime = global.nodemodule['luxon']
var waiton = global.nodemodule['wait-on'];
var time = new Date().getTime()

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

var rootpath = path.resolve(__dirname, "..", "covid-data");
ensureExists(rootpath);
ensureExists(path.join(rootpath, "temp"));
ensureExists(path.join(rootpath, "images"));
ensureExists(path.join(rootpath, "font"));

var nameMapping = {
    "gradient": path.join(rootpath, "images", 'gradient.png'),
    "arial": path.join(rootpath, 'font', 'arial.ttf'),
    "flag": path.join(rootpath, 'images', 'flag.png')
}

for (var n in nameMapping) {
    if (!fs.existsSync(nameMapping[n])) {
        fs.writeFileSync(nameMapping[n], global.fileMap[n]);
    }
}

var covid19 = async function (type, data) {
    if (!fs.existsSync(path.join(rootpath, "images", 'gradient.png'))) {
        var img = 'https://raw.githubusercontent.com/CuSO4-c3c/covid-plugins-for-c3cbot-0.x/main/images/gradient.png'
        var gradientc = await fetch(img)
        var gradientc = await gradientc.buffer()
        fs.writeFileSync(path.join(rootpath, "images", 'gradient.png'), gradientc)
    }
    if (!fs.existsSync(path.join(rootpath, 'font', 'arial.ttf'))) {
        var font = 'https://raw.githubusercontent.com/CuSO4-c3c/covid-plugins-for-c3cbot-0.x/main/font/arial.ttf'
        var fontc = await fetch(font)
        var fontc = await fontc.buffer()
        fs.writeFileSync(path.join(rootpath, 'font', 'arial.ttf'), fontc)
    }
    if (!fs.existsSync(path.join(rootpath, "images", 'flag.png'))) {
        var fimg = 'https://raw.githubusercontent.com/CuSO4-c3c/covid-plugins-for-c3cbot-0.x/main/images/flag.png'
        var fimgc = await fetch(fimg)
        var fimgc = await fimgc.buffer()
        fs.writeFileSync(path.join(rootpath, "images", 'flag.png'), fimgc)
    }
    var dt = Date(time)
    console.log(dt)
    var cdt = dt.toString()
    var d = cdt.slice(8,10)
    var mt = cdt.slice(4,7)
    switch(mt) {
        case 'Jan': {var m = '01'}  break;
        case 'Feb': {var m = '02'}  break;
        case 'Mar': {var m = '03'}  break;
        case 'Apr': {var m = '04'}  break;
        case 'May': {var m = '05'}  break;
        case 'Jun': {var m = '06'}  break;
        case 'Jul': {var m = '07'}  break;
        case 'Aug': {var m = '08'}  break;
        case 'Sep': {var m = '09'}  break;
        case 'Oct': {var m = '10'}  break;
        case 'Nov': {var m = '11'}  break;
        case 'Dec': {var m = '12'}  break;
    }
    var y = cdt.slice(11,15)
    var t = cdt.slice(16,21)
    var tz = `(${cdt.slice(25,31)})`
    var ccdt = d + '/' + m + '/' + y + ' | ' + t +` ${tz}`
    var infimg = 'inf_' + Date.now() + '.png'
    var trtimg = 'trt_' + Date.now() + '.png'
    var recimg = 'rec_' + Date.now() + '.png'
    var decimg = 'dec_' + Date.now() + '.png'
    var succ = 'succ_' + Date.now() + '.png'
    var api = 'https://api.apify.com/v2/key-value-stores/EaCBL1JNntjR3EakU/records/LATEST?disableRedirect=true'
    var datas = await fetch(api);
    var str = await datas.text()
    var jdata = await JSON.parse(str);
    var inf = jdata.infected;
    var trt = jdata.treated;
    var rec = jdata.recovered;
    var dec = jdata.deceased;
    await fs.writeFileSync(path.join(rootpath, 'temp', 'vn.png'), text2png('VIETNAM', {
        color: '#ffffff',
        font: '50px Arial',
        localFontPath: path.join(rootpath, 'font', 'arial.ttf'),
        localFontName: 'Arial'
    }));
    await fs.writeFileSync(path.join(rootpath, 'temp', 'ex.png'), text2png('COVID-19 STATS', {
        color: '#ffffff',
        font: '27px Arial',
        localFontPath: path.join(rootpath, 'font', 'arial.ttf'),
        localFontName: 'Arial'
    }));
    await fs.writeFileSync(path.join(rootpath, 'temp', infimg), text2png(`${inf}\nCASES`, {
        color: '#ffffff',
        font: '50px Arial',
        localFontPath: path.join(rootpath, 'font', 'arial.ttf'),
        localFontName: 'Arial',
        lineSpacing: 6
    }));
    await fs.writeFileSync(path.join(rootpath, 'temp', trtimg), text2png(`${trt}\nBEING TREATEDS`, {
        color: '#ffffff',
        font: '50px Arial',
        localFontPath: path.join(rootpath, 'font', 'arial.ttf'),
        localFontName: 'Arial',
        lineSpacing: 6
    }));
    await fs.writeFileSync(path.join(rootpath, 'temp', recimg), text2png(`${rec}\nRECOVERED`, {
        color: '#ffffff',
        font: '50px Arial',
        localFontPath: path.join(rootpath, 'font', 'arial.ttf'),
        localFontName: 'Arial',
        lineSpacing: 6
    }));
    await fs.writeFileSync(path.join(rootpath, 'temp', decimg), text2png(`${dec}\nDEATHS`, {
        color: '#ffffff',
        font: '50px Arial',
        localFontPath: path.join(rootpath, 'font', 'arial.ttf'),
        localFontName: 'Arial',
        lineSpacing: 6
    }));
    await fs.writeFileSync(path.join(rootpath, 'temp', 'date.png'), text2png(`NGUỒN: HTTPS://NCOV.MOH.GOV.VN \nTHỜI GIAN: ${ccdt}`, {
        color: '#ffffff',
        font: '20px Arial',
        localFontPath: path.join(rootpath, 'font', 'arial.ttf'),
        localFontName: 'Arial',
        lineSpacing: 3
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
    }).then(function () {
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
                y: 75
            },
            {
                src: path.join(rootpath, 'temp', 'date.png'),
                x: 831,
                y: 39
            },
            {
                src: path.join(rootpath, 'images', 'flag.png'),
                x: 274,
                y: 33
            },
            {
                src: path.join(rootpath, 'temp', infimg),
                x: 209,
                y: 267
            },
            {
                src: path.join(rootpath, 'temp', recimg),
                x: 209,
                y: 463
            },
            {
                src: path.join(rootpath, 'temp', trtimg),
                x: 688,
                y: 267
            },
            {
                src: path.join(rootpath, 'temp', decimg),
                x: 688,
                y: 463
            }], {
            Canvas: Canvas,
            Image: Image
        }).then(function (res) {
            fs.writeFile(
                path.join(rootpath, "temp", succ),
                res.replace(/^data:image\/png;base64,/, ""),
                'base64',
                function (err) {

                    if (err) data.log(err);

                    var img = fs.createReadStream(path.join(rootpath, "temp", succ));

                    data.return({
                        handler: "internal",
                        data: {
                            body: "",
                            attachment: ([img])
                        }
                    });
                    img.on("close", () => {
                        try {
                            fs.unlinkSync(path.join(rootpath, "temp", decimg));
                            fs.unlinkSync(path.join(rootpath, "temp", trtimg));
                            fs.unlinkSync(path.join(rootpath, "temp", recimg));
                            fs.unlinkSync(path.join(rootpath, "temp", infimg));
                            fs.unlinkSync(path.join(rootpath, "temp", succ));
                            fs.unlinkSync(path.join(rootpath, "temp", 'vn.png'));
                            fs.unlinkSync(path.join(rootpath, "temp", 'ex.png'));
                            fs.unlinkSync(path.join(rootpath, "temp", 'date.png'));
                        } catch (err) { }
                    })
                });
        })
    })
}

module.exports = {
    covid19: covid19
}