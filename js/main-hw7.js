let allData,
    $cardsWrap = document.querySelector("[data-projects]"),
    $filterArea = document.querySelector("[data-filterArea]");

axios
    .get("./data/project-tickets.json")
    .then((res) => {
        allData = res.data;
        //console.log(allData);
        init(allData);
        showChart(allData);
    })
    .catch((err) => {
        console.log(err);
    });

// 初始化
function init(info) {
    $cardsWrap.innerHTML = "";
    info.forEach((item) => {
        $cardsWrap.innerHTML += `
        <div class="l-cards__item">
            <a href="" class="c-card">
                <div class="c-card__tag">
                    <p>${item.area}</p>
                </div>
                <div class="c-card__kv">
                    <img
                        src="${item.imgUrl}"
                        alt="${item.name}"
                    />
                </div>
                <div class="c-card__badge">${item.rate}</div>
                <div class="c-card__content">
                    <div class="c-card__tit c-card__tit--underline">${item.name}</div>
                    <div class="c-card__txt">
                        <p>${item.description}</p>
                    </div>
                </div>
                <div class="c-card__merchandise">
                    <div class="l-merchandise">
                        <div class="o-hint">
                            <i class="o-hint__ico o-hint__ico--info"></i>
                            <div class="o-hint__txt">剩下最後 ${item.group} 組</div>
                        </div>
                        <div class="o-price">
                            <p class="o-price__currency">TWD</p>
                            <p class="o-price__num">$${item.price}</p>
                        </div>
                    </div>
                </div>
            </a>
        </div>`;
    });
    document.querySelector("[data-totalNum]").textContent = info.length;
}

// 增加套票
let $addBtn = document.querySelector("[data-add]");
$addBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let ticketName = document.querySelector("#ticketName").value,
        ticketImgUrl = document.querySelector("#ticketImgUrl").value,
        ticketArea = document.querySelector("#ticketArea").value,
        ticketPrice = document.querySelector("#ticketPrice").value,
        ticketGroup = document.querySelector("#ticketGroup").value,
        ticketRate = document.querySelector("#ticketRate").value,
        ticketDec = document.querySelector("#ticketDec").value;
    let addInfo = [
        {
            name: "",
            imgUrl: "",
            area: "",
            price: 0,
            group: 0,
            rate: 0,
            description: "",
        },
    ];
    addInfo.name = ticketName;
    addInfo.imgUrl = ticketImgUrl;
    addInfo.area = ticketArea;
    addInfo.price = ticketPrice;
    addInfo.group = ticketGroup;
    addInfo.rate = ticketRate;
    addInfo.description = ticketDec;
    allData.push(addInfo);
    init(allData);
    showChart(allData);
});

// 地區篩選
$filterArea.addEventListener("change", (e) => {
    let areaName = e.target.value;
    let filterData = allData.filter(function(item) {
        if (areaName === '全部地區') {
            return item
        } else {
            return item.area == areaName;
        }
    });
    init(filterData);
});

// C3 Chart 資料準備
let totalObj = {};
let chartData = [];
function showChart(allData) {
    allData.forEach((item) => {

        if (totalObj[item.area] == undefined) {
            totalObj[item.area] = 1;
        } else {
            totalObj[item.area] += 1;
        }
    });
    // console.log('totalObj', totalObj);  // {高雄: 2, 台北: 1, 台中: 1, 彰化: 1}

    // let areaAry = Object.keys(totalObj);
    // console.log('areaAry', areaAry);    // ["高雄", "台北", "台中", "彰化"]

    // areaAry.forEach((item) => {
    //     let tempObj = {};
    //     let tempAry = [];
    //     tempObj.name = item;
    //     tempObj.num = totalObj[item];
    //     tempAry.push(tempObj)
    //     chartData.push(tempObj);
    // });
    //console.log('chartData', chartData);

    // C3 Chart
    c3.generate({
        bindto: ".c-cart",
        data: {
            json: [totalObj],
            keys: {
                value: ['高雄', '台北', '台中', '彰化']
            },
            type: "donut",
            indexLabelFontColor: "red",
        },
        color: { pattern: ['#64C3BF', '#00807E', '#00000029', '#E68618'] },
        size: {
            width: 360,
            height: 184,
        },
        donut: {
            label: {
                show: false,
                // format: function(value, ratio, id) {
                //     return d3.format('$')(value);
                // }
            },
            title: "套票地區比重",
            width: 10
        },
    });
}
