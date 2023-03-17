require('dotenv').config()

const AppConfig = {
    AWS: {
        S3BucketName: process.env.AWS_S3_BUCKET,
        AccessKey: process.env.AWS_ACCESS_KEY,
        SecretAccessKey: process.env.AWS_KEY_SECRET,
    },
    Database: {
        Host: process.env.DATABASE_HOST,
        Port: parseInt(process.env.DATABASE_PORT),
        User: process.env.DATABASE_USER,
        Password: process.env.DATABASE_PASSWORD,
        DB: process.env.DATABASE_DB,
        SSL: true
    },
    Meilisearch: {
        Url: process.env.MEILISEARCH_URL,
        ApiKey: process.env.MEILISEARCH_MASTER_KEY,
    },
}

export default AppConfig