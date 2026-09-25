const API_KEY = '7ab92b63b627f25d4863f853b604d887'; // <-- MANDATORY
var genres = {};

// Saat dokumen selesai dimuat
$(document).ready(function() {
    // Tetap menggunakan fetch untuk mengambil genre
    fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`)
        .then(response => response.json())
        .then(r => {
            // Menggunakan jQuery $.each untuk looping
            $.each(r.genres, function(index, genre) {
                genres[genre.id] = genre.name;
            });
        })
        .catch(e => {
            alert("Gagal mengambil data genre");
        });
});

// Event handler saat tombol search di-klik
$('#searchButton').click(function(e) {
    e.preventDefault(); 

    // Clear error message
    $('#error').text(""); 

    // Disabled search button & ubah text jadi loading
    const $searchBtn =$('#searchButton');
    $searchBtn.prop('disabled', true);$searchBtn.html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...');

    // Clear previous results
    $('#result').empty();

    // Ambil nilai input title
    const movieTitle = $('#title').val();
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(movieTitle)}&include_adult=false`;

    // Tetap menggunakan fetch untuk data pencarian film
    fetch(url)
        .then(response => response.json())
        .then(r => {
            if (r.results.length === 0) {
                $('#error').text('!!! No movie with this title.');
            } else {
                const $tableResult =$('#result');
                $.each(r.results, function(index, movie) {
                    const tableCell = createCell(movie, index + 1);
                    $tableResult.append(tableCell);
                });
            }
        })
        .catch(e => {
            $('#error').text('!!! Terjadi kesalahan pada server.');
        })
        .finally(() => {
            // Re-enable search button
            $searchBtn.prop('disabled', false);$searchBtn.text('Search');
        });
});

// Fungsi membuat baris tabel menggunakan jQuery (Gaya pembuatan elemen per baris)
function createCell(movie, movieNo) {
    const $row =$('<tr></tr>');

    // Row number
    const $colNo =$('<td width="10"></td>');
    const $h2No =$('<h2 class="display-5"></h2>').text(`#${movieNo}`);
    $colNo.append($h2No);
    $row.append($colNo);

    // Poster
    const posterUrl = (movie.poster_path !== null)
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : '';
    
    const $colPoster =$('<td width="100"></td>');
    const $img =$('<img>').attr({
        'src': posterUrl,
        'height': '200'
    });
    $colPoster.append($img);
    $row.append($colPoster);

    // Movie information container
    const $td =$('<td></td>');
    $row.append($td);

    // Title
    const $title =$('<h2 class="display-5"></h2>').text(movie.title);
    $td.append($title);

    // Overview
    const $overview =$('<p></p>').text(movie.overview);
    $td.append($overview);

    // Rating
    const $rating =$('<span class="badge badge-success p-2"></span>').text(`Rating: ${movie.vote_average}`);
    $td.append($rating);

    // Genres
    if (movie.genre_ids) {
        $.each(movie.genre_ids, function(index, id) {
            const $genre =$('<span class="badge badge-warning ml-2 p-2"></span>').text(genres[id]);
            $td.append($genre);
        });
    }

    return $row;
}