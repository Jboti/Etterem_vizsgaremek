const purchaseRepository = require('../repositories/purchaseRepository')

class PurchaseService
{

    async getAllPurchaseUserInfo(uid)
    {
        return await purchaseRepository.getAllPurchaseUserInfo(uid)
    }

    async getAllActivePurchase(user)
    {
        return await purchaseRepository.getAllActivePurchase(user)
    }

    async deActivatePurchase(id)
    {
        return await purchaseRepository.deActivatePurchase(id)
    }
    

}

module.exports = new PurchaseService()