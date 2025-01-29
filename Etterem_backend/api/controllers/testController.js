const userRepository = require('../repositories/userRepository')
const dishRepository = require('../repositories/dishRepository')
const purchaseRepository = require('../repositories/purchaseRepository')
const order_connectionRepository = require('../repositories/order_connectionRepository')


exports.DataCreate = async (req,res,next) =>
{
    try
    {
        const currentDate = new Date()

        const users = [{
            id: null,
            timestamp: currentDate.toISOString(),
            created: currentDate.toISOString(),
            userName: 'béla',
            fullName: 'Big Béla',
            email: 'bigbela@gmail.com',
            password: 'asd',
            points: 200,
            isAdmin: true,
            isActive: true
        },
        {
            id: null,
            timestamp: currentDate.toISOString(),
            created: currentDate.toISOString(),
            userName: 'sanyi',
            fullName: 'Big Sanyi',
            email: 'bigsanya@gmail.com',
            password: 'abcdefg',
            points: 20000,
            isAdmin: false,
            isActive: true
        }]

        for(let i = 0; i<users.length;i++)
        {
            await userRepository.createUser(users[i])
            console.log("User created successfully!")
        }


        const dishes = [
            {
                id: null,
                name: "Borjú Kebab Wrap",
                created: "2025-01-29T00:00:00.000Z",
                price: 2290,
                available: true,
                customizationOptions: [
                    {name: "paradicsom ki", price: 0},
                    {name: "paradicsom be", price: 0},
                    {name: "csípős szósz", price: 0},
                    {name: "kapros szósz", price: 0},
                    {name: "fetás szósz", price: 0},
                    {name: "fokhagymás szósz", price: 0},
                    {name: "hagymamentes", price: 0}
                ],
                description: "Finom borjúhússal töltött, friss pita, ínycsiklandó szószokkal.",
                type: "Kebab Wrap",
                img: "H:\\FINALPROJECT\\Etterem_vizsgaremek\\Egyéb\\items\\borju_kebab_wrap.jpg"
            },
            {
                id: null,
                name: "Csirke Kebab Wrap",
                created: "2025-01-29T00:00:00.000Z",
                price: 1990,
                available: true,
                customizationOptions: [
                    {name: "paradicsom ki", price: 0},
                    {name: "paradicsom be", price: 0},
                    {name: "csípős szósz", price: 0},
                    {name: "kapros szósz", price: 0},
                    {name: "fetás szósz", price: 0},
                    {name: "fokhagymás szósz", price: 0},
                    {name: "hagymamentes", price: 0}
                ],
                description: "Friss csirkehússal töltött pita, választható szószokkal és friss hozzávalókkal.",
                type: "Kebab Wrap",
                img: "H:\\FINALPROJECT\\Etterem_vizsgaremek\\Egyéb\\items\\csirke_kebab_wrap.jpg"
            },
            {
                id: null,
                name: "Csípős Kebab",
                created: currentDate.toISOString(),
                price: 1700,
                available: true,
                customizationOptions: [{name:"extra csípős",price:200},{name:"extra sajt",price:300},{name:"extra szósz",price:200},{name:"extra hús",price:400},{name:"csípős nélkül",price:0},{name:"hagyma nélkül",price:0},{name:"uborka nélkül",price:0},{name:"paradicsom nélkül",price:0},{name:"saláta nélkül",price:0},{name:"szósz nélkül",price:0}],
                description: "Classic török kebab, finom borjú hússal, plussz csípőssel!",
                type: "Kebab",
            },
            {
                id: null,
                name: "Húsimádó Kebab",
                created: currentDate.toISOString(),
                price: 1900,
                available: true,
                customizationOptions: [{name:"extra csípős",price:200},{name:"extra sajt",price:300},{name:"extra szósz",price:200},{name:"extra hús",price:400},{name:"csípős nélkül",price:0},{name:"hagyma nélkül",price:0},{name:"uborka nélkül",price:0},{name:"paradicsom nélkül",price:0},{name:"saláta nélkül",price:0},{name:"szósz nélkül",price:0}],
                description: "Classic török kebab, finom, extrán sok borjú hússal!",
                type: "Kebab",
            },
            {
                id: null,
                name: "Házi Specialitás Kebab",
                created: currentDate.toISOString(),
                price: 2000,
                available: true,
                customizationOptions: [{name:"extra csípős",price:200},{name:"extra sajt",price:300},{name:"extra szósz",price:200},{name:"extra hús",price:400},{name:"csípős nélkül",price:0},{name:"hagyma nélkül",price:0},{name:"uborka nélkül",price:0},{name:"paradicsom nélkül",price:0},{name:"saláta nélkül",price:0},{name:"szósz nélkül",price:0}],
                description: "Classic török kebab, sok finom borjú hússal, ízletes házi szószunkkal!",
                type: "Kebab",
            },
            {
                id: null,
                name: "Csirke Kebab",
                created: currentDate.toISOString(),
                price: 1400,
                available: true,
                customizationOptions: [{name:"extra csípős",price:200},{name:"extra sajt",price:300},{name:"extra szósz",price:200},{name:"extra hús",price:400},{name:"csípős nélkül",price:0},{name:"hagyma nélkül",price:0},{name:"uborka nélkül",price:0},{name:"paradicsom nélkül",price:0},{name:"saláta nélkül",price:0},{name:"szósz nélkül",price:0}],
                description: "Csirke kebab, finom csirke hússal készítve!",
                type: "Csirke kebab",
            },
            {
                id: null,
                name: "Coca Cola",
                created: currentDate.toISOString(),
                price: 450,
                available: true,
                customizationOptions: [{name:"jég nélkül",price:0}],
                description: "Cukros üdítő",
                type: "Üdítő",
            },
            {
                id: null,
                name: "Fanta",
                created: currentDate.toISOString(),
                price: 450,
                available: true,
                customizationOptions: [{name:"jég nélkül",price:0}],
                description: "Cukros üdítő",
                type: "Üdítő",
            },
            {
                id: null,
                name: "Sprite",
                created: currentDate.toISOString(),
                price: 450,
                available: true,
                customizationOptions: [{name:"jég nélkül",price:0}],
                description: "Cukros üdítő",
                type: "Üdítő",
            },
            {
                id: null,
                name: "Lipton (citrom)",
                created: currentDate.toISOString(),
                price: 400,
                available: true,
                customizationOptions: [{name:"jég nélkül",price:0}],
                description: "Ice tea",
                type: "Üdítő",
            },
            {
                id: null,
                name: "Lipton (zöld tea)",
                created: currentDate.toISOString(),
                price: 400,
                available: true,
                customizationOptions: [{name:"jég nélkül",price:0}],
                description: "Ice tea",
                type: "Üdítő",
            },
        ]
        for(let i = 0;i<dishes.length;i++)
        {
            await dishRepository.createDish(dishes[i])
            console.log("Dish created successfully!")
        }

        const uids = [1,1,2]
        const purchases = [{
            id: null,
            date: currentDate.toISOString(),
            totalPrice: 10000,
            message: "",
            isActive: false,
            takeAway: false,
        },
        {
            id: null,
            date: currentDate.toISOString(),
            totalPrice: 8700,
            message: "Kutya ugat",
            isActive: true,
            takeAway: false,

        },
        {
            id: null,
            date: currentDate.toISOString(),
            totalPrice: 2700,
            message: "Nagyon szeretem!",
            isActive: true,
            takeAway: false,

        }]
        const dishInfos = [
        {
            dishIds: [1,2,2,3],
            dishAmounts: [1,1,1,2],
            dishCustomizations: ["extra hús","","hagyma nélkül","extra csípős"]
        },
        {
            dishIds: [2,2,3],
            dishAmounts: [1,2,1],
            dishCustomizations: ["extra sajt","hagyma nélkül",""]
        },
        {
            dishIds: [3,4,4,4],
            dishAmounts: [1,2,1,1],
            dishCustomizations: ["","hagyma nélkül","extra csípős","hagyma nélkül, extra csípős"]
        }]

        for(let i = 0 ; i<uids.length;i++)
        {
            await order_connectionRepository.createPurchaseConnection(uids[i],purchases[i],dishInfos[i])
            console.log("Purchase created successfully!")
            
        }

        console.log("Test data created successfully!")
        res.status(201).send("Test data created successfully!")
    }catch(error)
    {
        console.log("Test data creation failed!")
        next(error)
    }
}