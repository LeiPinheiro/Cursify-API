import mongoose from 'mongoose'
import 'dotenv/config'

// Connecting database and server
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

async function connectDatabase() {
    try {
        await mongoose.connect(
            `mongodb+srv://${dbUser}:${dbPassword}@cluster0.tmitg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
        );
        console.log("Conexão com o banco de dados bem-sucedida!");
    } catch (error) {
        console.error("Erro ao conectar ao banco de dados:", error.message);
    }
}

export default connectDatabase