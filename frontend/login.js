
const form = document.querySelector("#loginForm");

form.addEventListener("submit",async (event)=> {
    event.preventDefault();

    const userName = document.getElementById("loginUserName").value;
    const password = document.getElementById("loginPassword").value;

    const loginData = {
        userName : userName,
        password : password
    };
    console.log(loginData);

    const response = await fetch("http://localhost:5000/login", {
        
        method : "POST",

        headers : {

            "Content-Type" : "application/json"
        },

        body : JSON.stringify(loginData)
    });

    const result = await response.json();
    console.log("server response", result);

    if(result.message === "Login Successful") {
        localStorage.setItem("token", result.token);
        window.location.href = "dashboard.html";
    }
    
})

