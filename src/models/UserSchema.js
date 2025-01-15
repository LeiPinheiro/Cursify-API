import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5
    },
    role: {
        type: String,
        enum: ['student', 'teacher'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}) 

// Middleware para criptografar senha antes de salvar


export default mongoose.model('User', userSchema)