export class Product {

    constructor(
        public sku : string,
        public name : string,
        public description : string,
        public unitPrice : number,
        public imageURL : string,
        public active : boolean,
        public unitsInStock : number,
        public dateChanged : Date,
        public lastUpdated : Date        

    ){}
}
