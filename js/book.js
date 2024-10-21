const bookDetailsDiv = document.getElementById('book-details');
const urlParams = new URLSearchParams(window.location.search);
const bookId = urlParams.get('id');

// Show loading message
bookDetailsDiv.innerHTML = `<p class="loading-message"><i class="fa-solid fa-book-open-reader"></i>Bookstore</p>`;

if (bookId) {
    fetchBookDetails(bookId);
} else {
    showNoDataFound('No book ID found in the URL');
}

// Fetch book details
function fetchBookDetails(bookId) {
    fetch(`https://gutendex.com/books/${bookId}/`)
        .then(response => response.ok ? response.json() : Promise.reject('Network response was not ok'))
        .then(book => {
            if (book && Object.keys(book).length > 0) {
                displayBookDetails(book);
            } else {
                showNoDataFound();
            }
        })
        .catch(error => {
            console.error('Error fetching book details:', error);
            showNoDataFound();
        });
}

// Display book details
function displayBookDetails(book) {
    const author = book.authors[0] || {};
    const authorName = author.name || 'Unknown Author';
    const birthYear = author.birth_year ? `(${author.birth_year}` : '';
    const deathYear = author.death_year ? ` - ${author.death_year})` : (birthYear ? ')' : '');
    const bookshelves = book.bookshelves.length ? book.bookshelves.join(', ') : 'Unknown Genre';
    const subjects = book.subjects.length ? book.subjects.join(', ') : 'No subjects available';
    const coverImage = book.formats['image/jpeg'] || 'default-image.jpg';

    bookDetailsDiv.innerHTML = `
    <div class="image-container">
        <img src="${coverImage}" alt="${book.title} cover">
        <h1>${book.title}</h1>
    </div>
    <div>
        <p><strong>Author:</strong> ${authorName} ${birthYear}${deathYear}</p>
        <p><strong>Genres/Bookshelves:</strong> ${bookshelves}</p>
        <p><strong>Subjects:</strong> ${subjects}</p>
        <p><strong>Book ID:</strong> ${book.id}</p>
        <p><strong>Language:</strong> ${book.languages.join(', ')}</p>
        <p><strong>Media Type:</strong> ${book.media_type}</p>
        <p><strong>Download Count:</strong> ${book.download_count}</p>
    </div>`;
}

// Show "No data found" message
function showNoDataFound(message = 'No data found for this book.') {
    bookDetailsDiv.innerHTML = `<p class="error-message">${message}</p>`;
}