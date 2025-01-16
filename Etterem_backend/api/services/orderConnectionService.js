const orderConnectionRepository = require('../repositories/order_connectionRepository')

class OrderConnectionService
{

    async createPurchaseConnection(uid,purhcase,dishInfo)
    {
        return await orderConnectionRepository.createPurchaseConnection(uid,purhcase,dishInfo)
    }

}

module.exports = new OrderConnectionService()