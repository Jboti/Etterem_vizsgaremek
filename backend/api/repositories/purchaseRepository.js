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


    async getAllPurchaseUserInfo(uid) {
        return await this.OrderConnection.findAll({
            where:{
                user_id: uid
            },
            include:[{
                model: this.Purchase,
                as: "purchase",
                include: [
                    {
                        model: this.OrderDishConnection,
                        as: "order_dishes",
                        include: [
                            {
                                model: this.Dish,
                                as: "dish",
                                attributes: ["name", "type","price","customizationOptions"]
                            }
                        ],
                        attributes: ["dish_id", "amount","customizations"]
                    }
                ],
                attributes: ["date", "totalPrice", "message", "takeAway"]
            }],
            attributes:[]
        })
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
        return await this.Purchase.create(purchase)
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