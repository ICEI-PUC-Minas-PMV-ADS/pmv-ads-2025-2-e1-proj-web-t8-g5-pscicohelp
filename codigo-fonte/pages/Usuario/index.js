

function switchTab(tabName) {

    document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.remove('active');
    });
    

    document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
    });
    
    event.target.classList.add('active');
    

    document.getElementById(tabName).classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}


function openModal(modalId) {
    document.getElementById(modalId).classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
    document.body.style.overflow = 'auto';
}

document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal(this.id);
    }
    });
});

let currentRating = 0;

function setRating(rating) {
    currentRating = rating;
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
    if (index < rating) {
        star.classList.add('active');
    } else {
        star.classList.remove('active');
    }
    });
}

