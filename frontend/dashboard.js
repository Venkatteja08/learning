// const logoutBtn  = document.getElementById("logoutBtn");

// logoutBtn.addEventListener("click",()=> {
//     window.location.href = "login.html"
// })

const token = localStorage.getItem("token");



async function checkLogin() {
    const response = await fetch("http://localhost:5000/profile", {
        headers : {
            Authorization : `Bearer ${token}`
        }
    });

    if (!response.ok) {
        localStorage.removeItem("token");
        window.location.href = "login.html";
        return;
    }


    const result =await response.json();

    console.log("Profile Details",result);

    const welcomeMessage = document.getElementById("welcomeMessage");

    welcomeMessage.textContent = `Welcome, ${result.user.userName}`;



    const orderResponse = await fetch("http://localhost:5000/orders", {
        headers : {
            Authorization : `Bearer ${token}`
        }
    });

    const orderResult = await orderResponse.json();

    console.log("orders :",orderResult);

    const adminResponse = await fetch("http://localhost:5000/admin", {
        headers : {
            Authorization : `Bearer ${token}`
        }
    });

    const adminResult = await adminResponse.json();
    console.log("adminResponse :",adminResult)
}



checkLogin();


const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
});