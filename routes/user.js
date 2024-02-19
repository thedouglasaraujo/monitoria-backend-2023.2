import { Router } from "express";
import { prisma } from "../prisma.js";
import * as uuid from 'uuid';

export const userRouter = Router();

userRouter.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.send(users);
});

userRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  res.send(user);
});

userRouter.post("", async (req, res) => {
  const user = await req.body;

  const newUser = await prisma.user.create({
    data: {
      id: uuid.v4(),
      email: user.email,
      name: user.name,
      password: user.password,
    },
  });

  res.send(newUser);
});
