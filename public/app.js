document.getElementById('animalForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const habitat = document.getElementById('habitat').value;
    fetch('/animals', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, habitat })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('name').value = '';
        document.getElementById('habitat').value = '';
        fetchAnimals(); // Refresh the list of animals
    })
    .catch(error => console.error('Error:', error));
});

function fetchAnimals() {
    fetch('/animals')
        .then(response => response.json())
        .then(animals => {
            const list = document.getElementById('animalList');
            list.innerHTML = ''; // Clear the list first
            animals.forEach(animal => {
                const item = document.createElement('li');
                item.textContent = `Name: ${animal.name}, Habitat: ${animal.habitat} `;
                
                // Create a delete button
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.onclick = function() { deleteAnimal(animal.id); };
                item.appendChild(deleteButton);
                
                list.appendChild(item);
            });
        })
        .catch(error => console.error('Failed to fetch animals:', error));
}

function deleteAnimal(id) {
    fetch(`/animals/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        console.log('Delete successful', data);
        fetchAnimals(); // Refresh the list of animals after deletion
    })
    .catch(error => console.error('Error deleting animal:', error));
}
