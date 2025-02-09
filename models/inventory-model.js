const pool = require("../database/")

/**
 * Get all classification data
 */

async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/**
 * Get all inventory items and classification_name by classification_id
 */

async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i
            JOIN public.classification AS c
            ON i.classification_id = c.classification_id
            WHERE i.classification_id = $1`,
            [classification_id]
        )
        return data.rows
    } catch(error) {
        console.error("getInventoryClassificationById error " + error)
    }
}


/**
 * 
 */
async function getInventoryByInventoryId(inv_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i
            JOIN public.classification AS c
            ON i.classification_id = c.classification_id
            WHERE inv_id = $1;`,
            [inv_id]
        )
        return data.rows
    } catch(error) {
        console.error("getInventoryByInventoryId error " + error)
    }
}


/**
 * Insert Classificatin name into account table
 */
async function insertClassificationName(classification_name) {
    try {
        const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *"
        const result = await pool.query(sql, [classification_name])
        return result.rows[0]
    } catch (error) {
        console.error("Error inserting classification name: " + error)
    }
}

/**
 * Insert InvFormData into inventory table
 */
async function insertInvFormData(
    inv_make, inv_model, inv_year, inv_description, inv_image, 
    inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) {
    try {
        const result = await pool.query(
            `INSERT INTO public.inventory 
            (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail,
            inv_price, inv_miles, inv_color, classification_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *`,
            [inv_make, inv_model, inv_year, inv_description, inv_image,
            inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
            ]
        )

        console.log("Inside InsertInvFormData")
        console.log(result.rows)

        return result.rows[0]
    } catch (error) {
        console.error("Error inserting InvFormData: " + error)
    }
}


/**
 * Get joined inventory and classification table
 */
async function inventoryClassificationTable() {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i
            JOIN public.classification as c
            USING (classification_id);`
        )

        return data.rows
    } catch (error) {
        console.error("Error getting inventoryClassification table " + error)
    }
}



module.exports = { getClassifications, getInventoryByClassificationId, getInventoryByInventoryId, insertClassificationName, inventoryClassificationTable, insertInvFormData }