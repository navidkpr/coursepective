require('dotenv').config()

const AppConfig = {
    Database: {
        Host: process.env.DATABASE_HOST,
        Port: parseInt(process.env.DATABASE_PORT),
        User: process.env.DATABASE_USER,
        Password: process.env.DATABASE_PASSWORD,
        DB: process.env.DATABASE_DB,
        SSL: true
    }
}

export default AppConfig