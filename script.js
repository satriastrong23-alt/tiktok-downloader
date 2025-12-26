// TikTok Downloader - Simple Version
console.log("TikTok Downloader Loaded!");

async function downloadVideo() {
    const url = document.getElementById('tiktokUrl').value.trim();
    
    if (!url) {
        alert('Masukkan URL TikTok terlebih dahulu!');
        return;
    }
    
    if (!url.includes('tiktok.com')) {
        alert('URL harus dari TikTok.com! Contoh: https://www.tiktok.com/@user/video/123456789');
        return;
    }
    
    // Tampilkan loading
    document.getElementById('loading').classList.remove('d-none');
    document.getElementById('result').classList.add('d-none');
    document.getElementById('error').classList.add('d-none');
    
    try {
        // Gunakan API TikTok downloader
        const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`;
        
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data.code === 0 && data.data) {
            showVideoResult(data.data);
        } else {
            throw new Error('Video tidak ditemukan');
        }
    } catch (error) {
        document.getElementById('error').classList.remove('d-none');
        document.getElementById('error').innerHTML = 
            `<i class="fas fa-exclamation-triangle"></i> Gagal: ${error.message}. Coba URL lain.`;
    } finally {
        document.getElementById('loading').classList.add('d-none');
    }
}

function showVideoResult(video) {
    const result = document.getElementById('result');
    const videoInfo = document.getElementById('videoInfo');
    const downloadOptions = document.getElementById('downloadOptions');
    
    // Tampilkan info video
    videoInfo.innerHTML = `
        <div class="row">
            <div class="col-md-4">
                <img src="${video.cover}" class="img-fluid rounded" alt="Thumbnail">
            </div>
            <div class="col-md-8">
                <h6>${video.title || 'Video TikTok'}</h6>
                <p><i class="fas fa-user"></i> ${video.author?.nickname || 'Unknown'}</p>
                <p><i class="fas fa-clock"></i> ${formatDuration(video.duration)}</p>
            </div>
        </div>
    `;
    
    // Tampilkan tombol download
    downloadOptions.innerHTML = `
        <div class="mt-4">
            <div class="row">
                <div class="col-md-6 mb-3">
                    <div class="card bg-dark border-success">
                        <div class="card-body text-center">
                            <span class="badge bg-success">NO WATERMARK</span>
                            <p class="mt-2">Video HD tanpa logo TikTok</p>
                            <a href="${video.play || video.hdplay}" 
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
    
    // Tampilkan hasil
    result.classList.remove('d-none');
    
    // Scroll ke hasil
    result.scrollIntoView({ behavior: 'smooth' });
}

function formatDuration(seconds) {
    if (!seconds) return 'Unknown';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Support Enter key
document.getElementById('tiktokUrl').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') downloadVideo();
});

// Auto focus
window.onload = function() {
    document.getElementById('tiktokUrl').focus();
    
    // Contoh URL placeholder
    const examples = [
        "https://www.tiktok.com/@tiktok/video/123456789",
        "https://vm.tiktok.com/ZMexample123/",
        "https://tiktok.com/@user/video/1234567890123456789"
    ];
    
    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    document.getElementById('tiktokUrl').placeholder = `Contoh: ${randomExample}`;
};
