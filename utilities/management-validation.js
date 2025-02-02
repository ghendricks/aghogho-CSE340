const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const accountModel = require("../models/inventory-model")

/**
 * Classification name validation rule
 */
validate.addClassRules = () => {
    return [
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .matches(/^[a-zA-Z0-9]+$/)
            .withMessage("Classification name must not contain spaces or special characters."),
    ]
}

validate.checkClassData = async (req, res, next) => {
    const { classification_name } = req.body

    let errors = []
    errors = validationResult(req)

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
            classification_name,
        })
        return
    }
    next()
}

module.exports = validate