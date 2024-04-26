const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const methodOverride = require("method-override")

const app = express()

async function main() {
    await mongoose.connect("mongodb://localhost:27017/todoDB")
}
main().then(()=>{
    console.log("mongodb start")
}).catch((err)=>{
    console.log(err)
})
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static("public"))
app.use(methodOverride("_method"))

const itemSchema = new mongoose.Schema({
    name: String
})
const itemCollection = mongoose.model("todoList", itemSchema)

app.get("/", async(req, res)=> {
    let today = new Date()
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }
    let day = today.toLocaleDateString("en-US", options)
    let allData = await itemCollection.find({})
    res.render("index.ejs",{todayTime:day,newItem:allData})
})

app.post("/edit", function (req, res) {
    const info = req.body.newItems
    const item = new itemCollection({
        name: info
    })
    item.save()
    res.redirect("/")
})

app.delete("/delete/:id",async(req,res)=>{
    let {id} = req.params
    let delItem = await itemCollection.findByIdAndDelete(id)
    res.redirect("/")
})

app.get("/update/:id",async(req,res)=>{
    let {id} = req.params
    let findData = await itemCollection.findById(id)
    res.render("new.ejs",{findData})
})
app.put("/update/:id",async(req,res)=>{
    let {id} = req.params
    let updateData = req.body.newItems
    let updated = await itemCollection.findByIdAndUpdate(id,{name:updateData})
    res.redirect("/")
})
app.get("/cancel",(req,res)=>{
    res.redirect("/")
})

app.listen(3000, function () {
    console.log("your server was live at port number 3000")
})
