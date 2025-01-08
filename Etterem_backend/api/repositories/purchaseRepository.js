const db = require('../db/dbContext')

class purchaseRepository
{
    constructor(db)
    {
        this.Purchase = db.purchase
        this.OrderConnection = db.orderConnection
        this.User = db.user
    }


    async getPurchase(id)
    {
        return await this.Purchase.findOne(
            {
                where:
                {
                    id: id,
                }
            })
    }

    async getPurchaseUser(purchase)
    {
        return await this.User.findOne(
        {
            where: {
                id: this.OrderConnection.findOne(
                    {
                        where: {
                            order_id: purchase.id,
                        }
                    }).user_id
            }
        })
    }

    async getAllPurchases()
    {
        return await this.Purchase.findAll({})
    }

    async updatePurchaseMessage(purchase)
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

    async deActivatePurchase(purchase)
    {
        await this.Purchase.update(
            {
                isActive: false,
            },
            {
                where: {
                    id: purchase.id
                }
            }
        )
    }

    async createPurchase(purchase)
    {
        await this.Purchase.create(purchase)
    }

    async deletePurchase(purchase)
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