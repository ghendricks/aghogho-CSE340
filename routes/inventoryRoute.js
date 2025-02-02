const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const classValidate = require("../utilities/management-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route by delivery detail and classification id
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByDetailInventoryId));

// Route to get inventory management view
router.get("/management", utilities.handleErrors(invController.buildManagement))

// Router to get add-inventory view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))

router.post("/add-classification", 
    classValidate.addClassRules(),
    classValidate.checkClassData,
    utilities.handleErrors(invController.processAddClassification)
)

module.exports = router;