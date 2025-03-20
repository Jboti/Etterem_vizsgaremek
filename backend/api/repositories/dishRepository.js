const db = require('../db/dbContext')

class dishRepository
{
    constructor(db)
    {
        this.Dish = db.dish
        this.Allergy = db.allergy
        this.Allergenables = db.allergenables
    }


    async getDish(id)
    {
        return await this.Dish.findOne(
            {
                where:
                {
                    id: id,
                }
            })
    }

    async getAllDishes()
    {
        return await this.Dish.findAll({
            include: [
                {
                    model: this.Allergenables,
                    as: "allergenables",
                    include: [
                        {
                            model: this.Allergy,
                            as: "allergy"
                        }
                    ]
                }
            ]
        })
    }

    async createDish(dish, allergies)
    {
        const newDish = await this.Dish.create(dish)
        for (const allergyName in allergies) {
            if(allergies[allergyName]){
                const foundAllergy = await this.Allergy.findOne({
                    where: { name: allergyName }
                })

                if (foundAllergy) {
                    await this.Allergenables.create({
                        allergenable_type: 'dish',
                        allergenable_id: newDish.id,
                        allergen_id: foundAllergy.id
                    })
                }
            }
        }
        return newDish
    }

    async modifyDish(dish, allergies) {
        // Update the dish
        await this.Dish.update(
            {
                name: dish.name,
                price: dish.price,
                available: dish.available,
                sauceOptions: dish.sauceOptions,
                customizationOptions: dish.customizationOptions,
                description: dish.description,
                type: dish.type,
                img: dish.img
            },
            {
                where: { id: dish.id }
            }
        );
    
        // Retrieve the updated dish
        const modifiedDish = await this.Dish.findOne({ where: { id: dish.id } });
    
        if (!modifiedDish) {
            throw new Error("Dish not found after update");
        }
    
        // Handle allergies
        for (const allergyName in allergies) {
            const allergy = await this.Allergy.findOne({
                where: { name: allergyName }
            });
    
            if (allergy) {
                if (allergies[allergyName]) {
                    const existingAllergen = await this.Allergenables.findOne({
                        where: {
                            allergenable_type: 'dish',
                            allergenable_id: modifiedDish.id,
                            allergen_id: allergy.id
                        }
                    });
    
                    // Add allergen if it doesn't exist
                    if (!existingAllergen) {
                        await this.Allergenables.create({
                            allergenable_type: 'dish',
                            allergenable_id: modifiedDish.id,
                            allergen_id: allergy.id
                        });
                    }
                } else {
                    // Remove allergen if it exists
                    await this.Allergenables.destroy({
                        where: {
                            allergenable_type: 'dish',
                            allergenable_id: modifiedDish.id,
                            allergen_id: allergy.id
                        }
                    });
                }
            }
        }
    
        return modifiedDish;
    }
}

module.exports = new dishRepository(db)