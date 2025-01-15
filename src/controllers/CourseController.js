
import Course from '../models/CourseSchema.js'


async function getCourses(req, res) {
    try{
        const allCourses = await Course.find()
        return res.status(200).json(allCourses)
    }catch(err){
        return res.status(500).json({message: 'Não foi possível acessar os cursos', err})
    }
}



async function getOneCourse(req, res) {
    const {courseTitle} = req.query

    try{
        const searchedCourse = await Course.findOne({courseTitle})

        if(!searchedCourse){
            return res.status(404).json({message: 'Curso não encontrado, tenha certeza que digitou o nome certo'})
        }
        
        return res.status(200).json(searchedCourse)
    }catch(err){
        return res.status(500).json({message: 'Ocorreu um erro ao buscar o curso', err})
    }
}


async function getCourseById(req, res) {
    const { id } = req.params

    try {
        const seachedCourse = await Course.findById(id)

        if(!seachedCourse) {
            return res.status(404).json({message: 'Curso não encontrado'})
        }

        return res.status(200).json(seachedCourse)
    }catch(err){
        return res.status(500).json({message: 'Erro ao buscao curso', err})
    }
}


async function getByCategory(req, res) {
    const { category } = req.params

    try {
        const searchedCourse = await Course.find({category: {$regex: category, $options: 'i'}})

        if(searchedCourse.length === 0) {
            return res.status(404).json({message: 'Nenhum curso encontrado com essa categoria'})
        }
        return res.status(200).json(searchedCourse)
    }catch(err) {
        return res.status(500).json({message: 'Ocorreu um erro ao pesquisar pelo curso'})
    }
}


async function creatingCourse(req, res) {
    const {title, description, category, teacherId} = req.body

    try{
        const newCourse = new Course({title, description, category, teacherId})
        await newCourse.save()
        
        return res.status(201).json({message: 'Curso criado com sucesso'})
    }catch(err){
        return res.status(500).json({message: 'Não foi possível criar curso', err})
    }
}


async function updateCourse(req, res) {
    const {id} = req.params
    const {title, description, category} = req.body

    try{
        const updates = {}
        if(title) updates.title = title
        if(description) updates.description = description
        if(category) updates.category = category

        // Garantindo que ao menos um campo foi enviado
        if(Object.keys(updates).length === 0) {
            return res.status(400).json({message: 'Nenhum campo para atualizar foi fornecido'})
        }

        // Atualizando curso
        const updatedCourse = await Course.findByIdAndUpdate(id, updates, {new: true, runValidators: true})

        if(!updatedCourse){
            return res.status(404).json({message: 'Curso não encontrado'})
        }

        return res.status(200).json({message: 'Curso atualizado com sucesso', course: updatedCourse})
    }catch(err) {
        return res.status(500).json({message: 'Erro ao atualizar curso', error: err.message})
    }
}


async function deleteCourse(req, res) {
    const {id} = req.params
    const {title, description, category} = req.body

    try{
        const updates = {}
        if(title) updates.title = title
        if(description) updates.description = description
        if(category) updates.category = category

        // Garantindo que ao menos um campo foi enviado
        if(Object.keys(updates).length === 0) {
            return res.status(400).json({message: 'Nenhum campo para atualizar foi fornecido'})
        }

        // Atualizando curso
        const updatedCourse = await Course.findByIdAndUpdate(id, updates, {new: true, runValidators: true})

        if(!updatedCourse){
            return res.status(404).json({message: 'Curso não encontrado'})
        }

        return res.status(200).json({message: 'Curso atualizado com sucesso', course: updatedCourse})
    }catch(err) {
        return res.status(500).json({message: 'Erro ao atualizar curso', error: err.message})
    }
}


export { getCourses, getOneCourse, getCourseById, getByCategory, creatingCourse, updateCourse, deleteCourse }