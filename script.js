
// TikTok Downloader - Direct Download (No Redirect)
console.log("TikTok Direct Downloader Loaded!");

// API endpoint
const TIKTOK_API = "https://tikwm.com/api/";

async function downloadVideo() {
    const urlInput = document.getElementById('tiktokUrl');
    const url = urlInput.value.trim();
    
    // Validasi dasar
    if (!url) {
        showMessage("error", "Masukkan URL TikTok terlebih dahulu!");
        return;
    }
    
    if (!isValidTikTokUrl(url)) {
        showMessage("error", "URL TikTok tidak valid! Contoh: https://www.tiktok.com/@user/video/123456789");
        return;
    }
    
    // Tampilkan loading
    toggleLoading(true);
    clearResults();
    
    try {
        // Panggil API
        const apiUrl = `${TIKTOK_API}?url=${encodeURIComponent(url)}&hd=1`;
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.code === 0 && data.data) {
            displayVideoData(data.data);
        } else {
            throw new Error(data.msg || "Video tidak ditemukan");
        }
    } catch (error) {
        console.error("Download error:", error);
        showMessage("error", `Gagal: ${error.message}. Coba URL lain.`);
    } finally {
        toggleLoading(false);
    }
}

function isValidTikTokUrl(url) {
    const patterns = [
        /https?:\/\/(www\.|vm\.)?tiktok\.com\/.+\/video\/\d+/,
        /https?:\/\/vt\.tiktok\.com\/\w+/,
        /https?:\/\/tiktok\.com\/@[\w.-]+\/video\/\d+/
    ];
    return patterns.some(pattern => pattern.test(url));
}

function displayVideoData(video) {
    // Tampilkan informasi video
    const videoInfoHTML = `
        <div class="row align-items-center">
            <div class="col-md-4">
                <img src="${video.cover || video.images?.[0] || ''}" 
                     class="img-fluid rounded shadow" 
                     alt="Video thumbnail"
                     style="max-height: 200px; object-fit: cover;">
            </div>
            <div class="col-md-8">
                <h6 class="mb-2">${video.title || 'TikTok Video'}</h6>
                <p class="mb-1">
                    <i class="fas fa-user-circle"></i> 
                    ${video.author?.nickname || 'Unknown'}
                    ${video.author?.unique_id ? `(@${video.author.unique_id})` : ''}
                </p>
                ${video.duration ? `
                <p class="mb-1">
                    <i class="fas fa-clock"></i> 
                    Durasi: ${formatDuration(video.duration)}
                </p>
                ` : ''}
                ${video.music_info?.title ? `
                <p class="mb-1">
                    <i class="fas fa-music"></i> 
                    Musik: ${video.music_info.title}
                </p>
                ` : ''}
            </div>
        </div>
    `;
    
    // Tampilkan tombol download
    let downloadButtonsHTML = '<h5 class="mt-4 mb-3">Pilihan Download:</h5><div class="row">';
    
    // No Watermark HD
    if (video.play || video.hdplay) {
        const downloadUrl = video.hdplay || video.play;
        downloadButtonsHTML += `
            <div class="col-md-6 mb-3">
                <div class="card border-success bg-dark">
                    <div class="card-body text-center">
                        <span class="badge bg-success mb-2">NO WATERMARK</span>
                        <p class="small">Video HD tanpa logo TikTok</p>
                        <a href="${downloadUrl}" 
                           class="btn btn-success btn-lg w-100"
                           download="tiktok_no_watermark_${Date.now()}.mp4">
                           <i class="fas fa-download"></i> Download HD
                        </a>
                        <p class="small text-muted mt-2">Kualitas terbaik</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    // With Watermark
    if (video.wmplay) {
        downloadButtonsHTML += `
            <div class="col-md-6 mb-3">
                <div class="card border-warning bg-dark">
                    <div class="card-body text-center">
                        <span class="badge bg-warning mb-2">WITH WATERMARK</span>
                        <p class="small">Video dengan logo TikTok</p>
                        <a href="${video.wmplay}" 
                           class="btn btn-warning btn-lg w-100"
                           download="tiktok_with_watermark_${Date.now()}.mp4">
                           <i class="fas fa-download"></i> Download
                        </a>
                        <p class="small text-muted mt-2">Original dengan watermark</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Music only
    if (video.music) {
        downloadButtonsHTML += `
            <div class="col-12 mt-2">
                <div class="card border-info bg-dark">
                    <div class="card-body text-center">
                        <span class="badge bg-info mb-2">AUDIO ONLY</span>
                        <p class="small">Download musiknya saja</p>
                        <a href="${video.music}" 
                           class="btn btn-info w-100"
                           download="tiktok_music_${Date.now()}.mp3">
                           <i class="fas fa-music"></i> Download MP3
                        </a>
                    </div>
                </div>
            </div>
        `;
    }
    
    downloadButtonsHTML += '</div>';
    
    // Update DOM
    document.getElementById('videoInfo').innerHTML = videoInfoHTML;
    document.getElementById('downloadOptions').innerHTML = downloadButtonsHTML;
    
    // Tampilkan hasil
    document.getElementById('result').classList.remove('d-none');
    
    // Scroll ke hasil
    document.getElementById('result').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

function formatDuration(seconds) {
    if (!seconds) return 'Unknown';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function toggleLoading(show) {
    const loading = document.getElementById('loading');
    if (show) {
        loading.classList.remove('d-none');
    } else {
        loading.classList.add('d-none');
    }
}

function clearResults() {
    document.getElementById('result').classList.add('d-none');
    document.getElementById('videoInfo').innerHTML = '';
    document.getElementById('downloadOptions').innerHTML = '';
    document.getElementById('error').classList.add('d-none');
}

function showMessage(type, message) {
    const errorDiv = document.getElementById('error');
    
    if (type === "error") {
        errorDiv.className = "alert alert-danger mt-3";
        errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
    } else {
        errorDiv.className = "alert alert-info mt-3";
        errorDiv.innerHTML = `<i class="fas fa-info-circle"></i> ${message}`;
    }
    
    errorDiv.classList.remove('d-none');
    
    // Auto hide setelah 5 detik
    setTimeout(() => {
        errorDiv.classList.add('d-none');
    }, 5000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    const urlInput = document.getElementById('tiktokUrl');
    
    // Auto focus
    urlInput.focus();
    
    // Enter key support
    urlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            downloadVideo();
        }
    });
    
    // Contoh placeholder
    const examples = [
        "https://www.tiktok.com/@tiktok/video/7318578031539907846",
        "https://vt.tiktok.com/ZSLpJrVrS/",
        "https://tiktok.com/@example_user/video/1234567890123456789"
    ];
    
    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    urlInput.placeholder = `Contoh: ${randomExample}`;
    
    console.log("TikTok Downloader ready!");
});
