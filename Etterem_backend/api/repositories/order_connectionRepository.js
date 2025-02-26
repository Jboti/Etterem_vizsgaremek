const db = require('../db/dbContext')

class order_connectionRepository
{
    constructor(db)
    {
        this.Purchase = db.purchase
        this.OrderConnection = db.orderConnection
        this.User = db.user
        this.OrderDishConnection = db.orderDishConnection
    }



    async createPurchaseConnection(uid,purchase,dishInfo)
    {
        const Purchase = await this.Purchase.create(purchase)
        const con = {
            id: null,
            user_id: uid,
            order_id: Purchase.id,
        }
        await this.OrderConnection.create(con)
        for(let i = 0;i<dishInfo.dishIds.length;i++)
        {            
            const dCon = {
                id: null,
                order_id: Purchase.id,
                dish_id: dishInfo.dishIds[i],
                amount: dishInfo.dishAmounts[i],
                customizations: dishInfo.dishCustomizations[i]
            }
            //console.log("dcon ITT---------: ",dCon);
            await this.OrderDishConnection.create(dCon);
            //console.log("dcon create ITT---------",this.orderDishConnection.create(dCon));
        }
        return Purchase
    }

}

module.exports = new order_connectionRepository(db)