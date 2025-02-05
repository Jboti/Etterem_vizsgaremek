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
        }


        const dishes = [
            //WRAPS

            {
                id: null,
                name: "Csirke Kebab Wrap",
                created: currentDate.toISOString(),
                price: 1990,
                available: true,
                sauceOptions:[
                    {name: "csípős szósz"},
                    {name: "kapros szósz"},
                    {name: "fetás szósz"},
                    {name: "fokhagymás szósz"},
                ],
                customizationOptions: [
                    {name: "hagyma nélkül", price: 0},
                    {name: "paradicsom nélkül", price: 0},
                    {name: "uborka nélkül", price: 0},
                    {name: "extra hús", price:400},
                    {name: "extra sajt", price:300},
                    {name: "extra csípős", price:200},
                ],
                description: "Friss csirkehússal töltött pita, választható szószokkal és friss hozzávalókkal.",
                type: "Wrap",
                //img: "H:\\FINALPROJECT\\Etterem_vizsgaremek\\Egyéb\\items\\csirke_kebab_wrap.jpg"
            },
            {
                id: null,
                name: "Borjú Kebab Wrap",
                created: currentDate.toISOString(),
                price: 2290,
                available: true,
                sauceOptions:[
                    {name: "csípős szósz"},
                    {name: "kapros szósz"},
                    {name: "fetás szósz"},
                    {name: "fokhagymás szósz"},
                ],
                customizationOptions: [
                    {name: "hagyma nélkül", price: 0},
                    {name: "paradicsom nélkül", price: 0},
                    {name: "uborka nélkül", price: 0},
                    {name: "extra hús", price:400},
                    {name: "extra sajt", price:300},
                    {name: "extra csípős", price:200},
                ],
                description: "Finom borjúhússal töltött, friss pita, ínycsiklandó szószokkal.",
                type: "Wrap",
                //img: "H:\\FINALPROJECT\\Etterem_vizsgaremek\\Egyéb\\items\\borju_kebab_wrap.jpg"
            },
            {
                id: null,
                name: "Bárány Kebab Wrap",
                created: currentDate.toISOString(),
                price: 2490,
                available: true,
                sauceOptions:[
                    {name: "csípős szósz"},
                    {name: "kapros szósz"},
                    {name: "fetás szósz"},
                    {name: "fokhagymás szósz"},
                ],
                customizationOptions: [
                    {name: "hagyma nélkül", price: 0},
                    {name: "paradicsom nélkül", price: 0},
                    {name: "uborka nélkül", price: 0},
                    {name: "extra hús", price:400},
                    {name: "extra sajt", price:300},
                    {name: "extra csípős", price:200},
                ],
                description: "Friss bárányhússal töltött pita, választható szószokkal és friss hozzávalókkal.",
                type: "Wrap",
                //img: "H:\\FINALPROJECT\\Etterem_vizsgaremek\\Egyéb\\items\\csirke_kebab_wrap.jpg"
            },


            //KEBAB

            //CSIRKE
            {
                id: null,
                name: "Klasszik Csirke Kebab",
                created: currentDate.toISOString(),
                price: 2990,
                available: true,
                sauceOptions:[
                    {name: "csípős szósz"},
                    {name: "kapros szósz"},
                    {name: "fetás szósz"},
                    {name: "fokhagymás szósz"},
                ],
                customizationOptions: [
                    {name: "hagyma nélkül", price: 0},
                    {name: "paradicsom nélkül", price: 0},
                    {name: "uborka nélkül", price: 0},
                    {name: "extra hús", price:500},
                    {name: "extra sajt", price:300},
                    {name: "extra csípős", price:200},
                    {name: "édes burgonya", price:300},
                ],
                description: "Nagy adag classic török kebab, finom csirke hússal.",
                type: "Kebab",
            },
            {
                id: null,
                name: "Extrán Csípős Csirke Kebab",
                created: currentDate.toISOString(),
                price: 3190,
                available: true,
                sauceOptions:[
                    {name: "csípős szósz"},
                ],
                customizationOptions: [
                    {name: "hagyma nélkül", price: 0},
                    {name: "paradicsom nélkül", price: 0},
                    {name: "uborka nélkül", price: 0},
                    {name: "extra hús", price:500},
                    {name: "extra sajt", price:300},
                    {name: "édes burgonya", price:300},
                ],
                description: "Nagy adag extrán csípős török kebab, finom csirke hússal.",
                type: "Kebab",
            },
            {
                id: null,
                name: "Extrán Sajtos Csirke Kebab",
                created: currentDate.toISOString(),
                price: 3290,
                available: true,
                sauceOptions:[
                    {name: "csípős szósz"},
                    {name: "kapros szósz"},
                    {name: "fetás szósz"},
                    {name: "fokhagymás szósz"},
                ],
                customizationOptions: [
                    {name: "hagyma nélkül", price: 0},
                    {name: "paradicsom nélkül", price: 0},
                    {name: "uborka nélkül", price: 0},
                    {name: "extra hús", price:500},
                    {name: "extra csípős", price:200},
                    {name: "édes burgonya", price:300},
                ],
                description: "Nagy adag extrán sajtos török kebab, finom csirke hússal.",
                type: "Kebab",
            },
            {
                id: null,
                name: "Húsimádó Csirke Kebab",
                created: currentDate.toISOString(),
                price: 3490,
                available: true,
                sauceOptions:[
                    {name: "csípős szósz"},
                    {name: "kapros szósz"},
                    {name: "fetás szósz"},
                    {name: "fokhagymás szósz"},
                ],
                customizationOptions: [
                    {name: "hagyma nélkül", price: 0},
                    {name: "paradicsom nélkül", price: 0},
                    {name: "uborka nélkül", price: 0},
                    {name: "extra sajt", price:300},
                    {name: "extra csípős", price:200},
                    {name: "édes burgonya", price:300},
                ],
                description: "Nagy adag extrán húsos török kebab, finom csirke hússal.",
                type: "Kebab",
            },
            {
                id: null,
                name: "Házi Mindenes Csirke Kebab",
                created: currentDate.toISOString(),
                price: 3990,
                available: true,
                sauceOptions:[
                    {name: "Házi szósz"},
                ],
                customizationOptions: [
                    {name: "hagyma nélkül", price: 0},
                    {name: "paradicsom nélkül", price: 0},
                    {name: "uborka nélkül", price: 0},
                    {name: "extra hús nélkül", price: -300},
                    {name: "extra sajt nélkül", price: -100},
                    {name: "édes burgonya", price:300},
                ],
                description: "Nagy adag mindennel teli török kebab, finom csirke hússal és házi speciális szósszal.",
                type: "Kebab",
            },


            //BORJÚ
            {
                id: null,
                name: "Klasszik Borjú Kebab",
                created: currentDate.toISOString(),
                price: 3290,
                available: true,
                sauceOptions:[
                    {name: "csípős szósz"},
                    {name: "kapros szósz"},
                    {name: "fetás szósz"},
                    {name: "fokhagymás szósz"},
                ],
                customizationOptions: [
                    {name: "hagyma nélkül", price: 0},
                    {name: "paradicsom nélkül", price: 0},
                    {name: "uborka nélkül", price: 0},
                    {name: "extra hús", price:500},
                    {name: "extra sajt", price:300},
                    {name: "extra csípős", price:200},
                    {name: "édes burgonya", price:300},
                ],
                description: "Nagy adag classic török kebab, finom borjú hússal.",
                type: "Kebab",
            },
            {
                id: null,
                name: "Extrán Csípős Borjú Kebab",
                created: currentDate.toISOString(),
                price: 3490,
                available: true,
                sauceOptions:[
                    {name: "csípős szósz"},
                ],
                customizationOptions: [
                    {name: "hagyma nélkül", price: 0},
                    {name: "paradicsom nélkül", price: 0},
                    {name: "uborka nélkül", price: 0},
                    {name: "extra hús", price:500},
                    {name: "extra sajt", price:300},
                    {name: "édes burgonya", price:300},
                ],
                description: "Nagy adag extrán csípős török kebab, finom borjú hússal.",
                type: "Kebab",
            },
            {
                id: null,
                name: "Extrán Sajtos Borjú Kebab",
                created: currentDate.toISOString(),
                price: 3590,
                available: true,
                sauceOptions:[
                    {name: "csípős szósz"},
                    {name: "kapros szósz"},
                    {name: "fetás szósz"},
                    {name: "fokhagymás szósz"},
                ],
                customizationOptions: [
                    {name: "hagyma nélkül", price: 0},
                    {name: "paradicsom nélkül", price: 0},
                    {name: "uborka nélkül", price: 0},
                    {name: "extra hús", price:500},
                    {name: "extra csípős", price:200},
                    {name: "édes burgonya", price:300},
                ],
                description: "Nagy adag extrán sajtos török kebab, finom borjú hússal.",
                type: "Kebab",
            },
            {
                id: null,
                name: "Húsimádó Borjú Kebab",
                created: currentDate.toISOString(),
                price: 3790,
                available: true,
                sauceOptions:[
                    {name: "csípős szósz"},
                    {name: "kapros szósz"},
                    {name: "fetás szósz"},
                    {name: "fokhagymás szósz"},
                ],
                customizationOptions: [
                    {name: "hagyma nélkül", price: 0},
                    {name: "paradicsom nélkül", price: 0},
                    {name: "uborka nélkül", price: 0},
                    {name: "extra sajt", price:300},
                    {name: "extra csípős", price:200},
                    {name: "édes burgonya", price:300},
                ],
                description: "Nagy adag extrán húsos török kebab, finom borjú hússal.",
                type: "Kebab",
            },
            {
                id: null,
                name: "Házi Mindenes Borjú Kebab",
                created: currentDate.toISOString(),
                price: 4290,
                available: true,
                sauceOptions:[
                    {name: "Házi szósz"},
                ],
                customizationOptions: [
                    {name: "hagyma nélkül", price: 0},
                    {name: "paradicsom nélkül", price: 0},
                    {name: "uborka nélkül", price: 0},
                    {name: "extra hús nélkül", price: -300},
                    {name: "extra sajt nélkül", price: -100},
                    {name: "édes burgonya", price:300},
                ],
                description: "Nagy adag mindennel teli török kebab, finom borjú hússal és házi speciális szósszal.",
                type: "Kebab",
            },


            //ITALOK
            {
                id: null,
                name: "Coca Cola",
                created: currentDate.toISOString(),
                price: 690,
                available: true,
                sauceOptions:null,
                customizationOptions:null,
                description: "Cukros üdítő",
                type: "Drink",
            },
            {
                id: null,
                name: "Fanta",
                created: currentDate.toISOString(),
                price: 690,
                available: true,
                sauceOptions:null,
                customizationOptions:null,
                description: "Cukros üdítő",
                type: "Drink",
            },
            {
                id: null,
                name: "Sprite",
                created: currentDate.toISOString(),
                price: 690,
                available: true,
                sauceOptions:null,
                customizationOptions:null,
                description: "Cukros üdítő",
                type: "Drink",
            },
            {
                id: null,
                name: "Kinley gyömbér",
                created: currentDate.toISOString(),
                price: 690,
                available: true,
                sauceOptions:null,
                customizationOptions:null,
                description: "Cukros üdítő",
                type: "Drink",
            },
            {
                id: null,
                name: "Cappy",
                created: currentDate.toISOString(),
                price: 590,
                available: true,
                sauceOptions:null,
                customizationOptions:null,
                description: "Cukros üdítő",
                type: "Drink",
            },
            {
                id: null,
                name: "NesTea citrom",
                created: currentDate.toISOString(),
                price: 590,
                available: true,
                sauceOptions:null,
                customizationOptions:null,
                description: "Ice tea",
                type: "Drink",
            },
            {
                id: null,
                name: "Lipton citrom",
                created: currentDate.toISOString(),
                price: 590,
                available: true,
                sauceOptions:null,
                customizationOptions:null,
                description: "Ice tea",
                type: "Drink",
            },
            {
                id: null,
                name: "Lipton zöld tea",
                created: currentDate.toISOString(),
                price: 590,
                available: true,
                sauceOptions:null,
                customizationOptions:null,
                description: "Ice tea",
                type: "Drink",
            },
            {
                id: null,
                name: "Nature Aqua szénsavas",
                created: currentDate.toISOString(),
                price: 390,
                available: true,
                sauceOptions:null,
                customizationOptions:null,
                description: "Szénsavas ásványvíz",
                type: "Drink",
            },
            {
                id: null,
                name: "Nature Aqua szénsavasmentes",
                created: currentDate.toISOString(),
                price: 390,
                available: true,
                sauceOptions:null,
                customizationOptions:null,
                description: "Szénsavmentes ásványvíz",
                type: "Drink",
            },
        ]
        for(let i = 0;i<dishes.length;i++)
        {
            const dish = await dishRepository.createDish(dishes[i])
            
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
            
            
        }

        console.log("Test data created successfully!")
        res.status(201).send("Test data created successfully!")
    }catch(error)
    {
        console.log("Test data creation failed!")
        next(error)
    }
}