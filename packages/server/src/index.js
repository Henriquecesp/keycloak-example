const Keycloak = require("keycloak-connect");
const hogan = require("hogan-express");
const express = require("express");
const session = require("express-session");

console.log("foi");

const app = express();

const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

app.listen(PORT, HOST);

console.log("Example app listening at http://%s:%s", HOST, PORT);

// Register '.mustache' extension with The Mustache Express
app.set("view engine", "html");
app.set("views", require("path").join(__dirname, "../view"));
app.engine("html", hogan);

// A normal un-protected public URL.

app.get("/", function (req, res) {
  res.render("index");
});

// Create a session-store to be used by both the express-session
// middleware and the keycloak middleware.

const memoryStore = new session.MemoryStore();

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
  })
);

// Provide the session store to the Keycloak so that sessions
// can be invalidated from the Keycloak console callback.
//
// Additional configuration is read from keycloak.json file
// installed from the Keycloak web console.

const keycloak = new Keycloak({
  store: memoryStore,
});

// Install the Keycloak middleware.
//
// Specifies that the user-accessible application URL to
// logout should be mounted at /logout
//
// Specifies that Keycloak console callbacks should target the
// root URL.  Various permutations, such as /k_logout will ultimately
// be appended to the admin URL.

app.use(
  keycloak.middleware({
    logout: "/logout",
    admin: "/",
    protected: "/protected/resource",
  })
);

app.get("/login", keycloak.protect(), function (req, res) {
  res.render("index", {
    result: JSON.stringify(JSON.parse(req.session["keycloak-token"]), null, 4),
    event: "1. Authentication\n2. Login",
  });
});

app.get(
  "/protected/resource",
  keycloak.enforcer(["resource:view", "resource:write"], {
    resource_server_id: "nodejs-apiserver",
  }),
  function (req, res) {
    res.render("index", {
      result: JSON.stringify(
        JSON.parse(req.session["keycloak-token"]),
        null,
        4
      ),
      event: "1. Access granted to Default Resource\n",
    });
  }
);
