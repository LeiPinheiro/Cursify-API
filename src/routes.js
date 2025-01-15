import { Router } from 'express'
import { createUser, getUsers, getUserById, getUserByName, userLogin, userDelete, updatingUser, authToken } from './controllers/UserController.js'
import { getCourses, getOneCourse, getCourseById, getByCategory, creatingCourse, updateCourse, deleteCourse } from './controllers/CourseController.js'
import { getVideos, getOneVideo, getVideoByTitle, addVideo, deleteVideo, updateVideo } from './controllers/VideoController.js'

const routes = Router()

// Users section
routes.get('/users', getUsers)
routes.get('/users/:name', getUserByName)
routes.get('/user/:id', getUserById)
routes.post('/adduser', createUser)
routes.post('/login', userLogin)
routes.delete('/user/:id', userDelete)
routes.patch('/upduser', updatingUser)

// Course section
routes.get('/courses', getCourses)
routes.get('/course', getOneCourse)
routes.get('/course/:id', getCourseById)
routes.get('/course/category/:category', getByCategory)
routes.post('/addcourse', creatingCourse)
routes.patch('/course/:id', updateCourse)
routes.delete('/course/:id', deleteCourse)

// Videos section
routes.get('/videos', getVideos)
routes.get('/video/:id', getOneVideo)
routes.get('/video/title/:title', getVideoByTitle)
routes.post('/addvideo', addVideo)
routes.delete('/video/:id', deleteVideo)
routes.patch('/updvideo', updateVideo)


export default routes