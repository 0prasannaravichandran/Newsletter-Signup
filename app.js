const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));

app.listen(process.env.PORT||3000, function () {
  console.log("The server is running on port 3000");
});

app.get("/", function (req,res) {
  res.sendFile(__dirname+"/signup.html");
});

app.post("/", function (req,res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const emailAddress = req.body.emailAddress;

  const data = {
    members: [
      {
        email_address: emailAddress,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us6.api.mailchimp.com/3.0/lists/b38c8c94c7";
  const options = {
    method: "POST",
    auth: "prasanna:f9d86d8475a5ed2e4c1e38be31ca7aab-us6"
  };

  const request = https.request(url, options, function (response) {
    response.on("data", function(data) {

      if (response.statusCode === 200) {
        res.sendFile(__dirname+"/success.html");
      } else {
        res.sendFile(__dirname+"/failure.html");
      }
    });
  });

  request.write(jsonData);
  request.end();

});

app.post("/failure", function (req,res) {
  res.redirect("/");
});

// Mailchimp api-key
// f9d86d8475a5ed2e4c1e38be31ca7aab-us6

//Audience ID: b38c8c94c7
