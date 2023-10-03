const cds = require('@sap/cds')
module.exports = cds.service.impl(function () {
    const { Products } = this.entities()

    this.after('each', Products, row => {
        console.log(`Read Product: ${row.ID}`)
    })

    this.after(['CREATE', 'UPDATE', 'DELETE'], [Products], async (Product, req) => {
        const header = req.data
        req.on('succeeded', () => {
            global.it || console.log(`< emitting: product_Changed ${Product.ID}`)
            this.emit('prod_Change', header)
        })
    })
    
    this.on("error", (err, req) => {
        switch (err.message) {
            case "UNIQUE_CONSTRAINT_VIOLATION":
                err.message = "The entry already exists.";
                break;

            default:
                err.message =
                    "An error occured. Please retry. Technical error message: " +
                    err.message;
                break;
        }
    });
})