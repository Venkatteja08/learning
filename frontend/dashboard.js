

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


    if(result.user.role !== "admin") {
        adminBtn.style.display = "none";
    }




    // const orderResponse = await fetch("http://localhost:5000/orders", {
    //     headers : {
    //         Authorization : `Bearer ${token}`
    //     }
    // });

    // const orderResult = await orderResponse.json();

    // console.log("orders :",orderResult);

    // const adminResponse = await fetch("http://localhost:5000/admin", {
    //     headers : {
    //         Authorization : `Bearer ${token}`
    //     }
    // });

    // const adminResult = await adminResponse.json();
    // console.log("adminResponse :",adminResult)
}



checkLogin();


const profileBtn = document.getElementById("profileBtn");

profileBtn.addEventListener("click", async() => {
    
    const response = await fetch("http://localhost:5000/profile", {
        headers : {
            Authorization : `Bearer ${token}`
        }
    });

    const result = await response.json();

    console.log("Profile Deatils:",result);

    if(result.user.role !== "admin") {
        adminBtn.style.display = "none";
    }

    const welcomeMessage = document.getElementById("welcomeMessage");

    welcomeMessage.textContent = `Welcome ${result.user.userName}`;


    const profileDetails = document.getElementById("profileDetails");

    profileDetails.innerHTML =   `
    <p>Username: ${result.user.userName}</p>
    <p>Contact: ${result.user.contact}</p>
    <p>Role: ${result.user.role}</p>
    `;
})



// orders button- to show what are the orders 
// when we see my orders then only the buttons inside them works
const ordersBtn = document.getElementById("ordersBtn");

ordersBtn.addEventListener("click", async () => {
    const response = await fetch("http://localhost:5000/orders", {
        headers :{
            Authorization : `Bearer ${token}`
        }
    });

    const result = await response.json();
    console.log("Ordres:",result);


    const ordersList = document.getElementById("ordersList")

    ordersList.innerHTML = "";
    

    result.orders.forEach((order) => {
    const orderItem = document.createElement("p");


    orderItem.textContent =
        `${order.product} - Quantity: ${order.quantity}`;

    ordersList.appendChild(orderItem);
    //----------------------------------------------------------------------------//

     const cancelBtn = document.createElement("button");

    cancelBtn.textContent = "Cancel Order";

    cancelBtn.dataset.orderId = order._id; //storing the orderid in the button element

   



    cancelBtn.addEventListener("click", async() => {
        const orderId = cancelBtn.dataset.orderId;

        console.log("Order to Cancel", orderId);
        


        const response = await fetch(`http://localhost:5000/orders/${orderId}`, {
            method : "DELETE",
            headers : {
                Authorization : `Bearer ${token}`
            }
        });

        

        console.log("Response status:", response.status);

        const result = await response.json();
        console.log(result);

        ordersBtn.click()
    })

    ordersList.appendChild(cancelBtn); //adding btn to the dashboard

    //----------------------------------------------------------------------------//


    const updateBtn = document.createElement("button");

    updateBtn.textContent = "Change Quantity"

    updateBtn.dataset.orderId = order._id;

    ordersList.appendChild(updateBtn);

    updateBtn.addEventListener("click",async() => {
        const newQuantity = prompt("Enter new quantity");

        console.log("new Quantity", newQuantity);

        const orderId = updateBtn.dataset.orderId;

        const response = await fetch(`http://localhost:5000/orders/${orderId}`, {
            method : "PUT",

            headers : {
                "Content-Type" : "application/json",
                Authorization : `Bearer ${token}`
            },
            body : JSON.stringify({
                quantity : Number(newQuantity)
            })
        });

        const result = await response.json();

        console.log(result);
        if(!result.ok) {
            alert(result.message)
            return;
        }

         ordersBtn.click();

    })


    });
})

const adminBtn = document.getElementById("adminBtn");

adminBtn.addEventListener("click", async() => {
    const adminResponse = await fetch("http://localhost:5000/admin", {
        headers : {
            Authorization : `Bearer ${token}`
        }
    });

    const adminResult = await adminResponse.json();
    console.log("adminResponse :",adminResult)
})


//placing orderes........................


const placeOrderBtn = document.getElementById("placeOrderBtn");

placeOrderBtn.addEventListener("click", async(event) => {

    const product =  document.getElementById("product").value;
    const quantity = Number(document.getElementById("quantity").value);

    const orderedItems = {
        product : product,
        quantity : quantity
    }

    console.log(orderedItems);

    const response = await fetch("http://localhost:5000/orders", {
        method : "POST",
        headers : {
            "Content-Type" : "application/json",
            Authorization : `Bearer ${token}`
        },

        body : JSON.stringify(orderedItems)


    })

    const result = await response.json();
    console.log(result);

    if(!result.ok) {
        alert(result.message);
        return;
    }

    ordersBtn.click();
})


const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
});