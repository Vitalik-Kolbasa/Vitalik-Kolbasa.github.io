const http = require("node:http"), fs = require("node:fs"), path = require("node:path")
let htmlPath = "./main.html", mediaDir = "./media/", storage = {}


storage["html"] = fs.readFileSync(htmlPath, "utf-8")
fs.watch(htmlPath, function(type, fileName) {
  console.log(`${type}: ${fileName}`)
  if (type == "rename") { return }
  storage["html"] = fs.readFileSync(htmlPath, "utf-8")
})

fs.readdirSync(mediaDir).forEach(function(fileName) {
  storage[fileName] = fs.readFileSync(mediaDir + fileName)
})

fs.watch("./media/", {recursive: false}, function(type, fileName) {
  console.log(`${type}: ${fileName}`)
  if (type == "rename" || !fileName.includes(".")) { return }
  storage[fileName] = fs.readFileSync(mediaDir + fileName)
})

 
const server = http.createServer(function(req, res) {
  console.log(`Connect: ${req.url}`)
  switch (req.url) {
    case "/":
      res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"})
      res.end(storage["html"])
    break;

    case "/avatar.png":
    case "/favicon.ico":
      res.writeHead(200, {"Content-Type": "image/png"})
      res.end(storage["avatar.png"])
    break;

    default:
      if (req.url.startsWith("/media/")) {
        let file = req.url.split("/media/")[1]
        if (Object.keys(storage).includes(file))
        res.writeHead(200, {"Content-Type": getContentType(file)})
        res.end(storage[file])
      } else {
        //res.writeHead(404, {"Content-Type": "text/html; charset=utf-8"})
        //res.end("<body style=\"background-color: #333\"><div style=\"position: absolute; text-align: center;color: #ddd;height:2cm;font-size: 1cm;\">Иди НАХУЙ!</div><video width=\"640\" height=\"360\" style=\"height: 100%;width: 100%;\" controls><source src=\"https://derpicdn.net/img/view/2020/7/8/2393868.webm\" type=\"video/webm\"></video></body>")
      }
    break;
  }
})


function getContentType(fileName) {
  return {
    ".html": "text/html; charset=utf-8",
    ".css":  "text/css; charset=utf-8",
    ".js":   "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png":  "image/png",
    ".jpg":  "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif":  "image/gif",
    ".svg":  "image/svg+xml",
    ".ico":  "image/x-icon",
    ".txt":  "text/plain; charset=utf-8"
  }[path.extname(fileName).toLowerCase()] || "application/octet-stream"
}

//Детбот ПИСЬКА!!!
//Детбот Тебе подорить вторую письку?
//тебе подарить набор для bds?
//? А то у меня есть лишний
// жду писи в лс от обоих!

server.listen(8080, "localhost", function() {
  console.log("Listen: http://localhost:8080/")
})
