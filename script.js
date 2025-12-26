// TikTok Downloader - Direct Download
console.log("TikTok Downloader Active!");

async function downloadVideo() {
    const url = document.getElementById('tiktokUrl').value.trim();
    const errorDiv = document.getElementById('error');
    
    // Reset
    errorDiv.classList.add('d-none');
    
    // Validation
    if (!url) {
        showError("Masukkan URL TikTok terlebih dahulu!");
        return;
    }
    
    // Show loading
    document.getElementById('loading').classList.remove('d-none');
    document.getElementById('result').classList.add('d-none');
    
    try {
        // Use TikTok API
        const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`;
        
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data.code === 0 && data.data) {
            displayVideo(data.data);
        } else {
            throw new Error(data.msg || "Video tidak ditemukan");
        }
    } catch (error) {
        showError(`Error: ${error.message}. Coba URL lain.`);
    } finally {
        document.getElementById('loading').classList.add('d-none');
    }
}

function displayVideo(video) {
    const result = document.getElementById('result');
    
    // Video Info
    document.getElementById('videoInfo').innerHTML = `
        <div class="row">
            <div class="col-md-4">
                <img src="${video.cover}" class="img-fluid rounded" alt="Thumbnail">
            </div>
            <div class="col-md-8">
                <h6>${video.title || 'TikTok Video'}</h6>
                <p><i class="fas fa-user"></i> ${video.author?.nickname || 'Unknown'}</p>
                <p><i class="fas fa-clock"></i> ${formatTime(video.duration)}</p>
            </div>
        </div>
    `;
    
    // Download Buttons
    document.getElementById('downloadOptions').innerHTML = `
        <div class="mt-4">
            <div class="row">
                <div class="col-md-6 mb-3">
                    <div class="card bg-dark border-success">
                        <div class="card-body text-center">
                            <span class="badge bg-success mb-2">NO WATERMARK</span>
                            <p class="small">Video HD tanpa logo</p>
                            ${video.play ? `
                            <a href="${video.play}" 
                               class="btn btn-success w-100"
                               download="tiktok_no_watermark.mp4">
                               <i class="fas fa-download"></i> Download HD
                            </a>
                            ` : '<p class="text-warning">Link tidak tersedia</p>'}
                        </div>
                    </div>
                </div>
                <div class="col-md-6 mb-3">
                    <div class="card bg-dark border-warning">
                        <div class="card-body text-center">
                            <span class="badge bg-warning mb-2">WITH WATERMARK</span>
                            <p class="small">Video dengan logo TikTok</p>
                            ${video.wmplay ? `
                            <a href="${video.wmplay}" 
                               class="btn btn-warning w-100"
                               download="tiktok_with_watermark.mp4">
                               <i class="fas fa-download"></i> Download
                            </a>
                            ` : '<p class="text-warning">Link tidak tersedia</p>'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Show result
    result.classList.remove('d-none');
    result.scrollIntoView({ behavior: 'smooth' });
}

function formatTime(seconds) {
    if (!seconds) return 'Unknown';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
    errorDiv.classList.remove('d-none');
}

// Enter key support
document.getElementById('tiktokUrl').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') downloadVideo();
});

// Auto focus
window.onload = function() {
    document.getElementById('tiktokUrl').focus();
};
