<!DOCTYPE html>
<html>
<head>
    <title>Studio OS Dashboard</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>

<!-- Background Blobs -->
<div class="blob b1"></div>
<div class="blob b2"></div>
<div class="blob b3"></div>

<!-- Header -->
<header class="topbar">
    <h1>🎬 Studio OS</h1>

    <div class="liveStatus">
        <span class="dot"></span>
        LIVE
    </div>

    <div id="clock"></div>
</header>

<!-- Stats -->
<section class="stats">
    <div class="stat-card">
        <h3 id="videoCount">0</h3>
        <p>Videos</p>
    </div>

    <div class="stat-card">
        <h3>Ready</h3>
        <p>Status</p>
    </div>

    <div class="stat-card">
        <h3>Cloud</h3>
        <p>Connected</p>
    </div>
</section>

<div class="studio-grid">

    <div class="panel">

        <h2>Add Media</h2>

        <input id="mediatitle" placeholder="Title">

        <input id="mediaurl" placeholder="Cloudinary / MP4 URL">

        <button onclick="saveMedia()">
            ➕ Add to Library
        </button>

    </div>

    <div class="panel">

        <h2>Media Library</h2>

        <div id="library"></div>

    </div>

    <div class="panel">

        <h2>Live Control</h2>

        <button onclick="goLive()">
            Send Live
        </button>

    </div>

</div>

<script src="studio.js"></script>
<script src="media.js"></script>

</body>
</html>
