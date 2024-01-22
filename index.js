// Add the filter dropdown element to HTML
// ...

document.getElementById('userForm').addEventListener('submit', handleFormSubmit);

document.addEventListener('DOMContentLoaded', () => {
    fetchDataAndDisplay(); // Fetch data before any other operations
});

function fetchDataAndDisplay() {
    axios.get("https://crudcrud.com/api/7aff3b8dc7cd4aa0b6bc7e16bbbb28fb/booking")
        .then((res) => {
            const existingData = res.data;
            const parentElem = document.getElementById('listofitems');

            // Clear existing list items
            parentElem.innerHTML = '';

            existingData.forEach(userData => showUserOnScreen(userData));
            filterList(); // Call filterList after displaying data
        })
        .catch((err) => console.log(err));
}

function handleFormSubmit(event) {
    event.preventDefault();
    const name = event.target.username.value;
    const email = event.target.email.value;
    const phonenumber = event.target.phone.value;
    const cartype = event.target.category.value;

    if (name && email && phonenumber && cartype) {
        const userData = {
            name,
            email,
            phonenumber,
            cartype,
        };

        const editingUserId = event.target.getAttribute('data-edit-id');
        if (editingUserId) {
            axios.put(`https://crudcrud.com/api/7aff3b8dc7cd4aa0b6bc7e16bbbb28fb/booking/${editingUserId}`, userData)
                .then((res) => {
                    const updatedUserData = { ...userData, id: editingUserId };
                    updateEditedUserOnScreen(updatedUserData);
                })
                .catch((err) => console.log(err));

            event.target.removeAttribute('data-edit-id');
        } else {
            axios.post("https://crudcrud.com/api/7aff3b8dc7cd4aa0b6bc7e16bbbb28fb/booking", userData)
                .then((res) => {
                    const userDataWithId = { ...userData, id: res.data._id };
                    showUserOnScreen(userDataWithId);
                })
                .catch((err) => console.log(err));
        }

        event.target.username.value = '';
        event.target.email.value = '';
        event.target.phone.value = '';
        event.target.category.value = '';

        fetchDataAndDisplay();
    }
}

function showUserOnScreen(userData) {
    const parentElem = document.getElementById('listofitems');
    const existingListItem = document.querySelector(`#listofitems li[data-user-id="${userData.id}"]`);

    const childElem = existingListItem || document.createElement('li');
    childElem.textContent = `${userData.name} - ${userData.email} - ${userData.phonenumber} - ${userData.cartype}`;
    childElem.setAttribute('data-user-id', userData.id);

    const deleteButton = document.createElement('input');
    deleteButton.type = 'button';
    deleteButton.value = 'Delete';
    deleteButton.onclick = () => {
        axios.delete(`https://crudcrud.com/api/7aff3b8dc7cd4aa0b6bc7e16bbbb28fb/booking/${userData.id}`)
            .then((res) => {
                console.log(res);
                parentElem.removeChild(childElem);
            })
            .catch((err) => console.log(err));
    };

    const editButton = document.createElement('input');
    editButton.type = 'button';
    editButton.value = 'Edit';
    editButton.onclick = () => {
        document.getElementById('username').value = userData.name;
        document.getElementById('email').value = userData.email;
        document.getElementById('phone').value = userData.phonenumber;
        document.getElementById('category').value = userData.cartype;
        document.getElementById('userForm').setAttribute('data-edit-id', userData.id);
    };

    childElem.appendChild(deleteButton);
    childElem.appendChild(editButton);
    childElem.classList.add(userData.cartype);

    if (!existingListItem) {
        parentElem.appendChild(childElem);
    }
}

function updateEditedUserOnScreen(userData) {
    const listItem = document.querySelector(`#listofitems li[data-user-id="${userData.id}"]`);
    if (listItem) {
        listItem.textContent = `${userData.name} - ${userData.email} - ${userData.phonenumber} - ${userData.cartype}`;
    }
}

function filterList() {
    const filterCategory = document.getElementById('filterCategory').value;
    const listItems = document.querySelectorAll('#listofitems li');

    listItems.forEach((item) => {
        const busType = item.classList.item(1);
        if (filterCategory === '' || filterCategory === busType) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}
