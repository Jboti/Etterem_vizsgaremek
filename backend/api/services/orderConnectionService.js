const orderConnectionRepository = require('../repositories/order_connectionRepository')

class OrderConnectionService
{

    async createPurchaseConnection(uid,purhcase,dishInfo,pointsUsed)
    {
        return await orderConnectionRepository.createPurchaseConnection(uid,purhcase,dishInfo,pointsUsed)
    }

}

module.exports = new OrderConnectionService()