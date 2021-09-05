const Supplier = require('../models/supplier')

const chargeCredit = (id) => {
    setTimeout(async () => {
        try {
            const supplier = await Supplier.findById(id)
            
            if(supplier) {
                if(supplier.credits > 0 && supplier.campaign) {
                    supplier.credits -= 1
                    await supplier.save()
                    chargeCredit(id)
                } else {
                    supplier.campaign = false
                    await supplier.save()
                }
            }
        } catch (error) {
            
        }
    }, 60000)
}

module.exports = {
    chargeCredit
}