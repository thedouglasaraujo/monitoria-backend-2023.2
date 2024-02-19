import { Router } from "express";
import { prisma } from "../prisma.js";
import * as uuid from 'uuid';
import express from "express";
import multer from 'multer';

export const postRouter = Router();

postRouter.use(express.json());
postRouter.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

postRouter.post("", upload.single('filename'), async (req, res) => {
    try {
        const { description, authorId } = req.body;

        if (!description) {
            return res.status(400).json({ error: "A descrição é obrigatória." });
        }

        const filename = req.file.filename;

        const newPost = await prisma.post.create({
            data: {
                id: uuid.v4(),
                description,
                filename,
                authorId
            }
        });

        res.json(newPost);
    } catch (error) {
        console.error("Houve um problema ao criar a postagem:", error);
        res.status(500).json({ error: "Houve um problema ao criar a postagem", details: error.message });
    }
});

postRouter.get("/", async (req, res) => {
    try {
        const posts = await prisma.post.findMany();
        res.json(posts);
    } catch (error) {
        console.error("Ocorreu um erro ao recuperar as postagens:", error);
        res.status(500).json({ error: "Ocorreu um erro ao recuperar as postagens", details: error.message });
    }
});

postRouter.get("/:id", async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await prisma.post.findUnique({
            where: {
                id: postId,
            },
        });

        if (!post) {
            res.status(404).json({ error: "Não foi possível encontrar a postagem" });
        } else {
            res.json(post);
        }
    } catch (error) {
        console.error("Ocorreu um erro ao acessar a postagem:", error);
        res.status(500).json({ error: "Ocorreu um erro ao acessar a postagem", details: error.message });
    }
});
