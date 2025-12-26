// Super Simple TikTok Downloader
function downloadVideo() {
    const url = document.getElementById('tiktokUrl').value;
    
    if (!url) {
        alert("Masukkan URL TikTok!");
        return;
    }
    
    // Redirect ke downloader eksternal
    window.open(`https://ssstik.io/en?url=${encodeURIComponent(url)}`, '_blank');
}

// Enter key
document.getElementById('tiktokUrl').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') downloadVideo();
});
