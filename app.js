const express = require("express");
const argon2 = require("argon2");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req, res) => {
    // res.send("HELLO")
    res.render("index");
})

app.get("/registrer", (req, res) => {
    // res.send("HELLO")
    res.render("registrer");
})

app.post("/", (req, res) => {
    const {email, passord} = req.body;
    console.log(req.body);

    res.send("OK");
})

app.post("/registrer", async (req, res) => {
    const {email, passord, gjentaPassord} = req.body;
    console.log(req.body);

    if(passord === gjentaPassord) {
        const hashtPassord = await argon2.hash(passord);

        console.log(hashtPassord);

        res.send(`email: ${email}, passord ${passord}, gjenta passord: ${gjentaPassord}, kryptert passord: ${hashtPassord}`);   
    } else {
        res.send("Passord og gjenta passord matcher ikke");
    }

})
app.listen(4000);