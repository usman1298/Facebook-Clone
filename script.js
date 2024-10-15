// Function to render photos from localStorage
function renderPhotos() {
    const photosContainer = document.getElementById('photosContainer');
    photosContainer.innerHTML = ''; // Clear current photos
    const photos = JSON.parse(localStorage.getItem('photos')) || [];

    photos.forEach((photo, index) => {
        const photoElement = document.createElement('div');
        photoElement.classList.add('photo');

        // Generate photo content with optional comments and delete button
        photoElement.innerHTML = `
            <img src="${photo.file}" alt="Uploaded Photo">
            <p>Likes: <span class="like-count">${photo.likes}</span></p>
            <button class="like-btn" onclick="likePhoto(${index})">Like</button>
            <button class="delete-btn" onclick="deletePhoto(${index})">Delete</button>
            <div class="comment-section">
                <input type="text" id="comment-${index}" placeholder="Add a comment">
                <button class="comment-btn" onclick="addComment(${index})">Comment</button>
            </div>
            <div class="comments">
                ${photo.comments.map((comment, commentIndex) => 
                    `<div class="comment">
                        ${comment}
                        <button class="delete-comment-btn" onclick="deleteComment(${index}, ${commentIndex})">Delete</button>
                    </div>`).join('')}
            </div>
        `;
        photosContainer.appendChild(photoElement);
    });
}

// Function to handle photo upload
document.getElementById('uploadPhotoBtn').addEventListener('click', function() {
    const fileInput = document.getElementById('fileInput');

    if (fileInput.files.length > 0) {
        Array.from(fileInput.files).forEach(file => {
            const reader = new FileReader();
            reader.onload = function(event) {
                savePhoto(event.target.result); // Save each uploaded photo once processed
            };
            reader.readAsDataURL(file); // Convert file to base64 string
        });
        fileInput.value = ''; // Clear file input after upload
    } else {
        alert("Please choose a photo to upload."); // Alert if no file is selected
    }
});

// Function to save the photo to localStorage and render it immediately
function savePhoto(file) {
    const photos = JSON.parse(localStorage.getItem('photos')) || [];
    photos.push({ file: file, likes: 0, comments: [] });
    localStorage.setItem('photos', JSON.stringify(photos));
    renderPhotos(); // Re-render photos immediately after adding a new photo
}

// Function to like a photo
function likePhoto(index) {
    const photos = JSON.parse(localStorage.getItem('photos')) || [];
    photos[index].likes += 1;
    localStorage.setItem('photos', JSON.stringify(photos));
    renderPhotos(); // Re-render photos to update like count
}

// Function to add a comment to a photo
function addComment(index) {
    const commentInput = document.getElementById(`comment-${index}`);
    const comment = commentInput.value;

    if (comment.trim() !== '') {
        const photos = JSON.parse(localStorage.getItem('photos')) || [];
        photos[index].comments.push(comment);
        localStorage.setItem('photos', JSON.stringify(photos));
        commentInput.value = ''; // Clear comment input
        renderPhotos(); // Re-render photos to show the new comment
    }
}

// Function to delete a photo
function deletePhoto(index) {
    const photos = JSON.parse(localStorage.getItem('photos')) || [];
    photos.splice(index, 1); // Remove the specific photo
    localStorage.setItem('photos', JSON.stringify(photos));
    renderPhotos(); // Re-render photos to update the list
}

// Function to delete a comment from a photo
function deleteComment(photoIndex, commentIndex) {
    const photos = JSON.parse(localStorage.getItem('photos')) || [];
    photos[photoIndex].comments.splice(commentIndex, 1); // Remove the specific comment
    localStorage.setItem('photos', JSON.stringify(photos));
    renderPhotos(); // Re-render photos to update the comments
}

// Initial render of photos when the page loads
renderPhotos();