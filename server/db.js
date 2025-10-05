import pkg from '@prisma/client'
const { PrismaClient } = pkg

const prisma = new PrismaClient()

// const main = async () => {
    
//     console.log(user)
// }

// main()
// .catch((e) => console.error(e))
// .finally(async () => {
//     await prisma.$disconnect()
// })
 
export default prisma