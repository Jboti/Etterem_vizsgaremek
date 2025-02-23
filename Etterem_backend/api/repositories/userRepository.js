const db = require('../db/dbContext')

class userRepository
{
    constructor(db)
    {
        this.sequelize = db.Sequelize
        this.User = db.user
        this.Allergenable = db.allergenables
        this.Allergy = db.allergy
    }


    async getUser(id)
    {
        return await this.User.findOne(
            {
                where:
                {
                    id: id,
                },
                attributes: ['id','created','userName','fullName','email','points'],
                include: [
                    {
                        model: this.Allergenable,
                        as: 'allergenables',
                        attributes: ['allergenable_type'],
                        include:[
                            {
                                model:this.Allergy,
                                as: 'allergy',
                                attributes: ['name']
                            }
                        ]
                    }
                ]
            })
    }

    async getAllUser()
    {
        return await this.User.findAll({})
    }

    async updateUserName(user)
    {
        await this.User.update(
            {
                userName: user.userName,
            },
            {
                where:
                {
                    id : user.id
                }
            })
    }

    async createUser(user)
    {
        const newUser = await this.User.create(user)
        await newUser.save()
        return newUser
    }

    async deleteUser(id)
    {
        return await this.User.destroy(
            {
                where:
                {
                    id: id
                }
            })
    }

    async verifyEmail(id)
    {
        return await this.User.update(
            {
                isActive: true,
            },
            {
                where:{
                    id:id
                }
            }
        )
    }
    
    async checkForExistinguserName(userName)
    {
        return await this.User.findOne(
            {
                where:
                {
                    userName: userName
                }
            })
    }

    async getUserByEmail(email)
    {
        return await this.User.findOne(
            {
                where:
                {
                    email:email
                }
            })
    }

    async changePassword(password,id)
    {
        return await this.User.update(
            {
                password:password
            },
            {
                where:{
                    id:id
                }
            }
        )
    }

    async changeUserName(userName,id)
    {
        return await this.User.update(
            {
                userName:userName
            },
            {
                where:{
                    id:id
                }
            }
        )
    }

    async getUserPwById(id)
    {
        return await this.User.findOne({
            where:
            {
                id:id
            },
            attributes: ['password']
        })
    }

    async updateAllregies(id,allergies)
    {
        for (const allergyName in allergies) {
            const allergy = await this.Allergy.findOne({
                where: { name: allergyName }
            })
    
            if (allergy) {
                if (allergies[allergyName]) {
                    const existingAllergen = await this.Allergenable.findOne({
                        where: {
                            allergenable_type: 'user',
                            allergenable_id: id,
                            allergen_id: allergy.id
                        }
                    })
                    // Ha az allergia 'true' és nem létezik már a kapcsolat, hozzáadjuk az allergént a User-hez
                    if(!existingAllergen){
                        await this.Allergenable.create({
                            allergenable_type: 'user',
                            allergenable_id: id,
                            allergen_id: allergy.id
                        })
                    }
                } else {
                    // Ha az allergia 'false', töröljük az allergént a User-től
                    await this.Allergenable.destroy({
                        where: {
                            allergenable_type: 'user',
                            allergenable_id: id,
                            allergen_id: allergy.id
                        }
                    })
                }
            }
        }

    }

    async adminUserModify(user)
    {
        return await this.User.update(
            {
                userName: user.userName,
                fullName: user.fullName,
                email: user.email,
                points: user.points,
                isAdmin: user.isAdmin,
                isActive: user.isActive,
            },
            {
                where: { id: user.id },
            }
        )
    }

    async usePoints(id,pointsUsed)
    {
        await this.User.update(
            {
                points: this.sequelize.literal(`points - ${pointsUsed}`)
            },
            {
                where:
                {
                    id : id
                }
            }
        )
    }

}



module.exports = new userRepository(db)