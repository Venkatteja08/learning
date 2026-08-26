

const form = document.querySelector("#loginForm");

form.addEventListener("submit", async (event)=> {
    event.preventDefault();

    const userName = document.getElementById("userName").value;
    const password = document.getElementById("userPassword").value;
    const contact = document.getElementById("phone").value;

    const userData = {
        userName : userName,
        password : password,
        contact : contact
    };

    console.log(userData);

    const response = await fetch("http://localhost:5000/users",  {
        method : "POST",
        headers : {
            "content-Type" : "application/json"
        },
        body : JSON.stringify(userData)

        
    });

    const result = await response.text();
    console.log(result);

})