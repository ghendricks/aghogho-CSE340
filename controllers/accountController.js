const utilities = require("../utilities/")
const accountModel = require("../models/account-model")


/**
 * Deliver login view
 */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("./account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}


/**
 * Deliver registration view
 */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
    })
}


/**
 * Process registration
 */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    const regResult = await accountModel.registerAccount(
        account_firstname, account_lastname, account_email, account_password
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'re registered ${account_firstname}. Please log in.`   
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null,
        })
    } else {
        req.flash(
            "notice", "Sorry, the registration failed."
        )
        res.status(501).render("account/register", {
            title: "Register",
            nav,
        })
    }
}


/**
 * Process login
 */
async function processLogin(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body

    const loginResult = await accountModel.checkAccountPassword(account_email, account_password)

    if (loginResult) {
        req.flash(
            "notice", "Welcome Back! Login was successful!"
        )
        res.status(201).render("index", {
            title: "Home",
            nav,
        })
    } else {
        req.flash(
            "notice", "Unauthorized access. Wrong email or password"
        )
        res.status(401).render("account/login", {
            title: "Login",
            nav,
            errors: null,
        })
    }
}



module.exports = { buildLogin, buildRegister, registerAccount, processLogin }