 # Express App

This is a fullstack MERN application that allows users to share photos and videos. 

## Step-by-step Explanation

### Step 1: Create a New React Project

```
npx create-react-app insta-sam
cd insta-sam
```

### Step 2: Install the Necessary Packages

```
npm install express multer sharp prisma aws-sdk dotenv
npm install @prisma/client
npm install @aws-sdk/client-s3
npm install @aws-sdk/cloudfront-signer
npm install @aws-sdk/s3-request-presigner
```

### Step 3: Configure the Express Server

Create a new file called `server.js` in the `src` directory.

```javascript
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
      url: `https://d2dtamhdsalhdj.cloudfront.net/${post.imageName}`
    });
    post.imageUrl = signedUrl;
  }
  res.send(posts)
})

app.post('/api/posts', upload.single('image'), async (req, res) => {
  const file = req.file
  const caption = req.body.caption
  const imageName
```



 # Front End 

### Step 1: Install dependencies

```sh
npm install
```

### Step 2: Run the development server

```sh
npm run dev
```

### Step 3: Open http://localhost:3000 in your browser

### Step 4: Explore the codebase

The codebase is structured as follows:

* `react/package.json`: The package.json file for the React app.
* `react/postcss.config.js`: The PostCSS configuration file for the React app.
* `react/src/components/NavBar.jsx`: The navigation bar component for the React app.
* `react/src/components/pages/Home.jsx`: The home page component for the React app.
* `react/src/components/pages/NewPost.jsx`: The new post page component for the React app.
* `react/src/components/SinglePost.jsx`: The single post component for the React app.
* `react/src/index.css`: The main CSS file for the React app.
* `react/src/Layout.jsx`: The layout component for the React app.
* `react/src/main.jsx`: The main component for the React app.
* `react/tailwind.config.js`: The Tailwind CSS configuration file for the React app.
* `react/vite.config.js`: The Vite configuration file for the React app.

### Step 5: Make changes to the codebase

Make some changes to the codebase, such as changing the text of the navigation bar or adding a new post.

### Step 6: See your changes reflected in the browser

Your changes will be reflected in the browser automatically.

### Step 7: Deploy your app to production

Once you are happy with your changes, you can deploy your app to production.

### Conclusion

This guide has shown you how to create a simple React app using Vite. You can now use this knowledge to create your own React apps.
