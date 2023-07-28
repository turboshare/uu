import 'bootstrap';

export const CONTRACT_ADDRESS="0xcb61529a79f6c42f10fba04a54f30edd7ab7de18";

export const DEFAULT_REFERRER_ADDRESS="0xb47b7ee03096d1dd8f69ef60bd8febff71ec1364";


document.getElementById('referral').value=DEFAULT_REFERRER_ADDRESS;


document.getElementById('btnInvest1').addEventListener("click", function () {
    invest(1)
});
document.getElementById('btnInvest2').addEventListener("click", function () {
    invest(2)
});
document.getElementById('btnInvest3').addEventListener("click", function () {
    invest(3)
});
document.getElementById('btnWithdraw').addEventListener("click", function () {
    withdraw()

});




async function invest(plan) {
    let contract=await getContract();
  
    if(contract){

        let referral = document.getElementById('referral').value;
    
        let value=document.getElementById('investValue' + plan).value;
    
        contract.invest(plan,referral).send({
            feeLimit: 100_000_000,
            callValue: value * 1000000,
            shouldPollResponse: true
        });
    }



}




async function withdraw() {
    let contract=await getContract();
    if(contract){
        contract.withdraw().send({
            feeLimit: 100_000_000,
            shouldPollResponse: true
        });
    }

}



function walletInstalled(){
    if (window.web3 && window.web3.defaultAddress.base58) {
        return true;
    } else {
        return false;
    } 
}



async function getContract(){
    if(walletInstalled()){
        return window.web3.contract().at(CONTRACT_ADDRESS);
    }
}


async function readInfo(){
    let contract=await getContract();

    if(contract){
        contract.totalInvested().call().then(function(data){
            let totalInvested=window.web3.toDecimal(data["_hex"]);
            document.getElementById('totalInvested').innerHTML=totalInvested / 1000000;
        })
        contract.totalRefRewards().call().then(function(data){
            let totalRefRewards=window.web3.toDecimal(data["_hex"]);
            document.getElementById('totalRefRewards').innerHTML=totalRefRewards / 1000000;
        })
    
        contract.investors(window.web3.defaultAddress.base58).call().then(function(data){
            document.getElementById('invested').innerHTML=window.web3.toDecimal(data['invested']["_hex"]) / 1000000;
            document.getElementById('refRewards').innerHTML=window.web3.toDecimal(data['totalRef']["_hex"]) / 1000000;
        })
    
        contract.withdrawable(window.web3.defaultAddress.base58).call().then(function(data){
            document.getElementById('withdrawable').innerHTML=window.web3.toDecimal(data['amount']["_hex"]) / 1000000;
        })
    }

}

async function readEvents(){
    let contract=await getContract();

    if(contract){
        web3.getEventResult(CONTRACT_ADDRESS, {size:10})
        .then(function(data){
            let res='';
            let index=1;
            data.forEach(function(event){
                res= res + " <tr>";
                res= res + " <td>" + index + "</td>";
                res= res + " <td>" + event['timestamp'] + "</td>";
                res= res + " <td>" + event['result']['user'] + "</td>";
                res= res + " <td>" + event['result']['value']/1000000 + " MATIC</td>";
                res= res + " </tr>";
                index++;
            })
            document.getElementById('tblEvents').innerHTML=res;
        })
        .catch(function(error){
            console.log(error);
        });
    }
}






setInterval(function(){
    
    readInfo();
    readEvents();

},2000);




// setTimeout(function(){

//     if (window.web3 && window.web3.defaultAddress.base58) {
//         console.log('Wallet installed')
//     } else {
//         console.log('Wallet not installed')
//     }
// },2000);

