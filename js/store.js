// For header part
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


const bookList = document.getElementById('book-list');
const addBookForm = document.getElementById('add-book-form');

let books = [];

fetch('data/books.json')
    .then(response => response.json())
    .then(data => {
        books = data;
        renderBooks();
    });





// Handle form submission
addBookForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;

    const newBook = { title, author };
    books.push(newBook);

    renderBooks();

    addBookForm.reset();
});

// Render books
function renderBooks() {
    bookList.innerHTML = ''; // Clear previous list

    books.forEach((book, index) => {
        const bookItem = document.createElement('div');
        bookItem.classList.add('book-item');

        // Properly use insertAdjacentHTML method
        bookItem.insertAdjacentHTML('beforeend', `
            <span>${book.title} by ${book.author}</span>
            <button onclick="deleteBook(${index})">Remove</button>
        `);

        bookList.appendChild(bookItem);
    });
}


// Remove book
function deleteBook(index) {
    books.splice(index, 1);
    renderBooks();
}
