/********************************************************************************
*  WEB422 – Assignment 2
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: ____Frank Fu__________________ Student ID: ____126609197__________ Date: _______May 30 2024_______
*  Published URL: https://web422-assignment2-5117.onrender.com/
*
********************************************************************************/

let page = 1;
const perPage = 10;
let searchName = null;

function loadListingsData() {
    let url = `http://localhost:8080/api/listings?page=${page}&perPage=${perPage}`;
    if (searchName) {
        url += `&name=${searchName}`;
    }

    fetch(url)
        .then(res => res.json())
        .then(data => {
            const tbody = document.querySelector('#listingsTable tbody');
            tbody.innerHTML = '';
            if (data.length > 0) {
                data.forEach(listing => {
                    const tr = document.createElement('tr');
                    tr.setAttribute('data-id', listing._id);
                    tr.innerHTML = `
                        <td>${listing.name}</td>
                        <td>${listing.room_type}</td>
                        <td>${listing.address.street}, ${listing.address.city}, ${listing.address.country}</td>
                        <td>${listing.summary || ''}</td>
                    `;
                    tr.addEventListener('click', () => showDetailsModal(listing._id));
                    tbody.appendChild(tr);
                });
            } else {
                tbody.innerHTML = '<tr><td colspan="4"><strong>No data available</strong></td></tr>';
                if (page > 1) {
                    page--;
                    loadListingsData();
                }
            }
            document.getElementById('current-page').textContent = page;
        })
        .catch(() => {
            const tbody = document.querySelector('#listingsTable tbody');
            tbody.innerHTML = '<tr><td colspan="4"><strong>No data available</strong></td></tr>';
            if (page > 1) {
                page--;
                loadListingsData();
            }
        });
}

function showDetailsModal(id) {
    fetch(`http://localhost:8080/api/listings/${id}`)
        .then(res => res.json())
        .then(data => {
            document.getElementById('detailsModalLabel').textContent = data.name;
            const modalBody = document.querySelector('#detailsModal .modal-body');
            modalBody.innerHTML = `
                <img id="photo" onerror="this.onerror=null;this.src='https://placehold.co/600x400?text=Photo+Not+Available'" class="img-fluid w-100" src="${data.images.picture_url || 'https://placehold.co/600x400?text=Photo+Not+Available'}"><br><br>
                ${data.neighborhood_overview || ''}<br><br>
                <strong>Price:</strong> ${data.price.toFixed(2)}<br>
                <strong>Room:</strong> ${data.room_type}<br>
                <strong>Bed:</strong> ${data.bed_type} (${data.beds})<br><br>
            `;
            new bootstrap.Modal(document.getElementById('detailsModal')).show();
        });
}

document.addEventListener('DOMContentLoaded', () => {
    loadListingsData();

    document.getElementById('previous-page').addEventListener('click', () => {
        if (page > 1) {
            page--;
            loadListingsData();
        }
    });

    document.getElementById('next-page').addEventListener('click', () => {
        page++;
        loadListingsData();
    });

    document.getElementById('searchForm').addEventListener('submit', (e) => {
        e.preventDefault();
        searchName = document.getElementById('name').value;
        page = 1;
        loadListingsData();
    });

    document.getElementById('clearForm').addEventListener('click', () => {
        document.getElementById('name').value = '';
        searchName = null;
        loadListingsData();
    });
});
