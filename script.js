
document.addEventListener('DOMContentLoaded', () => {
    const gallerySections = document.querySelectorAll('.gallery-section');
    const options = {
        threshold: 0.1
    };

    const fadeInOnScroll = new IntersectionObserver((entries, fadeInOnScroll) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
            fadeInOnScroll.unobserve(entry.target);
        });
    }, options);

    gallerySections.forEach(section => {
        fadeInOnScroll.observe(section);
    });

    const imageUpload = document.getElementById('imageUpload');
    const uploadContainer = document.getElementById('uploadContainer');
    const favouritesContainer = document.getElementById('favouritesContainer');
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const closeModal = document.querySelector('.close');

    function updateLocalStorage() {
        const uploadedImages = Array.from(uploadContainer.querySelectorAll('img')).map(img => img.src);
        const favImages = Array.from(favouritesContainer.querySelectorAll('img')).map(img => img.src);
        localStorage.setItem('uploadedImages', JSON.stringify(uploadedImages));
        localStorage.setItem('favouriteImages', JSON.stringify(favImages));
    }

    function loadImages() {
        const uploadedImages = JSON.parse(localStorage.getItem('uploadedImages')) || [];
        const favouriteImages = JSON.parse(localStorage.getItem('favouriteImages')) || [];

        uploadedImages.forEach(src => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = 'Uploaded Image';
            uploadContainer.appendChild(img);
            createImageActions(img, uploadContainer);
        });

        favouriteImages.forEach(src => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = 'Favourite Image';
            favouritesContainer.appendChild(img);
            createImageActions(img, favouritesContainer);
        });
    }

    function createImageActions(img, parentContainer) {
        const existingContainer = img.closest('.image-container');
        if (existingContainer) {
            return; // Image already has actions
        }

        const container = document.createElement('div');
        container.classList.add('image-container');

        if (parentContainer) {
            parentContainer.appendChild(container);
        } else {
            console.error('Unexpected parent element for image:', img.parentNode);
            return;
        }

        container.appendChild(img);

        const actions = document.createElement('div');
        actions.classList.add('image-actions');
        container.appendChild(actions);

        const viewBtn = document.createElement('button');
        viewBtn.textContent = 'View';
        viewBtn.addEventListener('click', () => {
            modalImage.src = img.src;
            imageModal.style.display = 'flex';
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
            container.remove();
            updateLocalStorage();
        });

        const favBtn = document.createElement('button');
        favBtn.textContent = 'Add to Favourites';
        favBtn.addEventListener('click', () => {
            addToFavourites(img);
            container.remove();
            updateLocalStorage();
        });

        actions.appendChild(viewBtn);
        actions.appendChild(deleteBtn);
        actions.appendChild(favBtn);
    }

    function addToFavourites(img) {
        const favImg = img.cloneNode(true);
        createImageActions(favImg, favouritesContainer);
        favouritesContainer.appendChild(favImg);
    }

    closeModal.addEventListener('click', () => {
        imageModal.style.display = 'none';
    });

    imageUpload.addEventListener('change', (event) => {
        const files = event.target.files;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = 'Uploaded Image';
                uploadContainer.appendChild(img);
                createImageActions(img, uploadContainer);
                updateLocalStorage();
            };

            reader.readAsDataURL(file);
        }
    });

    loadImages();
});