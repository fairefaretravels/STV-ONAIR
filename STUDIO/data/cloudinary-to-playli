#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

const CLIPS_DIR = process.argv[2] || './clips';
const PLAYLIST_PATH =
  process.argv[3] || './STUDIO/data/cloudinary-to-playlist.json';

const TAG = 'stv-onair';
const VIDEO_EXTENSIONS = new Set(['.mp4', '.mov', '.m4v', '.webm']);

cloudinary.config({
  cloud_name: 'dyqfcbgqo',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

function getVideoFiles(dir) {
  return fs.readdirSync(dir).filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return VIDEO_EXTENSIONS.has(ext);
  });
}

async function uploadClips(files) {
  const uploads = [];

  for (const file of files) {
    const filePath = path.join(CLIPS_DIR, file);

    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'video',
      folder: TAG,
      tags: [TAG],
    });

    uploads.push({
      public_id: result.public_id,
      url: result.secure_url,
      duration: result.duration || 0,
      created_at: result.created_at,
    });

    console.log(`Uploaded: ${file}`);
  }

  return uploads;
}

async function fetchAllTaggedAssets(tag) {
  const result = await cloudinary.search
    .expression(`tags=${tag}`)
    .sort_by('created_at', 'desc')
    .max_results(500)
    .execute();

  return result.resources.map((r) => ({
    public_id: r.public_id,
    url: r.secure_url,
    duration: r.duration || 0,
  }));
}

function writePlaylist(data) {
  const dir = path.dirname(PLAYLIST_PATH);
  fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(PLAYLIST_PATH, JSON.stringify(data, null, 2));

  console.log(`Playlist written → ${PLAYLIST_PATH}`);
}

async function main() {
  try {
    const files = getVideoFiles(CLIPS_DIR);

    if (!files.length) {
      console.log('No video clips found.');
      return;
    }

    console.log(`Found ${files.length} clips`);

    // 1. Upload new clips
    await uploadClips(files);

    // 2. Pull ALL tagged assets (not just this run)
    const playlist = await fetchAllTaggedAssets(TAG);

    // 3. Write unified playlist JSON
    writePlaylist({
      updated_at: new Date().toISOString(),
      tag: TAG,
      count: playlist.length,
      items: playlist,
    });
  } catch (err) {
    console.error('Pipeline failed:', err);
    process.exit(1);
  }
}

main();
