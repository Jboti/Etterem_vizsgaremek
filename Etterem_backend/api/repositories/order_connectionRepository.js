const db = require('../db/dbContext')

class order_connectionRepository
{
    constructor(db)
    {
        this.Purchase = db.purchase
        this.OrderConnection = db.orderConnection
        this.User = db.user
    }



    async createPurchaseConnection(uid,purchase)
    {
        const con = {
            id: null,
            user_id: uid,
            order_id: purchase.id,
        }
        await this.OrderConnection.create(con)
        await this.Purchase.create(purchase)
    }

}

module.exports = new purchaseRepository(db)