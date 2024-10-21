// <<--------fetch data--------->>
let books = [];
fetchBooksData();
setupWishlistDropdown();

function fetchBooksData() {
    fetch('https://gutendex.com/books/')
        .then(response => response.json())
        .then(data => {
            books = data.results;
            if (data.results.length > 0) {
                renderBooks(books);
                renderWishlist(books);
            }
        })
        .catch(error => console.error('Error fetching books:', error));
}

window.addEventListener('load', () => {
    updateWishlistBadge();
});



// <<------------ Wishlist Dropdown Toggle ------------>>
function setupWishlistDropdown() {
    const wishlistBtn = document.getElementById('wishlistBtn');
    const wishlistDropdown = document.getElementById('wishlistDropdown');
    let isDropdownOpen = false;

    wishlistBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        isDropdownOpen = !isDropdownOpen;
        wishlistDropdown.classList.toggle('show', isDropdownOpen);
    });

    document.addEventListener('click', (event) => {
        if (!wishlistBtn.contains(event.target) && !wishlistDropdown.contains(event.target)) {
            wishlistDropdown.classList.remove('show');
            isDropdownOpen = false;
        }
    });
}



// <<----------  For Book list section ------------->>
const bookList = document.getElementById('book-list');
bookList.innerHTML = `<p class="loading-message"><i class="fa-solid fa-book-open-reader"></i>Bookstore</p>`;

function renderBooks(books) {
    books.forEach((book) => {
        const author = book.authors[0]?.name || 'Unknown Author';
        const genre = book.bookshelves.length > 0 ? book.bookshelves[0] : 'Unknown Genre';
        const coverImage = book.formats['image/jpeg'] || 'default-image.jpg';
        const bookId = book.id;
        const bookLink = document.createElement('a');
        bookLink.classList.add('book-card');
        const bookUrl = `book.html?id=${bookId}`;

        bookLink.href = bookUrl;

        bookLink.innerHTML = `
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
            `;
        bookList.appendChild(bookLink);
    });
}



// <<----------  For wishlist section ------------->>
function renderWishlist(books) {
    const wishlistItemsContainer = document.getElementById('wishlistItems');
    const wishlist = getWishlist();

    wishlistItemsContainer.innerHTML = '';

    if (wishlist.length === 0) {
        wishlistItemsContainer.innerHTML = '<span>No items in wishlist</span>';
        return;
    }

    wishlist.forEach(item => {
        const book = books?.find(b => b.id === item.id);
        const coverImage = book?.formats['image/jpeg'] || 'default-image.jpg';

        if (book) {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
        <img src="${coverImage}" alt="${book.title}" class="wishlist-img" width="50">
        <span class="wishlist-name">${book.title.length > 35 ? book.title.slice(0, 35) + '...' : book.title}</span>
        <button class="remove-btn" onclick="removeFromWishlist('${book.id}')"><i class="fa-regular fa-trash-can"></i></button>
      `;
            wishlistItemsContainer.appendChild(listItem);
        }
    });
};

function getWishlist() {
    try {
        return JSON.parse(localStorage.getItem('wishlist')) || [];
    } catch (error) {
        console.error('Error reading wishlist from localStorage:', error);
        return [];
    }
}

function saveWishlist(wishlist) {
    try {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    } catch (error) {
        console.error('Error saving wishlist to localStorage:', error);
    }
}

function updateWishlistBadge() {
    const wishlist = getWishlist();
    const badge = document.getElementById('badge');
    if (badge) {
        badge.textContent = wishlist.length;
    }
}

function addToWishlist(event, bookId) {
    event.preventDefault();
    event.stopPropagation();
    const wishlist = getWishlist();

    if (wishlist.some(book => book.id === bookId)) {
        alert("This book is already in your wishlist!");
    } else {
        wishlist.push({ id: bookId });
        saveWishlist(wishlist);
    }
    updateWishlistBadge();
    renderWishlist(books);
}

function removeFromWishlist(bookId) {
    let wishlist = getWishlist();

    if (!Array.isArray(wishlist)) {
        console.error('Wishlist is not an array:', wishlist);
        return;
    }

    wishlist = wishlist.filter(book => {
        return String(book.id) !== String(bookId);
    });
    saveWishlist(wishlist);
    renderWishlist(books);
    updateWishlistBadge();
}


// <<------------ Search and Filter Functionality ------------>>

const genreSelect = document.getElementById('genreSelect');
const searchInput = document.getElementById('searchInput');

genreSelect.addEventListener('change', handleGenreSelect);

function handleGenreSelect(event) {
    const selectedGenre = event.target.value;
    fetch(`https://gutendex.com/books?topic=${selectedGenre}`)
        .then(response => response.json())
        .then(data => {
            books = data.results;
            renderBooks(books);
        })
        .catch(error => console.error('Error fetching books:', error));
}

function debounce(func, delay) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(null, args);
        }, delay);
    };
}

function handleSearchInput(event) {
    const searchTerm = event.target.value;
    if (searchTerm.trim() === '') return;

    fetch(`https://gutendex.com/books?search=${encodeURIComponent(searchTerm)}`)
        .then(response => response.json())
        .then(data => {
            books = data.results;
            renderBooks(books);
        })
        .catch(error => console.error('Error fetching books:', error));
}

const debouncedHandleSearch = debounce(handleSearchInput, 300);
searchInput.addEventListener('input', debouncedHandleSearch);

