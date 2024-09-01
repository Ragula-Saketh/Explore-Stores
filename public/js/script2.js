const form = document.querySelector('form');
const token = localStorage.getItem("token");

//To check whether token is still valid or not 
if (token) {
    fetch('http://localhost:8080/home', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`, // Use the extracted token
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            location.href = '/home.html';
        }
    });
}

//login form submission handling
form.addEventListener("submit", (e) => {
    e.preventDefault();
    var obj = {};
    var formData = new FormData(form);
    for (element of formData) {
        obj[element[0]] = element[1];
    }
    fetch('http://localhost:8080/home', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.log("User not found");
                alert("Please sign up");
                location.href = "./register";
                throw new Error("Login failed");
            }
        })
        .then(data => {
            console.log(data);
            const token = data;
            localStorage.setItem('token', token);
            return fetch('http://localhost:8080/home', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
        })
        .then(response => {
            if (response.ok) {
                location.href = '/home.html';
            }
        })
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));

    form.reset();
});
