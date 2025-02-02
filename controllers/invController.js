const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/**
 * Build inventory by classification view
 */

invCont.buildByClassificationId = async function(req, res, next) {
    const classification_id = req.params.classificationId 
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid
    })
}



invCont.buildByDetailInventoryId = async function(req, res, next) {
    const inv_id = req.params.inventoryId
    const data = await invModel.getInventoryByInventoryId(inv_id)
    console.log(data)
    const detail = await utilities.buildDetail(data)
    let nav = await utilities.getNav();
    const titleDetail = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`

    res.render("./inventory/detail", {
        title: titleDetail,
        nav,
        detail
    })
}

invCont.buildManagement = async function(req, res, next) {
    let nav = await utilities.getNav()

    console.log("Inside Build Management")

    res.render("./inventory/management", {
        title: "Management",
        nav,
    })
}

invCont.buildAddClassification = async function(req, res, next) {
    let nav = await utilities.getNav()

    console.log("Inside Build Add Classification")

    res.render("./inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null,
    })
}


invCont.processAddClassification = async function(req, res) {
    const { classification_name } = req.body 
    console.log("Classification Name: " + classification_name)

    let nav = await utilities.getNav()

    try {

        const classObj = await invModel.getClassifications()
        const getClasses = classObj.rows.map((x) => x.classification_name)
        console.log(getClasses)
        console.log(getClasses.includes(classification_name))

        if (!getClasses.includes(classification_name)) {

            const insertClass = invModel.insertClassificationName(classification_name)
            console.log("INSIDE GET CLASS OK OK")
            console.log("iNSERTED CLASS", insertClass)
            console.log("INSIDE GET CLASSES OK OK")

            nav = await utilities.getNav()

            req.flash(
                "notice", `The ${classification_name} Classification Name was added.`
            )
        
            res.render("./inventory/management",  {
                title: "Management",
                nav,
            })

        } else {
            req.flash(
                "notice", 
                "The classification name is already present. Try another name."
            )
            res.render("./inventory/add-classification", {
                title: "Add Classification",
                nav,
                errors: null,
            })
    
        }

    } catch (error) {

        req.flash(
            "notice", 
            "The classification name wasn't registered. Try another name."
        )
        res.render("./inventory/add-classification", {
            title: "Add Classification",
            nav,
            errors: null,
        })

    }
}



module.exports = invCont