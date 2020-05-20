let arrayHolder = [];
const dataList = document.querySelector(".data-list");
const dataContainer = document.querySelector(".dataContainer");
const loader = document.querySelector(".lds-ring");
const nextPage = document.getElementById("nextpage-btn");
const prevPage = document.getElementById("prevpage-btn");
let page = 1;

const refreshData = () =>{
    dataList.innerHTML = ""
    getData();
}
nextPage.addEventListener("click",()=>{
    page++;
    refreshData();
})
prevPage.addEventListener("click",()=>{
    page--;
    refreshData();
})

const getData = async () =>{
    const response = await fetch(`https://kalanggaman-api.herokuapp.com/database?page=${page}&limit=5`,{
        method: "GET",
        mode: "cors"
    })
    .then(response => response.json())
    .then(data => {
         arrayHolder = data.results;
    })
    loader.style.display = "none";   
    dataDisplay()
}



const dataDisplay = () =>{
    arrayHolder.forEach((el,index)=>{
        let li = document.createElement("li");
        if (index%2 === 0){
            li.style.background = "#F5F7F7";
        }
        li.className = "entry";
        li.innerHTML = 
        `<div class="checkbox-col col"> <input class="checkbox" type="checkbox"> </div>
        <div class="name-col col"><h1>${el.name}</h1></div>
        <div class="email-col col"><h1>${el.email}</h1></div>
        <div class="phone-col col"><h1>${el.phoneNumber}</h1></div>
        <div class="date-col col"><h1>Date Reserved</h1></div>`
        dataList.appendChild(li);
    })
    
}
getData();