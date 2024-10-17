// Fetch tenants from the API and display them in the table
function fetchTenants() {
    fetch('http://localhost:9092/api/tenants') // Ensure this URL matches your API endpoint
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const tableBody = document.querySelector('#tenantTable tbody');
            tableBody.innerHTML = ''; // Clear previous entries

            // Loop through each tenant and create a row in the table
            data.forEach(tenant => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${tenant.name}</td>
                    <td>${tenant.email}</td>
                    <td>${tenant.phone}</td>
                    <td>
                        <button class="btn btn-warning" onclick="editTenant(${tenant.id}, '${tenant.name}', '${tenant.email}', '${tenant.phone}')">Edit</button>
                        <button class="btn btn-danger" onclick="deleteTenant(${tenant.id})">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching tenants:', error);
        });
}

// Call fetchTenants to load the initial data
fetchTenants();

// Handle form submission to add or update a tenant
document.getElementById('tenantForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission

    const tenantId = document.getElementById('tenantId').value; // Hidden input to store tenant ID
    const tenantName = document.getElementById('tenantName').value;
    const tenantEmail = document.getElementById('tenantEmail').value;
    const tenantPhone = document.getElementById('tenantPhone').value;

    // Check if we're editing an existing tenant or adding a new one
    if (tenantId) {
        // Update existing tenant
        fetch(`http://localhost:9092/api/tenants/${tenantId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tenantName, tenantEmail, tenantPhone })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data.message);
            fetchTenants(); // Refresh the tenant list
            document.getElementById('tenantForm').reset(); // Reset form fields
            document.getElementById('tenantId').value = ''; // Reset hidden input for tenantId
        })
        .catch(error => {
            console.error('Error updating tenant:', error);
        });
    } else {
        // Create new tenant
        fetch('http://localhost:9092/api/tenants', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tenantName, tenantEmail, tenantPhone })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data.message);
            fetchTenants(); // Refresh the tenant list
            document.getElementById('tenantForm').reset(); // Reset form fields
        })
        .catch(error => {
            console.error('Error adding tenant:', error);
        });
    }
});

// Function to delete a tenant
function deleteTenant(id) {
    fetch(`http://localhost:9092/api/tenants/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data.message);
        fetchTenants(); // Refresh the tenant list
    })
    .catch(error => {
        console.error('Error deleting tenant:', error);
    });
}

// Function to set the form for editing a tenant
function editTenant(id, name, email, phone) {
    document.getElementById('tenantId').value = id; // Hidden input to store tenant ID
    document.getElementById('tenantName').value = name;
    document.getElementById('tenantEmail').value = email;
    document.getElementById('tenantPhone').value = phone;

    // Optionally, scroll to the form for better UX
    document.getElementById('tenantForm').scrollIntoView({ behavior: 'smooth' });
}
