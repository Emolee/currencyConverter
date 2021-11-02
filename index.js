//src: https://exchangeratesapi.io/documentation/
//the documentation on exchangerateapi.io helped me a lot
//in terms of how i should go about implementing the javascript.
//here is the code that was supplied through their website:
//------------------------------------------------------------
let url = 'http://api.exchangeratesapi.io/v1/';

//method for getting the current time and date:
let myTd = new Date();
document.getElementById('myTimeDate').innerHTML = myTd;

//function for getting all symbol options:
function getSymbols(mySymbol) {
    fetch(`${url}/symbols?${getParameters()}`)
        .then(res => res.json())
        .then(res => {
            for (mySymbol of Object.keys(res.symbols)) {
                let myOption = document.createElement("option");
                let myOtherOption = document.createElement("option");
                myOption.text = mySymbol;
                myOption.value = mySymbol;
                myOtherOption.text = mySymbol;
                myOtherOption.value = mySymbol;
                document.getElementById("firstCurrency").append(myOption);
                document.getElementById("secondCurrency").append(myOtherOption);
            }
            let selectedAmount = document.getElementById("firstAmount");
            let selectedCurrency = document.getElementById("firstCurrency");
            //select selected currency to be NOK:
            selectedCurrency.value = 'NOK';
            document.getElementById('selectedCurrency').innerHTML = selectedAmount.value + " " + selectedCurrency.value;
            let resultantAmount = document.getElementById("secondAmount");
            let resultantCurrency = document.getElementById("secondCurrency");
            //select resultant currency to be EUR:
            resultantCurrency.value = 'EUR';
            document.getElementById('resultantCurrency').innerHTML = resultantAmount.value + " " + resultantCurrency.value;
        })
}
getSymbols();

//function for getting each parameter using my
//specific API access key:
//your API access key is needed for every request
//that is made, so i made a function that took care
//of this for us, and spread it across the myParams
//object.
function getParameters(myParam) {
    return new URLSearchParams({
        access_key: '6d61cae14acbd3c36f56bee340dae8f6',
        ...myParam
    });
}

//function for getting the latest options
//this function records all options and
//records them into a json file. we then connect
//the options to the rates and say that those
//options are equal to all of the possible rates
//we can work with.
let possibleRates = '';

function getLatestEnd(myOptions) {
    fetch(`${url}/latest?${getParameters(myOptions)}`)
        .then(res => res.json())
        .then(res => {
            //convert
            possibleRates = res.rates; //rate data is stored in possible rates.
        })
}

//this function takes care of converting from one currency to another.
//since we do not have access to converting through the APIs keywords,
//we had to resort with working with its default base, the euro. we convert
//from euro to the initial currency we want, and euro to the desired currency.
//then we just sandwich the rest together. how do we do this? we plug in the
//first and second values to the html <input> tags of "firstAmount and
//secondAmount," and its currency value to the <select> tags of "firstCurrency
//and secondCurrency." this tells the html that this javascript event is being
//wired to it through its id specifications.
function runConversion(myEvent) {
    //register changes on <p> and <h3> tags whenever there's a change here:
    let firstValue = document.getElementById("firstAmount");
    let firstCurrencyValue = document.getElementById("firstCurrency");
    let secondValue = document.getElementById("secondAmount");
    let secondCurrencyValue = document.getElementById("secondCurrency");

    //if the event's target id is equal to the first amount or the type of currency it is,
    //then we want to divide the first value's value by all possible rates of the first
    //currency's value. then we want to multiply the euro's value by all possible rates
    //of the second currency value. then we say that the second value's value is equal to
    //the target value * 100 / 100, for rounding to the nearest hundreth.
    if (myEvent.target.id === "firstAmount" || myEvent.target.id === "firstCurrency") {
        let eurValue = firstValue.value / possibleRates[firstCurrencyValue.value];
        let targetValue = eurValue * possibleRates[secondCurrencyValue.value];
        secondValue.value = Math.round(targetValue * 100) / 100;
        console.log(firstCurrencyValue.value);
        console.log(secondCurrencyValue.value);
        console.log(targetValue);

    //it is the same concept for the second amount, just flipped.
    } else if (myEvent.target.id === "secondAmount" || myEvent.target.id === "secondCurrency") {
        let eurValue = secondValue.value / possibleRates[secondCurrencyValue.value];
        let targetValue = eurValue * possibleRates[firstCurrencyValue.value];
        firstValue.value = Math.round(targetValue * 100) / 100;
        console.log(secondCurrencyValue.value);
        console.log(firstCurrencyValue.value);
        console.log(targetValue);
    }

    //this updates the currency values in <p> and <h3> after converting values.
    document.getElementById('selectedCurrency').innerHTML = firstValue.value + " " + firstCurrencyValue.value;
    document.getElementById('resultantCurrency').innerHTML = secondValue.value + " " + secondCurrencyValue.value;

}

//change whenever someone changes the first value or select drop down, then runConversion()
let firstSelectChange = document.getElementById("firstAmount");
firstSelectChange.addEventListener("change", runConversion);
let firstSelectCurrency = document.getElementById("firstCurrency");
firstSelectCurrency.addEventListener("change", runConversion);
//change whenever someone changes the second value or select drop down, then runConversion()
let secondSelectChange = document.getElementById("secondAmount");
secondSelectChange.addEventListener("change", runConversion);
let secondSelectCurrency = document.getElementById("secondCurrency");
secondSelectCurrency.addEventListener("change", runConversion);

//lastly, we call this method to get all of those possible rates at our disposal.
getLatestEnd();

