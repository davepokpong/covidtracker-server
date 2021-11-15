const express = require("express")
const cors = require("cors")
const { default: axios } = require("axios")

const app = express()
app.use(cors())

const port = process.env.PORT || 4000

const getCovDataThird = async () => {
    let res = await axios.get("https://covid19.ddc.moph.go.th/api/Cases/timeline-cases-all")
    return res.data
}

const getCovDataFirstAndSec = async () => {
    let res = await axios.get("https://covid19.ddc.moph.go.th/api/Cases/round-1to2-all")
    // console.log(res.data)
    return res.data
}

const init = async () => {
    let covFirst = await getCovDataFirstAndSec()
    let covThird = await getCovDataThird()
    // console.log(covFirst)
    // console.log(covThird)

    let arr = covFirst.concat(covThird)
    // console.log(arr)

    let newCase = arr[arr.length-1].new_case - arr[arr.length-2].new_case
    let chkNewCase = ""
    if (newCase < 0) { 
        newCase = newCase*(-1)
        chkNewCase = "neg"
    } else if (newCase === 0){
        chkNewCase = "zero"
    } else {
        chkNewCase = "pos"
    }
    let percentCase = (newCase/(arr[arr.length-2].new_case))*100
    // console.log(newCase)
    // console.log(chkNewCase)

    let newRecov = arr[arr.length-1].new_recovered - arr[arr.length-2].new_recovered
    let chkNewRecov = ""
    if (newRecov < 0) { 
        newRecov = newRecov*(-1)
        chkNewRecov = "neg"
    } else if (newRecov === 0){
        chkNewRecov = "zero"
    } else {
        chkNewRecov = "pos"
    }
    let percentRecov = (newRecov/(arr[arr.length-2].new_recovered))*100
    // console.log(newRecov)
    // console.log(chkNewRecov)

    let newDeath = arr[arr.length-1].new_death - arr[arr.length-2].new_death
    let chkNewDeath = ""
    if (newDeath < 0) { 
        newDeath = newDeath*(-1)
        chkNewDeath = "neg"
    } else if (newDeath === 0){
        chkNewDeath = "zero"
    } else {
        chkNewDeath = "pos"
    }
    let percentDeath = (newDeath/(arr[arr.length-2].new_death))*100
    // console.log(newDeath)
    // console.log(chkNewDeath)

    return [arr, percentCase.toFixed(1), newCase, chkNewCase, percentRecov.toFixed(1), newRecov, chkNewRecov, percentDeath.toFixed(1), newDeath, chkNewDeath]
}

init()

app.get("/", (req, res) => {
    res.send({ exampleMsg: "Hello world" })
})

app.get("/covidall", async (req, res) => {
    let arr = await init()
    res.json({
        data: arr[0],
        percentCase: arr[1],
        newCase: arr[2],
        chkNewCase: arr[3],
        percentRecov: arr[4],
        newRecov: arr[5],
        chkNewRecov: arr[6],
        percentDeath: arr[7],
        newDeath: arr[8],
        chkNewDeath: arr[9]
    })
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})