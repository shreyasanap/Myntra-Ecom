// Event listener for Weather button
document.getElementById('weatherBtn').addEventListener('click', function() {
    // Redirect to weather.html
    window.location.href = '../Outfitter/index.html';
});

// Event listener for Try On button
document.getElementById('tryOnBtn').addEventListener('click', function() {
    window.location.href = '../TryOn/index.html';
});

// Event listener for F3 button
document.getElementById('f3Btn').addEventListener('click', function() {
    window.location.href = '../Cloth-Recommendation/index.html';
});

// Event listener for F4 button
document.getElementById('f4Btn').addEventListener('click', function() {
    alert('F4 button clicked!');
});
