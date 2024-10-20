document.addEventListener('DOMContentLoaded', () => {
    const bookDetailsDiv = document.getElementById('book-details');

    bookDetailsDiv.innerHTML = `<p class="loading-message">Loading book details...</p>`;

    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');
    let bookData = null;

    if (bookId) {
        fetch(`https://gutendex.com/books/${bookId}/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(book => {
                if (!book || Object.keys(book).length === 0) {
                    showNoDataFound();
                } else {
                    bookData = book;
                    displayBookDetails(book);
                }
            })
            .catch(error => {
                console.error('Error fetching book details:', error);
                showNoDataFound();
            });
    } else {
        console.error('No book ID found in the URL');
        showNoDataFound();
    }

    // Function to display book details
    function displayBookDetails(book) {
        const authorName = book.authors[0]?.name || 'Unknown Author';
        const birthYear = book.authors[0]?.birth_year ? `(${book.authors[0].birth_year}` : '';
        const deathYear = book.authors[0]?.death_year ? ` - ${book.authors[0].death_year})` : (birthYear ? ')' : '');

        const bookshelves = book.bookshelves.length > 0 ? book.bookshelves.join(', ') : 'Unknown Genre';
        const subjects = book.subjects.length > 0 ? book.subjects.join(', ') : 'No subjects available';
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
            <div class="btn-group">
               <button id="add-to-wishlist" class="wishlist-btn">
                <i class="fa-solid fa-heart"></i>
               </button>

                <button class="cart-btn" onclick="addToWishlist(${bookId})">Add to <i class="fa-solid fa-cart-shopping"></i></button>
            </div>
        </div>
        `;
    }

    // Function to show "No data found" message
    function showNoDataFound() {
        bookDetailsDiv.innerHTML = `<p class="error-message">No data found for this book.</p>`;
    }

    // Add to Wishlist function
    document.addEventListener('click', (event) => {
        const wishlistBtn = event.target.closest('#add-to-wishlist');

        if (wishlistBtn) {
            addToWishlist(bookId);
        }
    });


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
    function addToWishlist(bookId) {
        const wishlist = getWishlist();

        if (wishlist.some(book => book.id === bookId)) {
            alert("This book is already in your wishlist!");
        } else {
            wishlist.push({ id: bookId });
            saveWishlist(wishlist);
            alert("This book has been added to your wishlist!");
        }
    };

});


