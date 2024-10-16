// crud.js

// Function to fetch properties from the API
async function fetchProperties() {
    try {
        const response = await fetch("http://localhost:8081/api/properties");
        if (!response.ok) {
            throw new Error("Failed to fetch properties");
        }
        const properties = await response.json();
        renderProperties(properties);
    } catch (error) {
        console.error("Error fetching properties:", error);
    }
}

// Function to render properties in the table
function renderProperties(properties) {
    const tableBody = document.getElementById("propertiesTable").querySelector("tbody");
    tableBody.innerHTML = ""; // Clear the table body

    properties.forEach(property => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${property.name}</td>
            <td>${property.address}</td>
            <td>${property.price}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="editProperty(${property.id})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteProperty(${property.id})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Function to add a new property
async function addProperty(event) {
    event.preventDefault(); // Prevent form submission

    const name = document.getElementById("propertyName").value;
    const address = document.getElementById("propertyAddress").value;
    const price = document.getElementById("propertyPrice").value;

    try {
        const response = await fetch("http://localhost:8081/api/properties", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, address, price })
        });

        if (!response.ok) {
            throw new Error("Failed to add property");
        }

        // Clear the form inputs
        document.getElementById("propertyForm").reset();
        fetchProperties(); // Refresh the property list
    } catch (error) {
        console.error("Error adding property:", error);
    }
}

// Attach event listener to the form
document.getElementById("propertyForm").addEventListener("submit", addProperty);

// Load properties on page load
window.onload = fetchProperties;
