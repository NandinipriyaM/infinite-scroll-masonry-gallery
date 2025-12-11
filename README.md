# infinite-scroll-masonry-gallery
📸 Infinite Scroll Masonry Photo Gallery
A modern, responsive photo gallery application built using React and the Unsplash API.
The app includes infinite scroll, filtering, favorites, a modal viewer, and a polished UI.

🌐 Live Demo
🔗 Deployed App:
👉 https://your-vercel-deployed-url.vercel.app/
(Replace with your real Vercel URL)

✨ Features
🔄 Infinite Scroll
Automatically loads more photos using IntersectionObserver.

🧱 Masonry Grid
Pinterest-style responsive grid created using react-masonry-css.

🔍 Debounced Search
Search photos with a 500ms debounce for smooth performance.

📐 Orientation Filter
Filter photos by:

Landscape

Portrait

Square

All

❤️ Favorites System
Add or remove favorites

Favorites stored in localStorage

"Show Favorites" mode

🪟 Modal & Download
Click an image to open a modal

Download full-resolution images

🐢 Lazy Loading
Improves performance — loads images only when visible.

📱 Fully Responsive
Optimized for mobile, tablet, and desktop screens.

🛠️ Tech Stack
Purpose	Technology
Frontend	React (Create React App)
API	Unsplash API
Layout	react-masonry-css
Modal	ReactModal
State	React Hooks + localStorage
Deployment	Vercel

📂 Project Structure
infinite-scroll-masonry-gallery/
│
├── public/
│   ├── gallery_logo.png
│   ├── index.html
│   └── manifest.json
│
├── src/
│   ├── components/
│   │   └── Gallery/
│   │       ├── Gallery.js
│   │       └── gallery.css
│   │
│   ├── services/
│   │   └── unsplash.js
│   │
│   ├── App.css
│   ├── App.js
│   ├── App.test.js
│   ├── index.css
│   ├── index.js
│   └── reportWebVitals.js   ← *REMOVE THIS FILE*
│
├── .gitignore
├── README.md
├── package-lock.json
└── package.json

⚙️ Setup Instructions
1️⃣ Clone the Repository
sh
Copy code
git clone https://github.com/NandinipriyaM/infinite-scroll-masonry-gallery
cd infinite-scroll-masonry-gallery
2️⃣ Install Dependencies
sh
Copy code
npm install
🔑 Unsplash API Setup
Create a file named:
.env.local

Add your Unsplash Access Key:

ini
Copy code
REACT_APP_UNSPLASH_ACCESS_KEY=your_unsplash_access_key
Restart the dev server:

npm start
▶️ Running the App
Development Mode

npm start
Production Build

npm run build
🚀 Deployment (Vercel)
Go to https://vercel.com

Click "Add New Project"

Import your GitHub repository

Add environment variable:

ini

REACT_APP_UNSPLASH_ACCESS_KEY=your_access_key
Click Deploy

Vercel will provide a public URL automatically

🎥 Demo Video (Required for Submission)
Record a 2–4 minute demo showing:

Search

Infinite scrolling

Orientation filter

Adding/removing favorites

Viewing favorites

Opening modal

Download

Responsive behavior (mobile/tablet/desktop)

Upload to YouTube / Loom.

Add the link here:

🎬 Demo Video:
https://your-video-link.com

📸 Screenshots (Required)
Create a folder:

bash
Copy code
/screenshots
Add these files:

desktop.png

tablet.png

mobile.png

Example:

📱 Mobile

📟 Tablet

🖥️ Desktop

