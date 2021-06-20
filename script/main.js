async function fetchJSONAsync(url, init) {
    let response = await fetch(url, init);
    if (response.ok) {
        let json = await response.json();
        return json;
    } else
        throw new Error(`${response.status}: ${response.statusText}`);
}

var container = $(".converter-widget").find(".group").html();

const currencyDate = document.querySelector(".converter-widget .date");

var firstInput = $("#firstInput");
var secondInput = $("#secondInput");

var firstSelect = $("#first-select");
var secondSelect = $("#second-select");


$(firstSelect).change(() => {
    firstSelect_change();
});
$(secondSelect).change(() => {
    secondSelect_change();
});
$(firstInput).change(() => {
    firstInput_input();
});
$(secondInput).change(() => {
    secondInput_input();
});


let data, obj1, obj2;

function firstSelect_change() {
    obj1 = data.find(e => e.Cur_Abbreviation === firstSelect.val());
    obj2 = data.find(e => e.Cur_Abbreviation === secondSelect.val());
    firstInput_input();
}

function firstInput_input() {
    let value = firstInput.val();
    secondInput.val((obj2.Cur_Scale * value * obj1.Cur_OfficialRate / obj2.Cur_OfficialRate / obj1.Cur_Scale).toFixed(2));
}

function secondSelect_change() {
    obj1 = data.find(e => e.Cur_Abbreviation === firstSelect.val());
    obj2 = data.find(e => e.Cur_Abbreviation === secondSelect.val());
    firstInput_input();
}

function secondInput_input() {
    let value = secondInput.val();
    firstInput.val((obj2.Cur_OfficialRate * value * obj1.Cur_Scale / obj2.Cur_Scale / obj1.Cur_OfficialRate).toFixed(2));
}

function changeCur() {
    setDateTime();
    setSelected(valStart = secondSelect.val(), valEnd = firstSelect.val());
    firstSelect_change();
}

function setDateTime() {
    let date = new Date(data[0].Date);
    currencyDate.innerHTML = date.toLocaleDateString('ru-RU');
}

function setSelected(valStart = "USD", valEnd = "RUB") {
    firstSelect.val(valStart);
    secondSelect.val(valEnd);
}

function request() {
    setDateTime();
    for (let e of data) {
        firstSelect.append(new Option(e.Cur_Name, e.Cur_Abbreviation));
        secondSelect.append(new Option(e.Cur_Name, e.Cur_Abbreviation));
    }
    setSelected();
    firstInput.val(1);
    firstSelect_change();
}

(async function main() {
    try {
        data = await fetchJSONAsync("https://www.nbrb.by/api/exrates/rates?periodicity=0");
        request();
    } catch (error) {
        console.log(error.message);
    }
})();