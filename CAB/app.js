const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const qs = require('querystring');
const passenger = require('./data/passenger');
const HandleBars = require('handlebars');

// registerPartials();

const server = http.createServer(function (req, res) {
    const link = url.parse(req.url, true);
    const query = link.query;
    const page = link.pathname;

    if (page == "/") {
        passenger.getAll((err, result) => {
            let context = { data: result }
            let t = renderTemplate('home', context);
            console.log(context);
            res.end(t);
        });
    }
    else if (page == "/passenger/register" && req.method == "GET") {
        let template = renderTemplate('register', {});
        res.end(template)
    }
    else if (page == "/passenger/register" && req.method == "POST") {
        let formData = '';
        req.on('data', function (data) {
            formData += data.toString();
        });
        req.on('end', function () {
            let userData = qs.parse(formData);
            passenger.addOne(userData.name, userData.email, userData.phone, (err, result) => {
                var context = {
                    result: {
                        success: true,
                        errors: []
                    }
                };
                if (err) {
                    console.log(err)
                    context.result.success = false;
                }
                let t = renderTemplate('register', context);
                res.end(t);
            });
        })
    }
    else if (page == "/passenger/login") {
        let template = renderTemplate('login', {});
        res.end(template)
    }
    else if (page == "/passenger/booking") {
        let template = renderTemplate('booking', {});
        res.end(template)
    }
});
server.listen(80)

function renderTemplate(name, data) {
    var filePath = path.join(__dirname, "templates", name + ".hbs");
    let templateText = fs.readFileSync(filePath, "utf-8");
    let template = HandleBars.compile(templateText);
    return template(data);
}

// function registerPartials(){
//     var filePath = path.join(__dirname, "templates", "partials", "navbar.hbs");
//     let templateText = fs.readFileSync(filePath, "utf-8");
//     HandleBars.registerPartial("navbar",templateText);

// }
