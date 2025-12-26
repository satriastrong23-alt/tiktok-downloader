// TikTok Downloader Script - Simple Version
console.log("TikTok Downloader Ready!");

// Simple API
const API_URL = "https://tikwm.com/api/?url=";

async function downloadVideo() {
    const url = document.getElementById('tiktokUrl').value.trim();
    const loading = document.getElementById('loading');
    const result = document.getElementById('result');
    const error = document.getElementById('error');
    
    // Reset
    hideAll();
    loading.classList.remove('d-none');
    
    // Check URL
    if (!url) {
        showError("Masukkan URL TikTok!");
        return;
    }
    
    if (!url.includes('tiktok.com')) {
        showError("URL harus dari TikTok.com!");
        return;
    }
    
    try {
        // Call API
        const response = await fetch(API_URL + encodeURIComponent(url));
        const data = await response.json();
        
        if (data.code === 0) {
            showResult(data.data);
        } else {
            showError("Video tidak ditemukan!");
        }
    } catch (err) {
        showError("Error: " + err.message);
    } finally {
        loading.classList.add('d-none');
    }
}

function showResult(video) {
    const result = document.getElementById('result');
    const videoInfo = document.getElementById('videoInfo');
    const downloadOptions = document.getElementById('downloadOptions');
    
    // Show video info
    videoInfo.innerHTML = `
        <div class="row">
            <div class="col-md-4">
                <img src="${video.cover}" class="img-fluid rounded" alt="Thumbnail">
            </div>
            <div class="col-md-8">
                <h5>${video.title || 'TikTok Video'}</h5>
                <p><i class="fas fa-user"></i> ${video.author.nickname}</p>
                <p><i class="fas fa-clock"></i> ${Math.floor(video.duration/60)}:${video.duration%60}</p>
            </div>
        </div>
    `;
    
    // Show download buttons
    downloadOptions.innerHTML = `
        <div class="mt-4">
            <h5>Pilih Download:</h5>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <div class="card bg-dark border-success">
                        <div class="card-body text-center">
                            <span class="badge-no-watermark">NO WATERMARK</span>
                            <p class="mt-2">Video HD tanpa logo</p>
                            <a href="${video.play}" 
                               class="btn btn-success btn-lg w-100"
                               download="tiktok_no_watermark.mp4">
                                <i class="fas fa-download"></i> Download HD
                            </a>
                        </div>
                    </div>
                </div>
                ${video.wmplay ? `
                <div class="col-md-6 mb-3">
                    <div class="card bg-dark border-warning">
                        <div class="card-body text-center">
                            <span class="badge bg-warning">WITH WATERMARK</span>
                            <p class="mt-2">Video dengan logo TikTok</p>
                            <a href="${video.wmplay}" 
                               class="btn btn-warning btn-lg w-100"
                               download="tiktok_with_watermark.mp4">
                                <i class="fas fa-download"></i> Download
                            </a>
                        </div>
                    </div>
                </div>
                ` : ''}
            </div>
        </div>
    `;
    
    result.classList.remove('d-none');
    
    // Scroll to result
    result.scrollIntoView({ behavior: 'smooth' });
}

function showError(message) {
    const error = document.getElementById('error');
    error.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
    error.classList.remove('d-none');
    setTimeout(() => error.classList.add('d-none'), 5000);
}

function hideAll() {
    document.getElementById('loading').classList.add('d-none');
    document.getElementById('result').classList.add('d-none');
    document.getElementById('error').classList.add('d-none');
}

// Enter key support
document.getElementById('tiktokUrl').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') downloadVideo();
});

// Auto-focus
window.onload = function() {
    document.getElementById('tiktokUrl').focus();
};
