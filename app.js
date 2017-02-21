/*eslint-env node, express*/

var port = process.env.PORT || 7700;;
var express = require("express");

var app = express();

var appConfig = require("./config"),
    nconf = require("nconf");

// configure logging, configuration, i18n early
appConfig.init();

var migratingProject;

function resetMonitoring() {
    migratingProject = "";
}

function beginMonitoring(project) {
     // cleanup if we're re-setting the monitoring
    if (migratingProject) {
        resetMonitoring();
    }
    migratingProject = project;
}


app.get("/",
    function (req, res) {
        var welcomeResponse = "<HEAD>" +
            "<title>Sample Node Form</title>\n" +
            "</HEAD>\n" +
            "<BODY>\n" +
            "<P>\n" +
            "Hello! Welcome to the Sample Node Form<br>\n" + 
            "What is your favorite word today?\n" +
            "</P>\n" +
            "<FORM action=\"/monitor\" method=\"get\">\n" +
            "<P>\n" +
            "<INPUT type=\"text\" name=\"project\"><br><br>\n" +
            "<INPUT type=\"submit\" value=\"Go\">\n" +
            "</P>\n" + "</FORM>\n" + "</BODY>";
        if (!migratingProject) {
            res.send(welcomeResponse);
        } else {
            var monitoringResponse = "<HEAD>" +
                "<META http-equiv=\"refresh\" content=\"5; URL=http://" +
                req.headers.host +
                "/\">\n" +
                "<title>Sample Node Form</title>\n" +
                "</HEAD>\n" +
                "<BODY>\n" +
                "<P>\n" +
                "You said ...<br>\n" +
                migratingProject + "<br>" +
                "</P>\n" +
                "<A href=\"/reset\">Go Back</A>\n" +
                "</BODY>";
            res.send(monitoringResponse);
        }
    });


app.get("/monitor", function (req, res) {
    beginMonitoring(req.query.project);
    res.redirect(302, "/");
});

app.get("/reset", /* @callback */ function (req, res) {
    resetMonitoring();
    res.redirect(302, "/");
});

app.get("/test", /* @callback */ function (req, res) {
    res.send(req.query);
});

app.get("/env", /* @callback */ function (req, res) {
	var myResponse = "<HEAD>" +
            "<title>Migration App</title>\n" +
            "</HEAD>\n" +
            "<BODY>\n" +
            "<P>\n" +
            "Hello! Welcome to the Migration app.<br>\n";
	if (req.query && req.query.var) {
            myResponse += "Value of " + req.query.var + " is " + nconf.get(req.query.var) + "\n";
	} else {
            myResponse += "Value of FOO_BAR is " + nconf.get("FOO_BAR") + "\n";
	}
        myResponse += "</P>\n" + "</BODY>";

	res.send(myResponse);
});

app.listen(port);
console.log("Server listening on port " + port);
