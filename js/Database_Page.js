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
    const response = await fetch(`https://kalanggaman-api.herokuapp.com/database?page=${page}&limit=15`,{
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
    checkboxTracker() ;
    
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
    const response = await fetch(`https://kalanggaman-api.herokuapp.com/database?page=1&limit=15`,{
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

const deleteBtn = document.getElementById("delete-btn")
const checkboxTracker = () =>{
    let checkboxArray = [];
    let checkboxes = document.querySelectorAll(".checkbox");
    checkboxes.forEach((el,index) =>{
        el.addEventListener("click", ()=>{
            (el.checked) ? checkboxArray.push(index) : checkboxArray.splice((checkboxArray.indexOf(index)),1);
        })
    })
    deleteBtn.addEventListener("click",async ()=>{
        dataList.innerHTML = ""
        loader.style.display = "flex"
        for(const el of checkboxArray){
            await fetch(`https://kalanggaman-api.herokuapp.com/delete?name=${arrayHolder[el].name}&email=${arrayHolder[el].email}`)
        }
        await refreshData()
    })

}
getData();
getTotalPage();





//charts
const ctx = document.getElementById('cavas').getContext('2d');

const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        },
        responsive: false
    }
});




//menu
//Screen
const databaseScreen = document.querySelector(".database-page-container");
const chartScreen = document.querySelector(".chart-page-container")

//Menu Buttons
const databaseMenuBtn = document.getElementById("databaseMenuBtn");
const chartMenuBtn = document.getElementById("chartMenuBtn");


let activeScreen = databaseScreen;
let activeMenuBtn = databaseMenuBtn;

const screenChanger = (screenIn,screenOut,menuIndicatorIn,menuIndicatorOut) =>{
    screenIn.classList.remove("screen-hider");
    menuIndicatorIn.classList.add("active-page");
    screenOut.classList.add("screen-hider");
    menuIndicatorOut.classList.remove("active-page");
    activeScreen = screenIn;
    activeMenuBtn = menuIndicatorIn;

}
databaseMenuBtn.addEventListener("click",()=>{
    if (activeScreen !== databaseScreen){
        screenChanger(databaseScreen,activeScreen,databaseMenuBtn,activeMenuBtn);
    }
})
chartMenuBtn.addEventListener("click",()=>{
    screenChanger(chartScreen,activeScreen,chartMenuBtn,activeMenuBtn);
})
