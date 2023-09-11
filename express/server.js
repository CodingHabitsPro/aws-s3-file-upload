import express from 'express'

import multer from 'multer'
import sharp from 'sharp'
import crypto from 'crypto'

import { PrismaClient } from '@prisma/client'
import { uploadFile, deleteFile, getObjectSignedUrl } from './s3.js'
import { getSignedUrl } from "@aws-sdk/cloudfront-signer"

const app = express()
const prisma = new PrismaClient()

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

app.get("/api/posts", async (req, res) => {
  const posts = await prisma.posts.findMany({orderBy: [{ created: 'desc'}]})
  for (let post of posts) {
    // post.imageUrl = `https://d2dtamhdsalhdj.cloudfront.net/${post.imageName}`

    const signedUrl = getSignedUrl({
      keyPairId: process.env.CLOUDFRONT_KEYPAIR_ID,
      privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
      url: `https://d2dtamhdsalhdj.cloudfront.net/${post.imageName}`,
      dateLessThan: new Date( Date.now() + (1000 /*sec*/ * 60))
    });
    post.imageUrl = signedUrl;
  }
  res.send(posts)
})


app.post('/api/posts', upload.single('image'), async (req, res) => {
  const file = req.file
  const caption = req.body.caption
  const imageName = generateFileName()

  const fileBuffer = await sharp(file.buffer)
    .resize({ height: 1920, width: 1080, fit: "contain" })
    .toBuffer()

  await uploadFile(fileBuffer, imageName, file.mimetype)

  const post = await prisma.posts.create({
    data: {
      imageName,
      caption,
    }
  })
  
  res.status(201).send({})
})

app.delete("/api/posts/:id", async (req, res) => {
  const id = +req.params.id
  const post = await prisma.posts.findUnique({where: {id}}) 

  await deleteFile(post.imageName)

  await prisma.posts.delete({where: {id: post.id}})
  res.send(post)
})

app.listen(process.env.PORT, () => console.log("listening on port 8080"))