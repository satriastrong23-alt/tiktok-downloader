// Simple TikTok Downloader
console.log("TikTok Downloader Ready!");

function downloadVideo() {
    const url = document.getElementById('tiktokUrl').value.trim();
    const errorDiv = document.getElementById('error');
    
    // Reset error
    errorDiv.classList.add('d-none');
    
    // Validasi
    if (!url) {
        showError("Masukkan URL TikTok!");
        return;
    }
    
    if (!url.includes('tiktok.com') && !url.includes('vt.tiktok.com')) {
        showError("URL harus dari TikTok! Contoh: https://www.tiktok.com/@user/video/123456789");
        return;
    }
    
    // Tampilkan loading
    const loading = document.getElementById('loading');
    const result = document.getElementById('result');
    
    loading.classList.remove('d-none');
    result.classList.add('d-none');
    
    // Proses download
    setTimeout(() => {
        loading.classList.add('d-none');
        
        // Contoh URL download (pakai API publik)
        const downloadUrl = `https://tikcdn.io/ssstik/${url.split('/').pop()}`;
        
        // Tampilkan hasil
        document.getElementById('videoInfo').innerHTML = `
            <div class="alert alert-info">
                <h5>Video Siap Download!</h5>
                <p>Klik tombol di bawah untuk download</p>
            </div>
        `;
        
        document.getElementById('downloadOptions').innerHTML = `
            <div class="text-center">
                <a href="https://ssstik.io/en?url=${encodeURIComponent(url)}" 
                   class="btn btn-success btn-lg mb-2"
                   target="_blank">
                   <i class="fas fa-download"></i> Download via SSSTik (No Watermark)
                </a>
                <br>
                <small class="text-muted">*Akan dibuka di halaman baru</small>
            </div>
        `;
        
        result.classList.remove('d-none');
        
        // Scroll ke hasil
        result.scrollIntoView({ behavior: 'smooth' });
        
    }, 1500); // Delay 1.5 detik
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
    errorDiv.classList.remove('d-none');
}

// Enter key support
document.getElementById('tiktokUrl').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        downloadVideo();
    }
});

// Auto focus
window.onload = function() {
    document.getElementById('tiktokUrl').focus();
};
