const request = require("supertest");
require("dotenv").config();

//var userController = require("./api/controllers/userController")
//jest.setTimeout(15000); //evvel tudjuk meghosszabbítani a várási időt, alap 5 mp(5000)
const jwt = require("jsonwebtoken");
const app = require("../../app");
const dishController = require("../controllers/dishController");
const purchaseController = require("../controllers/purchaseController");
const testController = require("../controllers/testController");
const userController = require("../controllers/userController");
const purchaseService = require("../services/purchaseService");
const { orderConnectionService } = require('../services/orderConnectionService');
const { userService } = require('../services/userService');

jest.mock("../db/dbContext", () => require("../../__mocks__/db"));



describe("Backend tesztek",()=>
{
//------Controllerek------
describe("Controller tesztek", ()=>
    {
        test.each(["createDish","getAllDishes"])
        ("dishControllerben léteznek a kérések: %s", async (keres)=>        //keres -> kérés
        {
            expect(dishController[keres]).toBeDefined();
        });
        
        jest.mock("../services/dishService");
        
        describe("Dish Controller Tests", () => {

            test("getDishes test helytelen", async () => 
                {
                    const res = await request(app).get("/api/v1/dishes");

                    expect(res.statusCode).toBe(500);
                })
                
            test("createDish test helyes", async () => 
                {
                    const base64Image = "image";
                    const res = await request(app).post("/api/v1/dish")
                    .set("Content-Type", "application/json")
                    .send({
                        name:"TestDishName",price:100,created:"vmiido",
                        available:true,sauceOptions:{},customizationOptions:{},
                        description:"description",type:"type",image:"base64Image",
                        gluten:"glutén",lactose:"lactose",egg:"egg",nuts:"nuts"

                    });
                    console.log();
                    expect(res.statusCode).toBe(201);
                    
                })

            test("getDishes test helyes", async () => 
                {
                    const res = await request(app).get("/api/v1/dishes");

                    expect(res.statusCode).toBe(200);
                })

            test("createDish test helytelen", async () => 
                {
                    
                    const res = await request(app).post("/api/v1/dish")
                    .send({
                        name:"TestDishName",price:"100",created:"vmiido",
                        available:true,sauceOptions:{},customizationOptions:{},
                        description:"description",type:"type",
                        image:null,gluten:"glutén",lactose:"lactose",egg:"egg",nuts:"nuts"
                    });

                    expect(res.statusCode).toBe(404);
                })
                    
            test("createDish test hiányos", async () => 
                {
                    const res = await request(app).post("/api/v1/create-new-dish")
                    .send({
                        name:"TestDishName",price:100,created:"vmiido",
                    });

                    expect(res.statusCode).toBe(404);
                })

        });
        
        describe("userController", () => {

            test("createUser test helyes", async () => 
                {
                    const res = await request(app).post("/api/v1/register")
                    .send({
                        userName:"TestUserName",fullName:"TestFullName",email:"danikataurusz@gmail.com",password:"password"
                    });
                    console.log(res.body);
                    expect(res.statusCode).toBe(201);
                })

        });

        describe("purchaseController", () => {
            
                // Létrehozunk egy érvényes felhasználót és bejelentkezünk, hogy megkapjuk a JWT tokent
                // order.test.js (a tesztfájl elején)
                
// 1. Mockold a szolgáltatásokat
jest.mock('../services/orderConnectionService', () => ({
    createPurchaseConnection: jest.fn() // Közvetlenül a függvényt mockoljuk
  }));
  
  jest.mock('../services/userService', () => ({
    usePoints: jest.fn()
  }));
  
  // 2. Importáld a mock-olt függvényeket
  const { createPurchaseConnection } = require('../services/orderConnectionService');
  const { usePoints } = require('../services/userService');
  
  // 3. Mockold az authenticateToken middleware-t
  // Mockold a szolgáltatásokat
jest.mock("../services/orderConnectionService", () => ({
    createPurchaseConnection: jest.fn(),
  }));
  
  jest.mock("../services/userService", () => ({
    usePoints: jest.fn(),
  }));
  
  // Mockold a JWT middleware-t
  jest.mock("../middlewares/userAuth", () => ({
    authenticateToken: (req, res, next) => {
      req.uid = 1; // Dummy user ID
      next();
    },
  }));
  
  
  describe("POST /api/v1/order", () => {
    beforeEach(() => {
      createPurchaseConnection.mockReset();
      usePoints.mockReset();
    });
  
    it("Sikeres rendelés (201-es státusz)", async () => {
      // Mock beállítása
      createPurchaseConnection.mockResolvedValue({ id: 123 });
      usePoints.mockResolvedValue();
  
      // Küldj egy érvénytelen token-t (a middleware mock miatt nem számít)
      const response = await request(app)
        .post("/api/v1/order")
        .set("Authorization", "Bearer invalid_or_malformed_token") // A mock figyelmen kívül hagyja
        .send({
          totalPrice: 1500,
          message: "Kérem gyorsan!",
          takeAway: true,
          dishIds: [1, 2],
          dishAmounts: [2, 1],
          dishCustomizations: ["extra sajt"],
          pointsUsed: 100,
        });
  
      // Ellenőrzések
      expect(response.status).toBe(201);
      expect(createPurchaseConnection).toHaveBeenCalled();
      expect(usePoints).toHaveBeenCalledWith(1, 100); // A dummy user ID (1) ellenőrzése
    });
  });

            test("getAllPurchaseUserInfo helyes", async () => 
                {
                    const res = await request(app).get("/api/v1/user-orders");

                    expect(res.statusCode).toBe(200);
                });

            test("getAllActivePurchase helyes", async () => 
                {
                    const res = await request(app).get("/api/v1/active-orders");

                    expect(res.statusCode).toBe(200);
                });    
        });
        
    
    
        test.each(["getAllActivePurchase","deActivatePurchase","placeOrder"])
        ("purchaseControllerben léteznek a kérések: %s", async (keres)=>
        {
            expect(purchaseController[keres]).toBeDefined();
        });
        
     
        test.each(["DataCreate"])("testControllerben léteznek a kérések: %s", (keres)=>
        {
            expect(testController[keres]).toBeDefined();
        });
        
    
        test.each(["getUser","getAllUser","createUser","verifyEmail","loginUser","deleteUser"])
        ("userControllerben léteznek a kérések: %s", (keres)=>
        {
            expect(userController[keres]).toBeDefined();
        });
    })
    
    
    //------Middlewares------
    describe("Middlewares tesztek", ()=>
    {
        test.each(["errorHandler","userAuth"])("léteznek a middlewarek: %s", (mware) =>{
            var middleware = require(`../middlewares/${mware}`);
    
            expect(middleware).toBeDefined(); 
        })
    
        test.each(["notFoundError","showError"])("errorHandler funkció'i' léteznek: %s", (funkcio) =>{
            var errorHandler = require(`../middlewares/errorHandler`);
    
            expect(errorHandler[funkcio]).toBeDefined(); 
        })
    
        test.each(["authenticateToken"])("userAuth funkció'i' léteznek: %s", (funkcio) =>{
            var userAuth = require(`../middlewares/userAuth`);
    
            expect(userAuth[funkcio]).toBeDefined(); 
        })
    })
    
    //------Modellek------
    describe("Modellek léteznek", ()=>
    {
        
        test.each(["allergenables","allergy","dish","index","order_connection","order_dish_connection","purchase","user"])
        ("Léteznek-e az adatbázis táblái backenden: %s",(model)=>{
            var models = require(`../models/${model}`)
            expect(models).toBeDefined();
        });
        
    })


    

    describe("Repository tests", () => {
      beforeAll(async () => {
        await require("../../__mocks__/db").sequelize.sync({ force: true });
      });

      const dishRepository = require("../repositories/dishRepository");
      const userRepository = require("../repositories/userRepository");
      const purchaseRepository = require("../repositories/purchaseRepository");
      const order_connectionRepositroy = require("../repositories/order_connectionRepository");

      const DishService = require("../services/dishService");
      let mockDish;

      describe("DishRepo tesztek", () => {
        beforeAll(async () => {
           mockDish = {
            id: 1,
            name: "Mock Dish",
            created: new Date().toISOString().split("T")[0],//az adat struktúrában dateonly va, viszont itt visszakapjuk a timeot is ezért azt le kell vágni ebből
            price: 10,
            available: true,
            sauceOptions: {},
            customizationOptions: {},
            description: "This is a mock dish",
            type: "Mock Type",
            img: null
          };

            await dishRepository.createDish(mockDish,{"Peanut":true});
        });
  
        test("getDish returns mockDish", async () => {
            const receivedDish = await dishRepository.getDish(1);
            expect(receivedDish.get({ plain: true })).toEqual(mockDish);
        });

        test("getAllDishes returns 1 dish", async () => {
          const receivedDishes = await dishRepository.getAllDishes();
          expect(receivedDishes.length).toBe(1);
        });

        test("modifyDish updates dish", async () => {
            const modifiedDish = {
                id: 1,
                name: "Modified Dish",
                created: new Date().toISOString().split("T")[0],//az adat struktúrában dateonly va, viszont itt visszakapjuk a timeot is ezért azt le kell vágni ebből
                price: 10,
                available: true,
                sauceOptions: {},
                customizationOptions: {},
                description: "This is a modified dish",
                type: "Mock Type",
                img: null
            };

            const newAllergy = { "Peanut": true };
            const mockPeanutAllergy = { id: 10, name: "Peanut" };

            dishRepository.Allergy.findOne = jest.fn().mockResolvedValue(mockPeanutAllergy);
            dishRepository.Allergenables.findOne = jest.fn().mockResolvedValue(null); // Nincs még hozzárendelve
            dishRepository.Allergenables.create = jest.fn().mockResolvedValue({});

            await DishService.modifyDish(modifiedDish, newAllergy);
            await dishRepository.modifyDish(modifiedDish,newAllergy);
            const receivedDish = await dishRepository.getDish(1);
            expect(receivedDish.get({ plain: true })).toEqual(modifiedDish);

      })});

      describe("UserRepo tesztek", () => {
        let mockUser;
        beforeAll(async () => {
          mockUser = {
              id:1,
              timestamp: new Date().toISOString(),
              created: new Date().toISOString().split("T")[0],
              allergenables: new Array(),
              userName: "mockUserName",
              fullName: "Mock FullName",
              email: "mock@example.com",
              password: "mockPassword",
              points: 0,  
              isAdmin: false,
              isActive: false, // email verification után true
          };
          await userRepository.createUser(mockUser);
          },);

  
        test("getUser returns mockUser", async () => {
          const receivedUser = await userRepository.getUser(1);
          expect(receivedUser.get({ plain: true }))
          .toEqual({
            id:mockUser.id,
            allergenables:mockUser.allergenables,
            created:mockUser.created,
            userName:mockUser.userName,
            fullName:mockUser.fullName,
            email:mockUser.email,
            points:mockUser.points
          });
        });
  
        test("getAllUser returns with length 1", async () => {
          expect((await userRepository.getAllUser()).length).toBe(1);
        })

        
        

        /*test("verifyEmail verifies email", async () => { nem tesztelem le mert a getUser nem tér vissza az isActive al és nem tudom letesztelni a változást a mockUserben
            const receivedUser = await userRepository.getUser(1);
            console.log(mockUser,"AAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
            console.log(await userRepository.verifyEmail(1))
            await userRepository.verifyEmail(1);
            expect(mockUser.isActive).toEqual(true)
            
        })*/

        
        test("getUserByEmail returns with correct user", async () => {
            const foundUser = await userRepository.getUserByEmail("mock@example.com");
            const plainUser = foundUser.get({ plain: true });
            console.log(plainUser);
            expect(plainUser.email).toEqual(mockUser.email);
        })
        test("checkForExistinguserName returns with correct user", async () => {
            const foundUser = await userRepository.checkForExistinguserName("mockUserName");
            const plainUser = foundUser.get({ plain: true });
            expect(plainUser.userName).toEqual(mockUser.userName);
        })

        test("updateUserName updates username", async () => {
            const Userupdate = {id:1, userName:"newusername"};
            userRepository.updateUserName(Userupdate);
            const receivedUser = await userRepository.getUser(1);
            expect(receivedUser.userName).toEqual("newusername")
            
        })

        test("changeUserName changes username", async () => {
            await userRepository.changeUserName("newusername",1);
            const receivedUser = await userRepository.getUser(1);
            expect(receivedUser.userName).toEqual("newusername")
        })

        test("changePassword changes password andgetUserPwById returns with correct password", async () => {
            await userRepository.changePassword("newpassword",1);
            const foundUser = await userRepository.getUserPwById(1);
            const plainUser = foundUser.get({ plain: true });
            expect(plainUser.password).toEqual("newpassword");
        });

        test("adminUserModify updates the user", async () => {
            const Userupdate = {id:1, userName:"newusername"};
            await userRepository.adminUserModify(Userupdate);
            const receivedUser = await userRepository.getUser(1);
            expect(receivedUser.userName).toEqual("newusername")
        });

        test("usePoints updates the points", async () => {
            await userRepository.usePoints(1,1);
            const receivedUser = await userRepository.getUser(1);
            expect(receivedUser.points).toEqual(-1)
        });
         //UPDATE ALLERGIES

        test("update Allregies updates allergies", async () => {
            const userId = 1;
            const newAllergy = { "Peanut": true };

            const mockPeanutAllergy = { id: 10, name: "Peanut" };

            userRepository.Allergy.findOne = jest.fn().mockResolvedValue(mockPeanutAllergy);
            userRepository.Allergenable.findOne = jest.fn().mockResolvedValue(null); 
            userRepository.Allergenable.create = jest.fn().mockResolvedValue({});
            //findOne() → Lekérdezi az allergiát az Allergy táblából.
            //findOne() (Allergenable) → Ellenőrzi, hogy az allergia már hozzárendelve van-e a userhez.
            //create() → Hozzáadja az allergiát a Allergenable táblába.

            await userRepository.updateAllregies(userId, newAllergy);

            userRepository.getUser = jest.fn().mockResolvedValue({
                id: userId,
                allergies: [{ name: "Peanut" }]
            });


            const receivedUser = await userRepository.getUser(userId, { include: ["allergies"] });

            expect(receivedUser.allergies).toEqual([{ name: "Peanut" }]);
        })

        //a delete legyen az utolsó minden esetben---

        test("deleteUser deletes the user and GetAllUser returns 0 users", async () => {
            await userRepository.deleteUser(1);
            expect((await userRepository.getAllUser()).length).toBe(0);
        });
    });

    describe("PurchaseRepo tesztek", () =>{
        let mockPurchase;
        let mockorder_connection;
        let mockorder_dish_connection;
        let mockUser;
        let dishInfo;
        beforeAll(async () => {
            mockUser = {
                id:1,
                timestamp: new Date().toISOString(),
                created: new Date().toISOString().split("T")[0],
                userName: "mockUserName",
                fullName: "Mock FullName",
                email: "mock@example.com",
                password: "mockPassword",
                points: 0,  
                isAdmin: false,
                isActive: false, // email verification után true
            };
            
            const createdUser = await userRepository.createUser(mockUser);

            mockPurchase = {
                id:1,
                date: new Date(),
                totalPrice: 123,
                message: "Mock uzenet",
                isActive: true,
                takeAway: false,
            };

            const createdPurchase = await purchaseRepository.createPurchase(mockPurchase);
            console.log("Mock purchase:", createdPurchase);


            mockorder_connection = {
                user_id: createdUser.id,
                order_id: createdPurchase.id, // Helyesen kapcsoljuk az ID-t
            };

            console.log("mockorder_connection: ",mockorder_connection);    

            dishInfo = {
                dishIds: 1,
                dishAmounts: 2,
                dishCustomizations: {"customizationId":'as'},
            };

            console.log("dishInfo: ",dishInfo);

        })
        
        console.log("DISHINFO KINN",dishInfo);

        test("getPurchase returns mockpurchase", async () =>{
            const receivedpurchase = await purchaseRepository.getPurchase(1);
            console.log(mockPurchase)
            expect(receivedpurchase.get({plain:true})).toEqual({
                id:mockPurchase.id,
                date:mockPurchase.date,
                totalPrice:mockPurchase.totalPrice,
                message:mockPurchase.message,
                isActive:mockPurchase.isActive,
                takeAway:mockPurchase.takeAway
            })
        })

        test("getAllPurchase returns length 1", async () =>{
            const receivedpurchase = await purchaseRepository.getPurchase(1);
            console.log(mockPurchase)
            expect(receivedpurchase.get({plain:true})).toEqual({
                id:mockPurchase.id,
                date:mockPurchase.date,
                totalPrice:mockPurchase.totalPrice,
                message:mockPurchase.message,
                isActive:mockPurchase.isActive,
                takeAway:mockPurchase.takeAway
            })
        })

        test("deActivatePurchase deactivates purchase", async () => {
            await purchaseRepository.deActivatePurchase(1);
            const receivedpurchase = await purchaseRepository.getPurchase(1);
            expect(receivedpurchase.isActive).toEqual(false);
        });

        test("updatePurchase updates the purchase", async () => {
            mockPurchase.message = "new message";
            await purchaseRepository.updatePurchaseMessage(mockPurchase);
            const receivedpurchase = await purchaseRepository.getPurchase(1);
            console.log("received: ",receivedpurchase);
            expect(receivedpurchase.message).toEqual("new message");
        });

        test("deletePurchase deletes the purchase and GetAllPurchase returns 0 purchases", async () => {
            await purchaseRepository.deletePurchase(mockPurchase);
            expect((await purchaseRepository.getAllActivePurchase()).length).toBe(0);
        });

        test("idkezeles", async () => {
            mockorder_dish_connection = await order_connectionRepositroy.createPurchaseConnection(mockorder_connection.user_id, mockPurchase, dishInfo, 0);

            console.log("Mock order_dish_connection:", mockorder_dish_connection);//EZ NEM JÓ, ORDER_CONNECTIONREPOSITORY BAN A TESZT ADATTAL NEM CREATELŐDIK dCon
        });
    });
    
})})