

var wisharr =JSON.parse(localStorage.getItem("wishListObj"))||[];

var itemcount = wisharr.length;
document.querySelector(".wishcount").innerText =` ${itemcount} Items`

// // Function to remove money from the wallet
function removeMoneyFromWallet() {
    var amountToRemove = parseFloat(prompt("Enter amount to remove from wallet:", "0"));
    var walletBalance = getWalletBalance();

    if (!isNaN(amountToRemove) && amountToRemove > 0) {
        if (amountToRemove <= walletBalance) {
            walletBalance -= amountToRemove;
            localStorage.setItem("walletBalance", walletBalance);
            updateWalletDisplay();
            checkWalletBalance();
        } else {
            alert("Insufficient balance in wallet.");
        }
    } else {
        alert("Invalid amount.");
    }
}
// Function to get the wallet balance
function getWalletBalance() {
  // Assuming wallet balance is stored in localStorage
  return parseFloat(localStorage.getItem("walletBalance")) || 0;
}

// Function to update wallet balance display
function updateWalletDisplay() {
  var walletBalance = getWalletBalance();
  document.getElementById("wallet-balance").innerText = `$${walletBalance.toFixed(2)}`;
}

// Function to add money to the wallet
function addMoneyToWallet() {
  var amountToAdd = parseFloat(prompt("Enter amount to add to wallet:", "0"));
  if (!isNaN(amountToAdd) && amountToAdd > 0) {
      var walletBalance = getWalletBalance();
      walletBalance += amountToAdd;
      localStorage.setItem("walletBalance", walletBalance);
      updateWalletDisplay();
      checkWalletBalance();
  } else {
      alert("Invalid amount.");
  }
}

// Function to check if wallet balance is sufficient for any wishlist item
function checkWalletBalance() {
  var walletBalance = getWalletBalance();
  var heartIcon = document.querySelector("#right_icon .fa-heart");
  var wishlistNotification = document.getElementById("wishlist-notification");

  // Check if there's at least one item in the wishlist that can be purchased with current wallet balance
  var isSufficient = wisharr.some(function(item) {
      return walletBalance >= parseFloat(item.price.replace(/[^\d.-]/g, ''));
  });

  if (isSufficient && walletBalance > 0) {
      // Display notification and add class for red dot
      heartIcon.classList.add("notification");
      wishlistNotification.style.display = "block";
      wishlistNotification.innerText = "Let's make your wish come true!";
  } else {
      // Remove notification and class for red dot
      heartIcon.classList.remove("notification");
      wishlistNotification.style.display = "none";
      wishlistNotification.innerText = "";
  }
}

// Add event listener to the "Add Money" button
document.getElementById("add-money-button").addEventListener("click", addMoneyToWallet);
document.getElementById("remove-money-button").addEventListener("click", removeMoneyFromWallet);


wisharr.map(function(ele,ind){

    var box =document.createElement("div")
    
   
    var image =document.createElement("img")
    image.src =ele.image_url;

    var imgbox =document.createElement("div")
    box.className ="imgbox"
    imgbox.append(image)

    box.append(imgbox)

    var para =document.createElement("p");
    para.innerText=ele.brand ;
    para.style.color="gray";
    box.append(para)

    var price = document.createElement("span");
    price.innerText = ele.price
    price.style.color ="black"

  var strikedprice = document.createElement("span");
  strikedprice.innerText = ele.strikedoffprice;
  strikedprice.style.textDecoration = "line-through";
  strikedprice.style.color ="gray";


  var offer = document.createElement("span");
  offer.innerText =ele.offer;
  offer.style.color="red";

  var pricepara =document.createElement("p");
  pricepara.className="pricepara"
  pricepara.append(price,strikedprice,offer)
  box.append(pricepara)

  var buttonrm =document.createElement("button")
  buttonrm.innerText ="Remove"
  
  buttonrm.addEventListener("click", function(){
      removefromwish(ind)
  })


  var buttonbag =document.createElement("button")
  buttonbag.innerText ="MOVE TO BAG";
  
  buttonbag.addEventListener("click", function(){
   sendtocart(ele,ind)
})



  var buttonholder = document.createElement("div");
  buttonholder.className ="buttonholder"
  buttonholder.append(buttonrm,buttonbag)
  box.append(buttonholder)

   
    document.querySelector(".container").append(box)
})



function removefromwish(ind){

wisharr.splice(ind,1)
localStorage.setItem("wishListObj",JSON.stringify(wisharr))
window.location.href="wishlist.html"

}

// localStorage.setItem("BagListObj" , JSON.stringify(bagList))
var baglist = JSON.parse(localStorage.getItem("BagListObj"))||[];

function sendtocart(ele,ind){

  baglist.unshift(ele);
  localStorage.setItem("BagListObj",JSON.stringify(baglist))

  wisharr.splice(ind,1)
  localStorage.setItem("wishListObj",JSON.stringify(wisharr))
    window.location.href="wishlist.html"

     }

document.getElementById('landingPage').addEventListener('click', function(){
window.location.href = "../Landingpage/index.html"
})

// Check wallet balance on page load
checkWalletBalance();
updateWalletDisplay();