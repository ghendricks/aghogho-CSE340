const invModel = require("../models/inventory-model")
const accountModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()


const Util = {}

/**
 * Construct the nav HTML unordered list
 */

Util.getNav = async function(req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list += 
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name + 
            ' vehichles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}

/**
 * Build the classification view HTML
 */

Util.buildClassificationGrid = async function(data) {
    let grid
    if (data.length > 0) {
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id
            + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
            + 'details"><img src="' + vehicle.inv_thumbnail
            + '"alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model 
            + ' on CSE Motors" /></a>'
            grid += '<div class="namePrice">'
            grid += '<hr />'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
            + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
            + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$'
            + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

/**
 * Middleware for Handling Errors
 * Wrap other function in this for General Error Handling
 */

Util.handleErrors = fn => (req, res, next) => 
    Promise.resolve(fn(req, res, next))
        .catch(next)



/**
 * Build Detail
 */

Util.buildDetail = async function(data) {

    let grid;
    const vehicle = data[0]


    if (data.length != 0) {
        grid = '<div class="deliver-display">'
        grid += '<div>'
        grid += '<img src="' + vehicle.inv_image
            + '"alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model 
            + ' on CSE Motors" />'
        grid += '</div>'
        grid += '<div>'
        grid += '<h2>' + vehicle.inv_make + ' ' + vehicle.inv_model + ' Details</h2>'
        grid += '<p class="deliver-bold">Price: $' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</p>'
        grid += '<p><span class="deliver-bold">Description:</span> ' + vehicle.inv_description + '</p>'
        grid += '<p><span class="deliver-bold">Color:</span> ' + vehicle.inv_color + '</p>'
        grid += '<p><span class="deliver-bold">Miles:</span> ' + vehicle.inv_miles.toLocaleString('en-US') + '</p>'
        grid += '</div>'
        grid += '</div>'
    } else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }

    return grid
}


/**
 * Create add inventory form
 */
Util.buildAddInvForm = async function() {

    let addInvForm;
    let data = await invModel.getClassifications()
    console.log("buildAddInvForm data")
    console.log("Data length", data.rows.length)
    console.log(data)
    
    if (data.rows.length > 0) {

        addInvForm = '<section id="inv-class">'

        addInvForm += '<form id="inv-class-form" action="/inv/add-inventory" method="post">'

        addInvForm += '<label for="inv_make"><span class="form-element">Inventory Make:</span></label>'
        addInvForm += '<input type="text" id="inv_make" name="inv_make" required>'

        addInvForm += '<label for="inv_model"><span class="form-element">Inventory Model:</span></label>'
        addInvForm += '<input type="text" id="inv_model" name="inv_model" required>'

        addInvForm += '<label for="inv_year"><span class="form-element">Inventory Year:</span></label>'
        addInvForm += '<input type="text" id="inv_year" name="inv_year" minlength="4" maxlength="4" placeholder="2008" required>'

        addInvForm += '<label for="inv_description"><span class="form-element">Inventory Decription:</span></label>'
        addInvForm += '<textarea id="inv_description" name="inv_description" rows="5" cols="40" required></textarea>'

        addInvForm += '<label for="inv_image"><span class="form-element">Inventory Image:</span></label>'
        addInvForm += '<input type="text" id="inv_image" name="inv_image" value="/images/vehicles/no-image.png" required>'

        addInvForm += '<label for="inv_thumbnail"><span class="form-element">Inventory Thumbnail:</span></label>'
        addInvForm += '<input type="text" id="inv_thumbnail" name="inv_thumbnail" value="/images/vehicles/no-image-tn.png" required>'

        addInvForm += '<label for="inv_price"><span class="form-element">Inventory Price:</span></label>'
        addInvForm += '<input type="number" id="inv_price" name="inv_price" required>'
        
        addInvForm += '<label for="inv_miles"><span class="form-element">Inventory Miles:</span></label>'
        addInvForm += '<input type="number" id="inv_miles" name="inv_miles" required>'

        addInvForm += '<label for="inv_color"><span class="form-element">Inventory Color:</span></label>'
        addInvForm += '<input type="text" id="inv_color" name="inv_color" required>'

        addInvForm += '<label for="classification_id"><span class="form-element">Classification Type:</span></label>'
        addInvForm += '<select id="classification_id" name="classification_id" required>'
        data.rows.forEach((row) => {
            addInvForm += '<option value=' + row.classification_id + '>' + row.classification_name + '</option>'  
        })
        addInvForm += '</select>'

        addInvForm += '<button type="submit" id="inv-class-button">Add Inventory</button>'

        addInvForm += '</form>'

        addInvForm += '</section>'

        return addInvForm


    }


}




/**
 * Middleware to check token validity
 */
Util.checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET,
            function (err, accountData) {
                if (err) {
                    req.flash("Please log in")
                    res.clearCookie("jwt")
                    return res.redirect("/account/login")
                }

                res.locals.accountData = accountData 
                res.locals.loggedin = 1

                next()
            }
        )
    } else {
        next()
    }
}


/**
 * Check Login
 */
Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
        next()
    } else {
        req.flash("notice", "Please log in.")
        return res.redirect("/account/login")
    }
}


/**
 * Build Account Management View
 */
Util.buildAccountManagementView = async function(account_email) {

    const userData = await accountModel.getUserInfo(account_email)

    return '<p>You are logged in, ' + userData[0].account_firstname + '!</p>'

}


/**
 * 
 */
Util.buildClassificationList = async function () {
    
    let addInvForm
    let data = await invModel.getClassifications()

    if (data.rows.length > 0) {

        addInvForm = '<section id="select-class">'

        addInvForm += '<form id="select-class-form" action="" method="">'

        addInvForm += '<label for="select_classification_id"><span class="form-element">Select Classification Type:</span></label>'
        addInvForm += '<select id="select_classification_id" name="select_classification_id" required>'
        data.rows.forEach((row) => {
            addInvForm += '<option value=' + row.classification_id + '>' + row.classification_name + '</option>'  
        })
        addInvForm += '</select>'

        addInvForm += '</form>'

        addInvForm += '</section>'

        return addInvForm
    }

}


module.exports = Util