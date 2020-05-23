let arrayHolder = [];
const dataList = document.querySelector(".data-list");
const dataContainer = document.querySelector(".dataContainer");
const loader = document.querySelector(".lds-ring");
const nextPage = document.getElementById("nextpage-btn");
const prevPage = document.getElementById("prevpage-btn");
let page = 1;
const currentPage = document.getElementById("currentPage");
const totalPage = document.getElementById("totalPage");
const searchedInput = document.getElementById("searchBar");
const borderColor = document.querySelector(".border-color");

(sessionStorage.page == null) ?  page = page : page = sessionStorage.page;


const refreshData = () =>{
    dataList.innerHTML = ""
    loader.style.display = "flex";
    getData();
    sessionStorage.page = page;
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
    const response = await fetch(`https://kalanggaman-api.herokuapp.com/database?page=${page}&limit=20`,{
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

const refreshSearchData = () =>{
    if(searchedInput.value !== ""){
        console.log(searchedInput.value)
        dataList.innerHTML = ""
        loader.style.display = "flex";
        getSearchedData()
    }
    
}


const dataDisplay = () =>{
    if(arrayHolder.length === 0){
        console.log("no results")
        borderColor.classList.add("red")
        borderColor.classList.remove("grey")
    }else{
        borderColor.classList.remove("red")
        borderColor.classList.add("grey")
    }
    arrayHolder.forEach((el,index)=>{
        let formatedDate =el.date
        let tempDayHolder ="";
        let tempYearHolder ="";
        let tempMonthHolder ="";
        
        // if (formatedDate !== undefined && formatedDate !== null){
        //     formatedDate = el.date.split("-")
        //     tempDayHolder = formatedDate[2].split("T")[0];
        //     tempYearHolder = formatedDate[0];
        //     tempMonthHolder = formatedDate[1]
        //     formatedDate = `${tempMonthHolder}/${tempDayHolder}/${tempYearHolder}`

        //     console.log("defined date")
        // }
        let li = document.createElement("li");
        if (index%2 === 0){
            li.style.background = "#F5F7F7";
        }
        li.className = "entry";
        li.innerHTML = 
        `<div class="checkbox-col col"> <input class="checkbox" type="checkbox"> </div>
        <div class="col"><h1>${el.name}</h1></div>
        <div class="email-col col"><h1>${el.email}</h1></div>
        <div class="phone-col col"><h1>${el.phoneNumber}</h1></div>
        <div class="date-col col"><h1>${el.date}</h1></div>`
        dataList.appendChild(li);
    })
    loader.style.display = "none"; 
    
}

const links = [
    "https://kalanggaman-api.herokuapp.com/database/findSpecific?search=",
    "https://kalanggaman-api.herokuapp.com/database/findSpecificFilteredByMonth?search=",
    "asd"
]
let LINK_ARRAY_CHOICE = 0

const getSearchedData = async () => {
    const response = await fetch(links[LINK_ARRAY_CHOICE]+searchedInput.value, {
        method: "GET",
        mode: "cors",
    })
    .then(response => response.json())
    .then(data => arrayHolder = data)
    dataDisplay();
    
}
 

const getTotalPage = async () =>{
    const response = await fetch(`https://kalanggaman-api.herokuapp.com/database?page=1&limit=20`,{
        method: "GET",
        mode: "cors"
    })
    .then(response => response.json())
    .then(data => totalPage.textContent = data.totalPage);

}



const blurFunc = () =>{
    if (searchedInput.value === ""){
        refreshData()
        searchedInput.removeEventListener("blur",blurFunc)
    }else{
        console.log("there is something in the search bar")
    }
} 

searchedInput.addEventListener("focus", () =>{
    searchedInput.addEventListener("blur",blurFunc)
})





const unfilterBtn = document.getElementById("unfilter-btn");
const filterBtn = document.getElementById("filter-btn");

unfilterBtn.addEventListener("click",()=>{
    LINK_ARRAY_CHOICE = 0;
    buttonChanger(filterBtn,unfilterBtn);
})

const filterByMonth = async () =>{
    dataList.innerHTML = ""
    loader.style.display = "flex";
    const response = await fetch("https://kalanggaman-api.herokuapp.com/database/currentMonthFilter")
    .then(response => response.json())
    .then(data => arrayHolder = data)
    dataDisplay();
    LINK_ARRAY_CHOICE = 1;
    buttonChanger(unfilterBtn,filterBtn);
    
}
const buttonChanger = (showBtn,hideBtn) =>{
    showBtn.style.display = "block"
    hideBtn.style.display = "none"
}

getData();
getTotalPage();