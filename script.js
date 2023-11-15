//radio buttons
document.querySelectorAll('.bill-type-btn').forEach(btn => btn.addEventListener('click', ()=>{
    var codes = document.getElementById('finance-codes');
    let specialInstructionsText = document.getElementById('cartSpecialInstructions');
    if(btn.getAttribute('value') == "branch"){
      codes.style = "display: flex;";
      specialInstructionsText.value = "";
      specialInstructionsText.setAttribute('readonly', true);
      enabledCheckout(false);
    }else if(btn.getAttribute('value') == "creditDebit"){
      codes.style = "display: none;";
      specialInstructionsText.value = "";
      specialInstructionsText.removeAttribute('readonly');
      enabledCheckout(true);
    }
})) 


var cCompany = ["--", "BCS", "BCSC", "BCSF", "BCSG", "BCSP"];
var cFunds = ["10", "11", "12", "19", "20", "30", "31","32","40", "50", "60", "61", "70", "80", "90", "99", "FF", "UU", "ZZ"];
var cOrganization = [""];
var cBranch = [""];
var cProgram = [""];
var cAccount = [""];
var cProject = [""];



var arr = [];
var numbersArr = [];

function getFormData(){
    var rows = document.querySelectorAll('.active-allocation');
    var code = document.querySelectorAll('.active-allocation .codes');
    var num = document.querySelectorAll('.active-allocation .codes-amount');

    for(let r = 0; r < rows.length; r++){
        let string = "";
        // get codes per b
        code.forEach(c =>{
            if(c.getAttribute('code-index') == r){
                let tmp = c.value + '-';
                string += tmp;
            }
        })

        arr.push(string);
        //get amounts per r
        numbersArr.push(num[r].value);
    }

    checkForDuplicates();

}

function checkForDuplicates(){
    var print = true;
    for(let x = 0; x < arr.length-1; x++){
        for(let y = arr.length; y > 0; y--){
            if(x != y){
                if(arr[x] == arr[y]){
                    formError(0, false, 101);
                    print = false;
                }
            }
        }
    }

    if(print){
        formError(0, true, 200);
        printData();
    }
}

function printData(){

    if(arr.length > -1){
        // for prod, set to text content of textarea
        let string = "";
        for(let i = 0; i < arr.length; i++){
            let tmp = 'Allocate $' + numbersArr[i] + ' to ' + arr[i].slice(0, arr[i].indexOf(arr[i].length - 1)) + ". " + '\n';
            string += tmp;
        }

        console.log(string);
        document.getElementById('cartSpecialInstructions').value = string;
        document.getElementById('cartSpecialInstructions').textContent = string;

    }

    acknowledgePaymentMethod('show');

}


function validateData(){

    var codes = document.querySelectorAll('.active-allocation .codes');
    var amounts = document.querySelectorAll('.active-allocation .codes-amount');
    var subTotal = document.getElementById('finance-codes').getAttribute('data-total')/ Math.pow(10,2);
    var isValid = true;
    arr = [];
    numbersArr = [];
    //subTotal = 13;
    let sumText = document.getElementById('sum-of-values');

    codes.forEach(code =>{
        if(code.value === "" || code.value === "null" || code.value === null || code.value === undefined){
            formError(code, false, 100);
            isValid = false;
        }
        else {
            formError(code, true, 200);
        }
    })

    let totalAmount = 0;
    amounts.forEach(amount =>{
        var a = Number(amount.value);
        totalAmount +=  a;
        if(a <= 0){
            formError(amount, false, 102);
            isValid = false;
        }
        else {
            formError(amount, true);
        }
    })

    if(totalAmount != subTotal || totalAmount > subTotal){
        amounts.forEach(a =>{
            formError(a, false, 103);
        })
        isValid = false;
    }

    sumText.textContent = "Total: $" + totalAmount;

    if(isValid){
        getFormData();
        return true;
    }else {
        console.log('invalid');
        return false;
    }

}

function formError(input, valid, errorCode){
    let element = document.getElementById('error-container');

    try{
        errorCode;
    }catch(e){
        console.log('caught');
        element.textContent == 500;
    }

    switch(errorCode){
        case 100:
            element.textContent = "All codes are required to proceed with Bill To Branch option.";
            break;
        case 101:
            element.textContent = "Finance codes are the same, please use only one finance code if you don't have multiple allocations.";
            break;
        case 102:
            element.textContent = "The value you entered cannot be negative or zero.";
            break;
        case 103:
            element.textContent = "Inavlid Amount Totals. The sum of all amounts must total the cart subtotal.";
            break;
        case 500:
            element.textContent = "Something went wrong.";
            break;
        case 200:
            element.textContent = "";
            break;
    }

    try {
        if(!valid){
            input.style = 'border: 1px solid red;';
        }else {
            input.style = '';
        }
    }
    catch(e){
        // do nothing
    }
}


function showHideRow(show, num){
    enabledCheckout(false);
    if(show){
        document.getElementById('allocation-' + num).classList.replace('inactive-allocation', 'active-allocation');
    }else {
        document.getElementById('allocation-' + num).classList.replace('active-allocation', 'inactive-allocation');
    }
}


function acknowledgePaymentMethod(method){
    let checkoutBtn = document.getElementById('checkout-btn');
    let acknowledgement = document.getElementById('user-instruction');

    switch(method){
        case "show":
            acknowledgement.style = "display: flex";
            break;
        case "confirm":
            acknowledgement.style = "display: none";
            enabledCheckout(true);
            break;

    }
}

function enabledCheckout(enabled){
    let checkoutBtn = document.getElementById('checkout-btn');
    if(!enabled){
        checkoutBtn.setAttribute('disabled', true);
        return false;
    }else{
        checkoutBtn.removeAttribute('disabled');
        return true;
    }

}
