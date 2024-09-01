//Initially fetching all the stores from the server and displaying them
var flag = false;
const display = (function () {
    return function () {

        let arr;
        fetch('http://localhost:8080/getStores')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                arr = data;
                const root = document.getElementById('root');
                root.innerHTML = '';
                for (let item of arr) {
                    const card = document.createElement('div');
                    const buttonContainer = document.createElement('div');
                    const del = document.createElement("button");
                    const edit = document.createElement("button");
                    card.id = `${item.id}`;
                    del.textContent = "Delete";
                    del.setAttribute("onclick", `del("${item.id}")`);
                    edit.setAttribute("onclick", `edit("${item.id}")`);
                    edit.textContent = "Edit";
                    edit.style.marginLeft = "10px";
                    edit.style.marginRight = "10px";
                    card.className = 'card';
                    card.style.marginLeft = "10px";
                    card.style.marginRight = "10px";
                    buttonContainer.className = "buttonContainer";

                    const img = document.createElement('img');
                    img.src = item.img_url;
                    img.alt = 'Image not found';
                    img.addEventListener('click', function (event) {
                        handleClick(event, item.id);
                    });
                    const title = document.createElement('div');
                    title.className = 'title';
                    title.textContent = item.store_name;
                    card.appendChild(img);
                    card.appendChild(title);
                    card.appendChild(buttonContainer);
                    buttonContainer.appendChild(del);
                    buttonContainer.appendChild(edit);
                    root.appendChild(card);
                }
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    };
})();
display();
const AddStore2 = document.getElementById("AddStore");

//pop-up function for add form
function popForm() {
    flag = false;
    const element = document.getElementById("addStoreForm");
    element.style.display = "block";
    const description = document.getElementById("description");
    description.style.display = "none";
    display();
}

//submiting form and creating new store
const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const storename = document.getElementById('storename').value.trim();
    const location = document.getElementById('location').value.trim();
    const contactnumber = document.getElementById('contactnumber').value.trim();
    const openingtime = document.getElementById('openingtime').value;
    const closingtime = document.getElementById('closingtime').value;
    // Check if store name or location is empty
    if (!storename || !location) {
        alert('Store Name and Location are required!');
        return;
    }
    // Validate contact number manually if needed
    const contactPattern = /^[789]\d{9}$/;
    if (!contactPattern.test(contactnumber)) {
        alert('Please enter a valid contact number starting with 7, 8, or 9 and 10 digits long.');
        return;
    }
    // Check if opening time is earlier than closing time
    if (openingtime && closingtime) {
        if (openingtime >= closingtime) {
            alert('Opening time must be earlier than closing time.');
            return;
        }
    }
    const form = document.getElementById('addStoreForm');
    var formData = new FormData(form);
    var obj = {};
    for (element of formData) {
        obj[element[0]] = element[1];
    }
    fetch('http://localhost:8080/stores', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    var arr = {};
    fetch('http://localhost:8080/getStores')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            arr = data;
            const values = Object.values(arr);
            const item = values[values.length - 1];
            const card = document.createElement('div');
            const buttonCointainer = document.createElement('div');
            const root = document.getElementById('root');
            const del = document.createElement("button");
            const edit = document.createElement("button");
            card.id = `${item.id}`;
            del.textContent = "Delete";
            del.setAttribute("onclick", `del("${item.id}")`);
            edit.setAttribute("onclick", `edit("${item.id}")`);
            edit.textContent = "Edit";
            edit.style.marginLeft = "10px";
            edit.style.marginRight = "10px";
            card.className = 'card';
            card.style.marginLeft = "10px";
            card.style.marginRight = "10px";
            buttonCointainer.className = "buttonCointainer";
            const img = document.createElement('img');
            img.src = item.img_url;
            img.alt = 'Image not found';
            img.addEventListener('click', function (event) {
                handleClick(event, item.id);
            });
            const title = document.createElement('div');
            title.className = 'title';
            title.textContent = item.store_name;
            card.appendChild(img);
            card.appendChild(title);
            card.appendChild(buttonCointainer);
            buttonCointainer.appendChild(del);
            buttonCointainer.appendChild(edit);
            root.appendChild(card);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    form.reset();
});

//function to close the add form     
function Close() {
    const description = document.getElementById("description");
    description.style.display = "block";
    const element = document.getElementById("addStoreForm");
    element.style.display = "none";
    element.reset();
    if (document.getElementById("Update")) {
        document.getElementById("Update").replaceWith(AddStore2);
    }

}

//function for deleting stores dynamically
function del(id) {
    var http = new XMLHttpRequest();
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            arr = JSON.parse(this.responseText);
        }
    };
    http.open("GET", `http://localhost:8080/stores/${id}`, false);
    http.setRequestHeader("Content-type", "application/json");
    http.send();
    var userConfirmation = confirm(`Are you sure you want to delete ${arr["store_name"]} store?`);
    if (userConfirmation) {
        alert("Store deleted!");
    } else {
        alert("Deletion canceled.");
        return;
    }
    var http = new XMLHttpRequest();
    http.open("DELETE", `http://localhost:8080/stores/${id}`, true);
    http.setRequestHeader('Content-type', "application/json");
    http.send();
    const delElement = document.getElementById(id);
    root.removeChild(delElement);

}

//function for viewing and editing store details
function edit(id) {
    const formContainer = document.getElementById("addStoreForm");
    const AddStore = document.getElementById("AddStore");
    const Updatebtn = document.createElement("button");
    Updatebtn.className = "btn";
    Updatebtn.textContent = "Update";
    Updatebtn.id = "Update";
    AddStore.replaceWith(Updatebtn);
    if (formContainer.style.display == "none") {
        popForm();
    }
    var arr = {};
    var http = new XMLHttpRequest();
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            arr = JSON.parse(this.responseText);
        }
    };
    http.open("GET", `http://localhost:8080/stores/${id}`, false);
    http.setRequestHeader("Content-type", "application/json");
    http.send();
    const storename = document.getElementById("storename");
    const location = document.getElementById("location");
    const contactnumber = document.getElementById("contactnumber");
    const openingtime = document.getElementById("openingtime");
    const closingtime = document.getElementById("closingtime");
    const availablenetworks = document.getElementById("availablenetworks");
    const website = document.getElementById("website");
    const url = document.getElementById("url");
    storename.value = arr["store_name"];
    location.value = arr["location"];
    contactnumber.value = arr["contact_number"];
    openingtime.value = arr["opening_time"];
    closingtime.value = arr["closing_time"];
    availablenetworks.value = arr["available_networks"];
    website.value = arr["website"];
    url.value = arr["img_url"];

    //function for updating store details
    Updatebtn.onclick = function () {
        console.log(id);
        arr["store_name"] = storename.value
        arr["location"] = location.value
        arr["contact_number"] = contactnumber.value
        arr["opening_time"] = openingtime.value
        arr["closing_time"] = closingtime.value
        arr["available_networks"] = availablenetworks.value
        arr["website"] = website.value
        arr["img_url"] = url.value
        Updatebtn.replaceWith(AddStore);
        form.reset();
        var http = new XMLHttpRequest();
        http.open("PUT", `http://localhost:8080/stores/${id}`, false);
        http.setRequestHeader('Content-type', "application/json");
        http.send(JSON.stringify(arr));
        display();
        Close();
    }
}
//function for searching stores by their names
function searchStores() {
    console.log("hi");
    const query = document.getElementById('searchInput').value.toLowerCase();
    const stores = document.querySelectorAll('.card');
    stores.forEach(store => {
        const storeName = store.querySelector('.title').innerText.toLowerCase();
        if (storeName.includes(query)) {
            store.style.display = "block";
        } else {
            store.style.display = "none";
        }
    });
}

//function to display store details in a popup
function handleClick(event, id) {
    const popup = document.createElement('div');
    popup.id = 'popup';
    const imgElement = document.createElement('img');
    imgElement.src = event.target.src;
    imgElement.style.width = '100%';
    imgElement.alt = "Image not found";
    var arr = {};
    var http = new XMLHttpRequest();
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            arr = JSON.parse(this.responseText);
        }
    };
    http.open("GET", `http://localhost:8080/stores/${id}`, false);
    http.setRequestHeader("Content-type", "application/json");
    http.send();
    const storeDetails1 = document.createElement('h6');
    storeDetails1.textContent = `Store Name : ${arr["store_name"]}`;
    const storeDetails2 = document.createElement('h6');
    storeDetails2.textContent = `Location : ${arr["location"]}`;
    const storeDetails3 = document.createElement('h6');
    storeDetails3.textContent = `Contact Number :  ${arr["contact_number"]}`;
    const storeDetails4 = document.createElement('h6');
    storeDetails4.textContent = `Opening Time : ${arr["opening_time"]}`;
    const storeDetails5 = document.createElement('h6');
    storeDetails5.textContent = `Closing Time : ${arr["closing_time"]}`;
    const storeDetails6 = document.createElement('h6');
    storeDetails6.textContent = `Available Networks : ${arr["available_networks"]}`;
    const storeDetails7 = document.createElement('h6');
    storeDetails7.textContent = ` Website : ${arr["website"]}`;
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.addEventListener('click', closePopup);
    popup.appendChild(imgElement);
    popup.appendChild(storeDetails1);
    popup.appendChild(storeDetails2);
    popup.appendChild(storeDetails3);
    popup.appendChild(storeDetails4);
    popup.appendChild(storeDetails5);
    popup.appendChild(storeDetails6);
    popup.appendChild(storeDetails7);
    popup.appendChild(closeButton);
    document.body.appendChild(popup);
    const overlay = document.getElementById('overlay');
    if (popup && overlay) {
        popup.style.display = 'block';
        overlay.style.display = 'block';
    }
}

//function to close view details pop up
function closePopup() {

    const popup = document.getElementById('popup');
    const overlay = document.getElementById('overlay');

    if (popup && overlay) {
        popup.remove();
        overlay.style.display = 'none';
    }
}

//function to logout
function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
}