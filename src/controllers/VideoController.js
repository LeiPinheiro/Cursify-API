import Video from '../models/VideoSchema.js'

async function getVideos(req, res) {
    try{
        const allVideos = await Video.find()

        if(!allVideos) {
            return res.status(404).json({message: 'Vídeos não encontrados'})
        }

        return res.status(200).json(allVideos)
    }catch(err){
        return res.status(500).json({message: 'Ocorreu um erro no servidor', err})
    }
}

async function getOneVideo(req, res) {
    const id = req.params.id

    try{
        const video = await Video.findById({id})

        if(!video){
            return res.status(404).json({message: 'Vídeo não encontrado'})
        }
    
        return res.status(200).json(video)
    }catch(err){
        return res.status(500).json({message: 'Ocorreu um erro no servidor', err})
    }
}

async function getVideoByTitle(req, res) {
    const { title } = req.params

    try {
        const searchedVideo = await Video.find({title: {$regex: title, $options: 'i'}})

        if(searchedVideo.length === 0) {
            return res.status(404).json({message: 'Não foi possível encontrar um vídeo com esse nome'})
        }
        return res.status(200).json(searchedVideo)
    }catch(err) {
        return res.status(500).json({message: 'Ocorreu um erro ao pesquisar por vídeo', err})
    }
}

async function addVideo(req, res) {
    const {title, description, courseId, videoUrl} = req.body

    try{
        const addedVideo = new Video({title, description, courseId, videoUrl})
        await addedVideo.save()

        if(!addedVideo) {
            return res.status(404).json({message: 'Não foi possivel adicionar o vídeo'})
        }

        return res.status(201).json({message: 'Vídeo adicionado com sucesso'})
    }catch(err){
        return res.status(500).json({message: 'Ocorreu um erro ao adicionar o vídeo', err})
    }
}

async function deleteVideo(req, res) {
    const id = req.params.id

    try{
        const deletedVideo = await Video.findByIdAndDelete(id)

        if(!deletedVideo) {
            return res.status(404).json({message: 'Vídeo não encontrado'})
        }

        return res.status(200).json({message: 'Vídeo deletado com sucesso!'})
    }catch(err) {
        return res.status(500).json({message: 'Ocorreu um erro ao deletar o vídeo', err})
    }
}

async function updateVideo(req, res) {
    const {id} = req.params
    const {title, description, videoUrl} = req.body

    try{
        const updates = {}
        if(title) updates.title = title
        if(description) updates.description = description
        if(videoUrl) updates.videoUrl = videoUrl

        if(Object.keys(updates).length === 0){
            return res.status(400).json({message: 'Nenhum campo para atualizar foi fornecido'})
        }

        const updatedVideo = await Video.findByIdAndUpdate(id, updates, {new: true, runValidators: true})

        if(!updatedVideo) {
            return res.status(404).json({message: 'Vídeo não encontrado'})
        }

        return res.status(200).json({message: 'Curso atualizado com sucesso.', course: updatedVideo})
        
    }catch(err){
        return res.status(500).json({message: 'Erro ao atualizar vídeo', error: err.message})
    }
}

export { getVideos, getOneVideo, getVideoByTitle, addVideo, deleteVideo, updateVideo }