const {Router} = require('express')
const fs = require('fs')
const path = require('path')
const File = require('../models/file')
const router = Router()

// Загрузка файла
router.post("/upload", async (req, res) => {
    try {
        if(!req.file) {
            res.json({
                message: 'Uploading error'
            })
        }
        else {
            const file = await File.create({
                title: req.file.originalname.split('.')[0],
                extension: req.file.originalname.split('.')[1],
                mime_type: req.file.mimetype,
                size: req.file.size,
                path: req.file.path
            })
            res.status(201).json({
                message: 'File uploaded',
                file
            })
        }
    } catch(e) {
        console.error(e)
        res.status(500).json({
            message: 'Server error'
        })
    }
})

// Получение списка файлов
router.get('/list', async (req, res) => {
    try {
        // Постраничный вывод
        const page = req.query.page || 1
        const limit = +req.query.list_size || 10
        const offset = (page - 1) * limit
        const files = await File.findAndCountAll({
            limit,
            offset
        })
        res.status(200).json({files})
    } catch(e) {
        console.error(e)
        res.status(500).json({
            message: 'Server error'
        })
    }
})

// Получение информации об одном файле
router.get('/:id', async (req, res) => {
    try {
        const file = await File.findByPk(+req.params.id)
        res.status(200).json({file})
    } catch(e) {
        console.error(e)
        res.status(500).json({
            message: 'Server error'
        })
    }
})

// Скачивание файла
router.get('/download/:id', async (req, res) => {
    try {
        const file = await File.findByPk(+req.params.id)
        res.download(path.join(__dirname, '../', file.path))
    } catch(e) {
        console.error(e)
        res.status(500).json({
            message: 'Server error'
        })
    }
})

// Обновление файла
router.put('/:id', async (req, res) => {
    try {
        if(!req.file) {
            res.json({
                message: 'Uploading error'
            })
        }
        else {
            const file = await File.findByPk(+req.params.id)
            const filePath = path.join(__dirname, '../', file.path)
            file.title = req.file.originalname.split('.')[0],
            file.extension = req.file.originalname.split('.')[1],
            file.mime_type = req.file.mimetype,
            file.size = req.file.size,
            file.path = req.file.path
            await file.save()
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
            res.status(201).json({
                message: 'File updated'
            })
        }
    } catch(e) {
        console.error(e)
        res.status(500).json({
            message: 'Server error'
        })
    }
})

// Удаление файла
router.delete('/:id', async (req, res) => {
    try {
        const file = await File.findByPk(+req.params.id)
        const filePath = path.join(__dirname, '../', file.path)
        await file.destroy()
        
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
        res.status(200).json({
            message: 'File deleted'
        })
    } catch(e) {
        console.error(e)
        res.status(500).json({
            message: 'Server error'
        })
    }
})

module.exports = router