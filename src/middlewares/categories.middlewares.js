import { categorieSchema } from "../models/categories.models.js";
import { connectionDB } from "../database/db.js";

export async function validateCategorie(req, res, next) {
    const validation = categorieSchema.validate(
        req.body, { abortEarly: false });
    if (validation.error) {
        const errors = validation.error.details.map(
            (detail) => detail.message
        );
        console.log(errors);
        return res.status(400).send(errors);
    }

    const { name } = req.body;

    try {
        const categorieFound = (await connectionDB.query
            (
                'SELECT * FROM categories WHERE name=$1;',
                [name]
            )).rowCount;
        if (categorieFound)
            return res.status(409).send('Categoria já cadastrada');
    } catch (error) {
        console.log(error);
        res.sendStatus(422);
    }

    res.locals.categorie = {
        name
    }

    next();
}