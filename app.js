const express = require("express");
const argon2 = require("argon2");
const mongodb = require("mongoose");

const User = require("./models/User");
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

mongodb.connect("mongodb://localhost:27017/ejs");

app.get("/", (req, res) => {
    // res.send("HELLO")
    res.render("index");
})

app.get("/registrer", (req, res) => {
    // res.send("HELLO")
    res.render("registrer");
})

app.get("/velkommen", (req, res) => {
    // res.send("HELLO")
    res.render("velkommen");
})

app.post("/", async (req, res) => {
    const {email, passord} = req.body;
    console.log(req.body);

    const user = await User.findOne({email});
    console.log(user);

    if (!user) {
        res.send("Bruker eksisterer ikke i databasen");
    }

    const isMatch = await argon2.verify(user.passord, passord);
    console.log(isMatch);

    if (isMatch) {
        res.redirect("/velkommen");
    }

    // res.send("OK");
})

app.post("/registrer", async (req, res) => {
    const {navn, email, passord, gjentaPassord} = req.body;
    console.log(req.body);

    if(passord === gjentaPassord) {
        const hashtPassord = await argon2.hash(passord);

        console.log(hashtPassord);

        const user = new User({
            navn: navn,
            email: email,
            passord: hashtPassord
        });

        await user.save();

        res.redirect("/");
        // res.send(`email: ${email}, passord ${passord}, gjenta passord: ${gjentaPassord}, kryptert passord: ${hashtPassord}`);   
    } else {
        res.send("Passord og gjenta passord matcher ikke");
    }

})
app.listen(4000);