const db = require('../db/dbContext')

class purchaseRepository
{
    constructor(db)
    {
        this.Purchase = db.purchase
    }


    async getPurchas(id)
    {
        return await this.Purchase.findOne(
            {
                where:
                {
                    id: id,
                }
            })
    }

    async getAllPurchases()
    {
        return await this.Purchase.findAll({})
    }

    async updatePurchase(purchase)
    {
        await this.Purchase.update(
            {
                message: purchase.message,
            },
            {
                where:
                {
                    id : purchase.id
                }
            })
    }

    async createPurchase(purchase)
    {
        await this.Purchase.create(purchase)
    }

    async deleteUser(purchase)
    {
        await this.Purchase.destroy(
            {
                where:
                {
                    id: purchase.id
                }
            })
    }
}

module.exports = new purchaseRepository(db)