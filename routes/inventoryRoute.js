const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route by delivery detail and classification id
router.get("/detail/:inventoryId", invController.buildByDetailInventoryId);

module.exports = router;