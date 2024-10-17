// Fetch properties from the API and display them in the table
function fetchProperties() {
    fetch('http://localhost:9091/api/properties') // Ensure this URL matches your API endpoint
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const tableBody = document.querySelector('#propertyTable tbody');
            tableBody.innerHTML = ''; // Clear previous entries

            // Loop through each property and create a row in the table
            data.forEach(property => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${property.name}</td>
                    <td>${property.address}</td>
                    <td>${property.price}</td>
                    <td>
                        <button class="btn btn-warning" onclick="editProperty(${property.id}, '${property.name}', '${property.address}', ${property.price})">Edit</button>
                        <button class="btn btn-danger" onclick="deleteProperty(${property.id})">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching properties:', error);
        });
}

// Call fetchProperties to load the initial data
fetchProperties();

// Handle form submission to add or update a property
document.getElementById('propertyForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission

    const propertyId = document.getElementById('propertyId').value; // Hidden input to store property ID
    const propertyName = document.getElementById('propertyName').value;
    const propertyAddress = document.getElementById('propertyAddress').value;
    const propertyPrice = document.getElementById('propertyPrice').value;

    // Check if we're editing an existing property or adding a new one
    if (propertyId) {
        // Update existing property
        fetch(`http://localhost:9091/api/properties/${propertyId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ propertyName, propertyAddress, propertyPrice })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data.message);
            fetchProperties(); // Refresh the property list
            document.getElementById('propertyForm').reset(); // Reset form fields
            document.getElementById('propertyId').value = ''; // Reset hidden input for propertyId
        })
        .catch(error => {
            console.error('Error updating property:', error);
        });
    } else {
        // Create new property
        fetch('http://localhost:9091/api/properties', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ propertyName, propertyAddress, propertyPrice })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data.message);
            fetchProperties(); // Refresh the property list
            document.getElementById('propertyForm').reset(); // Reset form fields
        })
        .catch(error => {
            console.error('Error adding property:', error);
        });
    }
});

// Function to delete a property
function deleteProperty(id) {
    fetch(`http://localhost:9091/api/properties/${id}`, {
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
        fetchProperties(); // Refresh the property list
    })
    .catch(error => {
        console.error('Error deleting property:', error);
    });
}

// Function to set the form for editing a property
function editProperty(id, name, address, price) {
    document.getElementById('propertyId').value = id; // Hidden input to store property ID
    document.getElementById('propertyName').value = name;
    document.getElementById('propertyAddress').value = address;
    document.getElementById('propertyPrice').value = price;

    // Optionally, scroll to the form for better UX
    document.getElementById('propertyForm').scrollIntoView({ behavior: 'smooth' });
}
