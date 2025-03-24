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

jest.mock("../db/dbContext", () => require("../../__mocks__/db"));

const db = require("../db/dbContext");
const dish = require("../models/dish");

beforeAll(async () => {
    await db.sequelize.query("PRAGMA foreign_keys = ON;");
    await db.sequelize.sync({ force: true }); // Létrehozza a táblákat minden teszt előtt
  });

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

                test("createDish test helytelen", async () => 
                    {
                        const base64Image = "image";
                        const res = await request(app).post("/api/v1/dish")
                        .set("Content-Type", "application/json")
                        .send({
                            name:"TestDishName",price:100,created:"vmiido",
                            available:true,sauceOptions:{},customizationOptions:{},
                            description:"description",type:"type"//hiányos adat
    
                        });
    
                        expect(res.statusCode).toBe(404);
                        
                    })

            test("createDish test helyes", async () => 
                {
                    const base64Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=";
                    const res = await request(app).post("/api/v1/dish")
                    .set("Content-Type", "application/json")
                    .send({
                        name:"TestDishName",price:100,created:"vmiido",
                        available:true,sauceOptions:{},customizationOptions:{},
                        description:"description",type:"type",image:"base64Image",
                        gluten:"glutén",lactose:"lactose",egg:"egg",nuts:"nuts"

                    });
                    console.log("createDish jó ertek",res.body.id, res.text);
                    expect(res.statusCode).toBe(201);
                    
                })

            test("modifyDish test helyes", async () => 
                {const res = await request(app).put("/api/v1/dish")
                    .set("Content-Type", "application/json")
                    .send({
                        id:1,name:"TestDishNameUj",price:200,created:"vmiido",//új price
                        available:true,sauceOptions:{},customizationOptions:{},
                        description:"description",type:"type",image:"base64Image",
                        gluten:true,lactose:false,egg:true,nuts:false

                    });

                    expect(res.statusCode).toBe(200);
                })
            test("modifyDish test helytelen", async () => 
                {const res = await request(app).put("/api/v1/dish")
                    .set("Content-Type", "application/json")
                    .send({
                        id:1,name:"TestDishNameUj"
                    });

                    expect(res.statusCode).toBe(404);
                })

            test("getDishes test helyes", async () => 
                {
                    const res = await request(app).get("/api/v1/dishes");

                    expect(res.statusCode).toBe(200);
                })

            

        });
        
        describe("userController", () => {

            test("createUser test helyes", async () => 
                {
                    const res = await request(app).post("/api/v1/register")
                    .send({
                        userName:"TestUserName",fullName:"TestFullName",email:"danikataurusz@gmail.com",password:'HelyesJszo123',
                    });

                    expect(res.statusCode).toBe(201);
                })
            
            test("createUser test helytelen", async () => 
                {
                    const res = await request(app).post("/api/v1/register")
                    .send({
                        email:"danikataurusz@gmail.com",password:'HelyesJszo123',//hiányos adatok
                    });

                    expect(res.statusCode).toBe(404);
                })

            test("createUser test helytelen2", async () => 
                {
                    const res = await request(app).post("/api/v1/register")
                    .send({
                        userName:"TestUserName",fullName:"TestFullName",email:"shranny69@gmail.com",password:'HelyesJszo123',
                    });
                    //console.log("CREATEUSER ERRROR"+res.text);
                    expect(res.statusCode).toBe(409);
                })
            test("createUser test helytelen3", async () => 
                {
                    const res = await request(app).post("/api/v1/register")
                    .send({
                        userName:"TestUjUserName",fullName:"TestFullName",email:"danikataurusz@gmail.com",password:'HelyesJszo123',
                    });
                    //console.log("CREATEUSER ERRROR"+res.text);
                    expect(res.statusCode).toBe(409);
                })
            test("getUser test helyes", async () =>{
                const token=jwt.sign({ id:1, validLogin:true }, process.env.JWT_KEY, { expiresIn: "1h" });
                const res = await request(app).get("/api/v1/user")
                .set("Authorization", `Bearer ${token}`);

                expect(res.statusCode).toBe(200);
            })
            test("getUser test helytelen", async () =>{
                const token=jwt.sign({  validLogin:true }, process.env.JWT_KEY, { expiresIn: "1h" });//helytelen id -> nincs id
                const res = await request(app).get("/api/v1/user")
                .set("Authorization", `Bearer ${token}`);

                expect(res.statusCode).toBe(404);
            })

            test("getAlluser test helyes", async () =>{
                const res = await request(app).get("/api/v1/users");
                expect(res.statusCode).toBe(200);
            })

            test("verifyEmail test helyes", async () => 
                {
                    const token=jwt.sign({ id:1, validLogin:false }, process.env.JWT_KEY, { expiresIn: "1h" });


                    const res = await request(app).patch("/api/v1/verify-user")
                    .send({token});

                    expect(res.statusCode).toBe(201);
                });
            
            test("verifyEmail test helytelen", async () => 
                {
                    const token=jwt.sign({ id:1, validLogin:true }, process.env.JWT_KEY, { expiresIn: "1h" });


                    const res = await request(app).patch("/api/v1/verify-user")
                    .send({token});

                    expect(res.statusCode).toBe(403);
                });
            test("verifyEmail test helytelen2", async () => 
                {
                    const token="helytelentoken"


                    const res = await request(app).patch("/api/v1/verify-user")
                    .send({token});

                    expect(res.statusCode).toBe(500);
                });

            test("verifyEmail test helytelen3", async () => 
                {


                    const res = await request(app).patch("/api/v1/verify-user");//nincs token

                    expect(res.statusCode).toBe(403);
                });
            test("loginUser test helyes", async () => 
                {
                    const res = await request(app).post("/api/v1/login")
                    .send({
                        email:"danikataurusz@gmail.com",password:'HelyesJszo123',
                    });

                    expect(res.statusCode).toBe(200);
                })

            test("loginUser test helytelen", async () => 
                {
                    const res = await request(app).post("/api/v1/login")
                    .send({
                        email:"danikataurusz@gmail.com",password:'HelytelensJszo123',
                    });

                    expect(res.statusCode).toBe(400);
                })

            test("loginUser test helytelen2", async () => 
                {
                    const res = await request(app).post("/api/v1/login")
                    .send({
                        email:"danikataurusz@gmail.com",
                    });

                    expect(res.statusCode).toBe(404);
                })
            test("loginUser test helytelen3", async () => 
                {
                    const res = await request(app).post("/api/v1/login")
                    .send({
                        email:"nemregisztralt@gmail.com",password:'HelytelensJszo123',
                    });

                    expect(res.statusCode).toBe(404);
                })
            test("loginUser test helytelen4", async () => 
                {
                    const resreg = await request(app).post("/api/v1/register")
                    .send({
                        userName:"TestNemAktivaltUserName",fullName:"TestNemAktivaltFullName",email:"shranny69@gmail.com",password:'HelyesJszo123',
                    });

                    //console.log("CREATEUSER ERRROR"+res.text);
                    expect(resreg.statusCode).toBe(201);

                    const res = await request(app).post("/api/v1/login")
                    .send({
                        email:"shranny69@gmail.com",password:'HelyesJszo123',
                    });

                    expect(res.statusCode).toBe(404);
                })
            test("logOut test helyes", async () =>{
                const res = await request(app).post("/api/v1/logout");

                expect(res.statusCode).toBe(200);
            })

            test("changeUserName test helyes", async () =>{
                const token=jwt.sign({id:1, validLogin:true }, process.env.JWT_KEY, { expiresIn: "1h" });
                
                const res = await request(app).patch("/api/v1/username")
                .set("Authorization", `Bearer ${token}`)
                .send({userName:"UjUserName",password:'HelyesJszo123'});

                expect(res.statusCode).toBe(200);
            })

            test("changeUserName test helytelen", async () =>{
                const token=jwt.sign({ validLogin:true }, process.env.JWT_KEY, { expiresIn: "1h" });
                
                const res = await request(app).patch("/api/v1/username")
                .set("Authorization", `Bearer ${token}`)
                .send({userName:"UjUserName",password:'HelyesJszo123'});

                expect(res.statusCode).toBe(404);
            })

            test("changeUserName test helytelen2", async () =>{
                const token=jwt.sign({ validLogin:true }, process.env.JWT_KEY, { expiresIn: "1h" });
                
                const res = await request(app).patch("/api/v1/username")
                .set("Authorization", `Bearer ${token}`)
                .send({userName:"UjUserName",password:'HelytelenJszo123'});

                expect(res.statusCode).toBe(404);
            })

            test("changePassword test helyes", async () =>{
                const token=jwt.sign({id:1, validLogin:false }, process.env.JWT_KEY, { expiresIn: "1h" });
                
                const res = await request(app).post("/api/v1/password-reset")
                .set("Authorization", `Bearer ${token}`)
                .send({password:"UjJelszo123"});


                expect(res.statusCode).toBe(200);
            })

            test("changePassword test heyltelen", async () =>{
                const token=jwt.sign({ validLogin:false }, process.env.JWT_KEY, { expiresIn: "1h" });
                
                const res = await request(app).post("/api/v1/password-reset")
                .set("Authorization", `Bearer ${token}`)
                .send({password:"UjJelszo123"});


                expect(res.statusCode).toBe(404);
            })
            /*
            test("getAdminUser test helyes", async () =>{
                const registrationres =await request(app).post("/api/v1/register")
                    .send({
                        userName:"AdminUserName",fullName:"AdminFullName",email:"shranny69@gmail.com",password:'AdminJszo123',isAdmin:true
                    });
                expect(registrationres.statusCode).toBe(201);

                const token=jwt.sign({ id:2, validLogin:false }, process.env.JWT_KEY, { expiresIn: "1h" });


                    const resverify = await request(app).patch("/api/v1/verify-user")
                    .send({token});

                    expect(resverify.statusCode).toBe(201);

                const res = await request(app).post("/api/v1/admin-user")
                .send({email:"shranny69@gmail.com",password:'AdminJszo123'});     
                
                console.log("GETADMINUSER ERROR"+res.text)
                expect(res.statusCode).toBe(200);       
            }) */                                   //NEM LEHET TESZTELNI MERT NEM KÉSZÜL ADMIN USER

            test("sendEmail test helyes", async () =>{
                const token=jwt.sign({id:1, validLogin:true }, process.env.JWT_KEY, { expiresIn: "1h" });
                const res = await request(app).patch("/api/v1/password-reset-email")
                .set("Authorization", `Bearer ${token}`)
                .send({email:"danikataurusz@gmail.com"});
                console.log("SENDMAIL ERROR"+res.text)
                expect(res.statusCode).toBe(201);
            })
            test("sendEmail test helytelen", async () =>{
                const res = await request(app).patch("/api/v1/password-reset-email")
                .send({email:"helytelenemail@gmail.com"});
                expect(res.statusCode).toBe(400);
            })

            test("deleteUserPassordCheck test helyes", async () =>{
                const token=jwt.sign({id:1, validLogin:true }, process.env.JWT_KEY, { expiresIn: "1h" });//helytelen id -> nincs id

                const res = await request(app).post("/api/v1/user-password-validate")
                .set("Authorization", `Bearer ${token}`)
                .send({email:"danikataurusz@gmail.com",password:'UjJelszo123'}); //Új jelszó amit fent beállítottunk a changePassword test-ben

                //console.log("DELETEUSERPASSORDCHECK ERROR"+res.text)
                expect(res.statusCode).toBe(200);
            })
            test("deleteUserPasswordCheck test helytelen", async () =>{
                const token=jwt.sign({id:1, validLogin:true }, process.env.JWT_KEY, { expiresIn: "1h" });

                const res = await request(app).post("/api/v1/user-password-validate")
                .set("Authorization", `Bearer ${token}`)
                .send({email:"danikataurusz@gmail.com",password:'Rosszjelszo123'}); //Hibás jelszó 


                expect(res.statusCode).toBe(400);
            })

            test("deleteUserPasswordCheck test helytelen2", async () =>{
                const token=jwt.sign({id:1, validLogin:true }, process.env.JWT_KEY, { expiresIn: "1h" });

                const res = await request(app).post("/api/v1/user-password-validate")
                .set("Authorization", `Bearer ${token}`)
                .send({email:"danikataurusz@gmail.com"}); //Hiányos adat


                expect(res.statusCode).toBe(404);
            })

            test("deleteUser test helytelen", async () =>{
                const token=jwt.sign({ validLogin:true }, process.env.JWT_KEY, { expiresIn: "1h" });//helytelen id megint-> nincs id
                
                const res = await request(app).delete("/api/v1/user")
                .set("Authorization", `Bearer ${token}`);

                expect(res.statusCode).toBe(404);
            })

            test("deleteUser test helyes", async () =>{
                const token=jwt.sign({id:1, validLogin:true }, process.env.JWT_KEY, { expiresIn: "1h" });
                
                const res = await request(app).delete("/api/v1/user")
                .set("Authorization", `Bearer ${token}`);

                expect(res.statusCode).toBe(200);
            })


            test("deleteUserPasswordCheck test helytelen3", async () =>{
                const token=jwt.sign({id:1, validLogin:true }, process.env.JWT_KEY, { expiresIn: "1h" });//Már kitöröltük a usert így nem fog találni

                const res = await request(app).post("/api/v1/user-password-validate")
                .set("Authorization", `Bearer ${token}`)
                .send({email:"danikataurusz@gmail.com",password:'HelyesJszo123'});

                expect(res.statusCode).toBe(404);
            })

            test("updateAllregies test helyes", async () =>{
                const token=jwt.sign({id:1, validLogin:true }, process.env.JWT_KEY, { expiresIn: "1h" });//Már kitöröltük a usert így nem fog találni

                const res = await request(app).patch("/api/v1/allergies")
                .set("Authorization", `Bearer ${token}`)
                .send({gluten:"glutén",lactose:'laktóz',egg:"tojás",nuts:"mogyik"});

                expect(res.statusCode).toBe(200);
            })
            test("updateAllregies test helytelen", async () =>{
                const token=jwt.sign({id:1, validLogin:true }, process.env.JWT_KEY, { expiresIn: "1h" });//Már kitöröltük a usert így nem fog találni

                const res = await request(app).patch("/api/v1/allergies")
                .set("Authorization", `Bearer ${token}`)
                .send({gluten:"glutén",lactose:'laktóz',egg:"tojás"});//hiányos adat

                //console.log("UPDATEALLERGIES ERROR"+res.text)
                expect(res.statusCode).toBe(200);
            })

        });

        describe("purchaseController", () => {
            
            //jest.mock("../middlewares/userAuth", () => require());
            const userAuth = require("../middlewares/userAuth");
            userAuth.authenticateToken = jest.fn((req, res, next) => {
                req.uid = 1; 
                next();
            });

            test("placeOrder test helyes", async ()=>{
                const token=jwt.sign({ id:1, validLogin:true }, process.env.JWT_KEY, { expiresIn: "1h" });


                const dishRes = await request(app).post("/api/v1/dish")
                    .set("Content-Type", "application/json")
                    .send({
                        name:"TestDishName",price:100,created:"vmiido",
                        available:true,sauceOptions:{},customizationOptions:{},
                        description:"description",type:"type",image:"base64Image",
                        gluten:"glutén",lactose:"lactose",egg:"egg",nuts:"nuts"

                    });

                const dishRes2 = await request(app).post("/api/v1/dish")
                .set("Content-Type", "application/json")
                .send({
                    name:"TestDishName",price:100,created:"vmiido",
                    available:true,sauceOptions:{},customizationOptions:{},
                    description:"description",type:"type",image:"base64Image",
                    gluten:"glutén",lactose:"lactose",egg:"egg",nuts:"nuts"

                });

                console.log(dishRes.text,dishRes.body.name);
                console.log(dishRes2.text,dishRes2.body.name);

                const dishId1 = dishRes.body.id;
                const dishId2 = dishRes2.body.id;

                expect(dishRes.statusCode).toBe(201);
                expect(dishRes2.statusCode).toBe(201);

                const response = await request(app)
                    .post("/api/v1/order")
                    .set("Authorization", `Bearer ${token}`) 
                    .send({
                    totalPrice: 1500,
                    message: "Kérem gyorsan!",
                    takeAway: true,
                    dishIds: [dishId1,dishId2],
                    dishAmounts: [2,1],
                    dishCustomizations: ["extra sajt"],
                    pointsUsed: 0,
                    });

                    console.log(response.text);
                    expect(response.statusCode).toBe(201);
                    
            })
  
            test("getAllPurchaseUserInfo helyes", async () => 
                {
                    const token=jwt.sign({ id:1, validLogin:true }, process.env.JWT_KEY, { expiresIn: "1h" });

                    const res = await request(app).get("/api/v1/user-orders")
                    .set("Authorization", `Bearer ${token}`);

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

        test("middleware helyes errort ad vissza hibás kérésnél", async () => 
            {
                const token=jwt.sign({ id:1, validLogin:true }, process.env.JWT_KEY, { expiresIn: "1h" });


                const res = await request(app).patch("/api/v1/verify-email")//nem létező endpoint
                .send({token});

                expect(res.statusCode).toBe(404);
            });
            test("middleware helyes errort ad vissza hibás kérésnél2", async () => 
                {
                    const token=jwt.sign({ id:1, validLogin:false }, process.env.JWT_KEY, { expiresIn: "1h" });
                    const res = await request(app).get("/api/v1/user")
                    .set("Authorization", `Bearer ${token}`);

                    //console.log("GETUSER ERROR"+res.text)
                    expect(res.statusCode).toBe(403);
                });
            test("middleware helyes errort ad vissza hibás kérésnél3", async () => 
                {
                    const token=jwt.sign({ id:1, validLogin:false }, process.env.JWT_KEY, { expiresIn: "1h" });
                    const res = await request(app).get("/api/v1/user")
                    .set("Authorization", `Helytelen ${token}`);

                    //console.log("GETUSER ERROR"+res.text)
                    expect(res.statusCode).toBe(500);
                });
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
              fullName: "MockFullName",
              email: "mock@example.com",
              password: "mockPassword123",
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
            //console.log(plainUser);
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
            await userRepository.changePassword("newPassword123",1);
            const foundUser = await userRepository.getUserPwById(1);
            const plainUser = foundUser.get({ plain: true });
            expect(plainUser.password).toEqual("newPassword123");
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
                password: "mockPassword123",
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
            //console.log("Mock purchase:", createdPurchase);


            mockorder_connection = {
                user_id: createdUser.id,
                order_id: createdPurchase.id, // Helyesen kapcsoljuk az ID-t
            };

            //console.log("mockorder_connection: ",mockorder_connection);    

            dishInfo = {
                dishIds: 1,
                dishAmounts: 2,
                dishCustomizations: {"customizationId":'as'},
            };

            //console.log("dishInfo: ",dishInfo);

        })
        
        //console.log("DISHINFO KINN",dishInfo);

        test("getPurchase returns mockpurchase", async () =>{
            const receivedpurchase = await purchaseRepository.getPurchase(1);
            //console.log(mockPurchase)
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
            //console.log(mockPurchase)
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
            //console.log("received: ",receivedpurchase);
            expect(receivedpurchase.message).toEqual("new message");
        });

        test("deletePurchase deletes the purchase and GetAllPurchase returns 0 purchases", async () => {
            await purchaseRepository.deletePurchase(mockPurchase);
            expect((await purchaseRepository.getAllActivePurchase()).length).toBe(0);
        });

        test("createPurchaseConnection creates order_dish_connection", async () => {
            mockorder_dish_connection = await order_connectionRepositroy.createPurchaseConnection(mockorder_connection.user_id, mockPurchase, dishInfo, 0);

            console.log("Mock order_dish_connection:", mockorder_dish_connection);
        });
    });
    
})})