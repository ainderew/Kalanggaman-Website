let arrayHolder = [];
const dataList = document.querySelector(".data-list");
const dataContainer = document.querySelector(".dataContainer");
const loader = document.querySelector(".lds-ring");
const nextPage = document.getElementById("nextpage-btn");
const prevPage = document.getElementById("prevpage-btn");
let page = 1;
const currentPage = document.getElementById("currentPage");
const totalPage = document.getElementById("totalPage");

(sessionStorage.page == null) ?  page = page : page = sessionStorage.page;


const refreshData = () =>{
    dataList.innerHTML = ""
    loader.style.display = "block";
    getData();
    sessionStorage.page = page;
}
const refreshSearchData = () =>{
    dataList.innerHTML = ""
    loader.style.display = "block";
    dataDisplay();
}

nextPage.addEventListener("click",()=>{
    page++;
    refreshData();
})
prevPage.addEventListener("click",()=>{
    page--;
    refreshData();
})

const pageBtnHider = (prev,next) => {
    (prev == undefined) ? prevPage.style.display = "none" : prevPage.style.display = "inline-block";
    (next == undefined) ? nextPage.style.display = "none" : nextPage.style.display = "inline-block";
}
const getData = async () =>{
    const response = await fetch(`https://kalanggaman-api.herokuapp.com/database?page=${page}&limit=5`,{
        method: "GET",
        mode: "cors"
    })
    .then(response => response.json())
    .then(data => {
         arrayHolder = data.results;
         currentPage.textContent = data.current.page;
         pageBtnHider(data.prev,data.next)
    })
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
    loader.style.display = "none"; 
    
}
const getTotalPage = async () =>{
    const response = await fetch(`https://kalanggaman-api.herokuapp.com/database?page=1&limit=5`,{
        method: "GET",
        mode: "cors"
    })
    .then(response => response.json())
    .then(data => totalPage.textContent = data.totalPage);

}

const getSearchedData = async () => {
    let searchedInput = document.getElementById("searchBar")
    console.log(searchedInput.value)
    const response = await fetch(`http://localhost:3000/database/findSpecific?search=${searchedInput.value}`, {
        method: "GET",
        mode: "cors",
    })
    .then(response => response.json())
    .then(data => arrayHolder = data)
    console.log(arrayHolder);
    refreshSearchData();
}
 
    
getData();
getTotalPage();