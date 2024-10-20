// <<--------fetch data--------->>
let books = [];

fetch('https://gutendex.com/books/')
    .then(response => response.json())
    .then(data => {
        books = data.results;
        console.log(books);
        renderBooks(books);
        renderWishlist(books);
    })
    .catch(error => console.error('Error fetching books:', error));


// <<------------For header part ---------------->>>
const wishlistBtn = document.getElementById('wishlistBtn');
const wishlistDropdown = document.getElementById('wishlistDropdown');
let isDropdownOpen = false;

// Toggle dropdown visibility when the button is clicked
wishlistBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    isDropdownOpen = !isDropdownOpen;

    if (isDropdownOpen) {
        wishlistDropdown.classList.add('show');
    } else {
        wishlistDropdown.classList.remove('show');
    }
});

// Hide the dropdown if clicking outside of the button or dropdown
document.addEventListener('click', (event) => {
    if (!wishlistBtn.contains(event.target) && !wishlistDropdown.contains(event.target)) {
        wishlistDropdown.classList.remove('show');
        isDropdownOpen = false;
    }
});

// Function to render the wishlist items in the dropdown
function renderWishlist(books) {
    const wishlistItemsContainer = document.getElementById('wishlistItems');
    const wishlist = getWishlist();

    wishlistItemsContainer.innerHTML = '';

    if (wishlist.length === 0) {
        wishlistItemsContainer.innerHTML = '<li>No items in wishlist</li>';
        return;
    }

    wishlist.forEach(item => {
        const book = books?.find(b => b.id === item.id);
        const coverImage = book?.formats['image/jpeg'] || 'default-image.jpg';

        if (book) {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
        <img src="${coverImage}" alt="${book.title}" class="wishlist-img" width="50">
        <span class="wishlist-name">${book.title.length > 20 ? book.title.slice(0, 20) + '...' : book.title}</span>
        <button class="remove-btn" onclick="removeFromWishlist('${book.id}')"><i class="fa-regular fa-trash-can"></i></button>
      `;
            wishlistItemsContainer.appendChild(listItem);
        }
    });
}


// Function to remove a book from the wishlist
async function removeFromWishlist(bookId) {
    let wishlist = await getWishlist();
    wishlist = await wishlist.filter(book => book.id !== bookId);
    saveWishlist(wishlist);
    renderWishlist(books);
}

// Initialize the wishlist rendering when the page loads
// document.addEventListener('DOMContentLoaded', () => {
//     renderWishlist();
// });

// <<----------For search and flter section ------------->>
const genreSelect = document.getElementById('genreSelect');
const searchInput = document.getElementById('searchInput');

// Handle genre selection
genreSelect.addEventListener('change', (event) => {
    const selectedGenre = event.target.value;
    console.log('Selected genre:', selectedGenre);
});

// Handle search input
searchInput.addEventListener('input', (event) => {
    const searchTerm = event.target.value;
    console.log('Search term:', searchTerm);
    // Add your logic to search books
});


const bookList = document.getElementById('book-list');

// Render books
function renderBooks(books) {
    bookList.innerHTML = '';

    books.forEach((book) => {
        const author = book.authors[0]?.name || 'Unknown Author';
        const genre = book.bookshelves.length > 0 ? book.bookshelves[0] : 'Unknown Genre';
        const coverImage = book.formats['image/jpeg'] || 'default-image.jpg';
        const bookId = book.id;
        const bookLink = document.createElement('a');
        bookLink.classList.add('book-card');
        const bookUrl = `book.html?id=${bookId}`;

        bookLink.href = bookUrl;

        bookLink.insertAdjacentHTML('beforeend', `
            <div class="card-image">
                <img src="${coverImage}" alt="${book.title} cover image">
            </div>
            <div class="card-content">
                <h3 class="book-title">${book.title}</h3>
                <em class="book-author">by ${author}</em>
                <p class="book-genre"><strong>Genre:</strong> ${genre}</p>
                <p class="book-id"><strong>Book ID:</strong> ${bookId}</p>
                <div class="btn-group">
                   <button id="wishlist-btn-${bookId}" class="wishlist-btn" onclick="addToWishlist(event, ${bookId})">
                   <i class="fa-solid fa-heart"></i>
                   </button>

                    <button class="cart-btn" onclick="addToWishlist(${bookId})">Add to <i class="fa-solid fa-cart-shopping"></i></button>
                </div>
            </div>
        `);

        bookList.appendChild(bookLink);
    });
}

// Utility function to get wishlist from localStorage
function getWishlist() {
    try {
        return JSON.parse(localStorage.getItem('wishlist')) || [];
    } catch (error) {
        console.error('Error reading wishlist from localStorage:', error);
        return [];
    }
}

// Utility function to save wishlist to localStorage
function saveWishlist(wishlist) {
    try {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    } catch (error) {
        console.error('Error saving wishlist to localStorage:', error);
    }
}

// Function to add a book to the wishlist
function addToWishlist(event, bookId) {
    event.preventDefault();
    event.stopPropagation();

    const wishlist = getWishlist();

    if (wishlist.some(book => book.id === bookId)) {
        alert("This book is already in your wishlist!");
    } else {
        wishlist.push({ id: bookId });
        saveWishlist(wishlist);
        alert("This book has been added to your wishlist!");
    }
}