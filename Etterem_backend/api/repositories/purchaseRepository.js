const { where } = require('sequelize')
const db = require('../db/dbContext')

class purchaseRepository
{
    constructor(db)
    {
        this.Purchase = db.purchase
        this.OrderConnection = db.orderConnection
        this.User = db.user
        this.OrderDishConnection = db.orderDishConnection
        this.Dish = db.dish
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

    // async getAllActivePurchase()
    // {
    //     return await this.Purchase.findAll({
    //         where:
    //         {
    //             isActive: true
    //         }
    //     })
    // }

    async getAllPurchaseUserInfo() {
        return await this.Purchase.findAll({
            include: [
                {
                    model: this.OrderDishConnection,
                    as: "order_dishes",
                    include: [
                        {
                            model: this.Dish,
                            as: "dish",
                            attributes: ["name", "type"]
                        }
                    ],
                    attributes: ["customizations", "amount"]
                }
            ],
            attributes: ["date", "totalPrice", "message", "takeAway"]
        });
    }

    async getAllActivePurchase() {
        return await this.Purchase.findAll({
            where: {
                isActive: true
            },
            include: [
                {
                    model: this.OrderConnection,
                    as: "order_connections",
                    include: [
                        {
                            model: this.User,
                            as: "user",
                            attributes: ["userName"]
                        }
                    ],
                    attributes: ["id"] 
                },
                {
                    model: this.OrderDishConnection, 
                    as: "order_dishes",
                    include: [
                        {
                            model: this.Dish, 
                            as: "dish",
                            attributes: ["name","type"] 
                        }
                    ],
                    attributes: ["customizations", "amount"] 
                }
            ],
            attributes: ["id", "date","totalPrice","message","takeAway"] 
        })
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

    async deActivatePurchase(id)
    {
        await this.Purchase.update(
            {
                isActive: false,
            },
            {
                where: {
                    id: id
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