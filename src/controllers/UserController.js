import User from '../models/UserSchema.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import 'dotenv/config'




async function getUsers(req, res){
    try {
        const allUsers = await User.find();
        return res.status(200).json(allUsers);
    } catch (err) {
        return res.status(404).json({ message: 'Não foi possível achar usuários', err });
    }
}


async function getUserById(req, res) {
    const { id } = req.params

    try{
        const seachedUser = await User.findById(id)

        if(!seachedUser) {
            return res.status(404).json({message: 'Usuário não encontrado'})
        }
        return res.status(200).json(seachedUser)
    }catch(err) {
        return res.status(500).json({message: 'Ocorreu um erro ao pesquisar por usuário', err})
    }
}


async function getUserByName(req, res) {
    const { name } = req.params

    try{
        const seachedUsers = await User.find({name: {$regex: name, $options: 'i'}})
        
        if(seachedUsers.length === 0) {
            return res.status(404).json({message: 'Nenhum usuário encontrado com esse nome'})
        }

        return res.status(200).json(seachedUsers)
    }catch(err){
        return res.status(500).json({message: 'Ocorreu um erro ao pesquisar por usuários'})
    }
}


async function createUser(req, res){
    const { name, email, password, role } = req.body;

    try {
        const sameEmail = await User.findOne({ email: email });

        if (sameEmail) {
            return res.status(400).json({ message: 'Este email já está sendo usado por outra pessoa' });
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = new User({ name, email, password: hashedPassword, role });
            await newUser.save();

            return res.status(201).json({ message: 'Usuário criado com sucesso!', newUser });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Não foi possível criar usuário', err });
    }
}


async function userLogin(req, res) {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Senha incorreta' });
        }
        // Gerando token
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );
        // Retornando token pro usuário
        return res.status(200).json({ message: 'Login bem-sucedido', token });
    } catch (err) {
        return res.status(500).json({ message: 'Erro ao tentar fazer login', err });
    }
}


async function userDelete(req, res){
    const id = req.params.id
    try{
        const deletedUser = await User.findByIdAndDelete(id)
        if(!deletedUser) {
            return res.status(404).json({message: 'Usuário não encontrado'})
        }
        return res.status(200).json({message: 'Usuário deletado com sucesso!', deletedUser})
    }catch(err) {
        return res.status(500).json({message: 'Erro ao deletar usuário', err})
    }
}


async function updatingUser(req, res) {
    const {newName, newPassword} = req.body
    const {id} = req.params

    try{
        const updateData = {}
        
        if(newName) { 
            updateData.name = newName
        }

        if(newPassword){
            updateData.password = newPassword
        }

        const updatedUser = await User.findByIdAndUpdate(id, updateData, {new: true})

        if(!updatedUser) {
            return res.status(404).json({message: 'Usuário não encontrado'})
        }
        
        return res.status(200).json({message: 'Nome de usuário atualizado com sucesso', user: updateData})
    }catch(err){
        return res.status(500).json({message: 'Erro ao atualizar usuário'})
    }
}


// JWT SECTION

// Checking token
function authToken(req, res, next) {
    const authHeader = req.headers['authorization']

    const token = authHeader && authHeader.split(' ')[1]

    if(!token) {
        return res.status(403).json({message: 'Token não fornecido'})
    }
    
    try{
        const decoded = jwt.verify(token, process.env.SECRET_KEY)

        req.user = decoded

        next()
    }catch(err){
        return res.status(401).json({message: 'Token inválido', err})
    }
}

export { createUser, getUsers, getUserById, getUserByName, userLogin, userDelete, updatingUser, authToken}