// Select all images on the page
const images = document.querySelectorAll('.pic img');

// Create overlay and modal elements
const overlay = document.createElement('div');
overlay.style.position = 'fixed';
overlay.style.top = '0';
overlay.style.left = '0';
overlay.style.width = '100%';
overlay.style.height = '100%';
overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
overlay.style.display = 'none';
overlay.style.backdropFilter = 'blur(8px)';
overlay.style.zIndex = '1000';

// Create a modal for the image
const modal = document.createElement('div');
modal.style.position = 'absolute';
modal.style.top = '50%';
modal.style.left = '50%';
modal.style.transform = 'translate(-50%, -50%)';
modal.style.maxWidth = '90%';
modal.style.maxHeight = '90%';
modal.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.5)';
modal.style.borderRadius = '10px';

// Create the enlarged image element
const enlargedImage = document.createElement('img');
enlargedImage.style.width = '100%';
enlargedImage.style.height = '100%';
enlargedImage.style.objectFit = 'contain';
enlargedImage.style.borderRadius = '10px';
modal.appendChild(enlargedImage);

// Create a close button
const closeButton = document.createElement('button');
closeButton.textContent = '✕';
closeButton.style.position = 'absolute';
closeButton.style.top = '10px';
closeButton.style.right = '10px';
closeButton.style.background = 'rgba(255, 255, 255, 0.8)';
closeButton.style.border = 'none';
closeButton.style.borderRadius = '50%';
closeButton.style.padding = '10px';
closeButton.style.cursor = 'pointer';
closeButton.style.fontSize = '1.1rem';
closeButton.style.fontWeight = 'bold';
closeButton.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
modal.appendChild(closeButton);

// Append modal and overlay to the document body
overlay.appendChild(modal);
document.body.appendChild(overlay);

// Event listener to enlarge the image on click
images.forEach((img) => {
  img.addEventListener('click', () => {
    enlargedImage.src = img.src;
    overlay.style.display = 'block';
  });
});

// Event listener to close the modal
closeButton.addEventListener('click', () => {
  overlay.style.display = 'none';
});

// Close modal on overlay click
overlay.addEventListener('click', (event) => {
  if (event.target === overlay) {
    overlay.style.display = 'none';
  }
});
