const cartIcon =document.querySelector("#cart-icon");
const cart =document.querySelector(".cart");
const closeCart =document.querySelector("#cart-close");
let itemsAdded = [];

cartIcon.addEventListener('click',()=> {
    cart.classList.add("active");
})

closeCart.addEventListener('click',()=> {
    cart.classList.remove("active");
})

if(document.readyState == 'loading'){
    document.addEventListener('DOMContentLoaded',start);
}else{
    start();
}

function start(){
    addEvents();
    retrieveCartItems(); // Retrieve cart items from storage
    updateTotal();
}

function update(){
    addEvents();
    updateTotal();
    saveCartItems();
}

function addEvents() {
    // Add item to cart
    let addCart_btns = document.querySelectorAll('.add-cart');
    addCart_btns.forEach(btn => {
      btn.addEventListener('click', handle_addCartItem);
    });
    
    // // Remove items
    // let cartRemove_btns = document.querySelectorAll('.cart-remove');
    // cartRemove_btns.forEach(btn => {
    //   btn.addEventListener("click", handle_removeCartItems);
    // });
    const cartContent = cart.querySelector(".cart-content");

    cartContent.addEventListener("click", function(event) {
        if (event.target.classList.contains("cart-remove")) {
            handle_removeCartItems.call(event.target);
          }
        });
  
    // // Change item quantity
    // let cartQuantity_inputs = document.querySelectorAll('.cart-quantity');
    // cartQuantity_inputs.forEach(input => {
    //   input.addEventListener("change", handle_changeItemQuantity);
    // });
    cartContent.addEventListener("change", function(event) {
        if (event.target.classList.contains("cart-quantity")) {
          handle_changeItemQuantity.call(event.target);
        }
      });
  
    // Buy Order
    const buy_btn = document.querySelector(".btn-buy");
    buy_btn.addEventListener("click", handle_buyOrder);
}
  

function handle_addCartItem(event){
    let button = event.target;
    let product = button.parentElement;
    let title = product.querySelector(".product-title").innerHTML;
    let price = product.querySelector(".product-price").innerHTML;
    let imgSrc = product.parentElement.querySelector('.product-img').src;
    console.log(title,price,imgSrc);

    let newToAdd = {
        title,
        price,
        imgSrc
    };
    
    if (itemsAdded.find(el => el.title == newToAdd.title)) {
        alert("This Item Is Already Exist In The Cart!");
        return;
    }else {
        itemsAdded.push(newToAdd);
    }
    
    let cartBoxElement = CartBoxComponent(title, price, imgSrc);
    let newNode = document.createElement("div");
    newNode.innerHTML = cartBoxElement;
    const cartContent = cart.querySelector(".cart-content");
    cartContent.appendChild(newNode);
    
    update();
}

function handle_removeCartItems(){
    this.parentElement.remove();
    itemsAdded = itemsAdded.filter(el => el.title != this.parentElement.querySelector('.cart-product-title').innerHTML);
    update();
}

function handle_changeItemQuantity(){
    if(isNaN(this.value) || this.value < 1) {
        this.value =1;
    }
    this.value = Math.floor(this.value);// to keep it integer
    update();
}

function handle_buyOrder(){
    if(itemsAdded.length <= 0){
        alert("There Is No Order Placed Yet!\nPlease Make An Order First.");
        return;
    }
    const cartContent = cart.querySelector(".cart-content");
    cartContent.innerHTML = '';
    alert("Your Order Is Placed Successfully!");
    itemsAdded = [];
    update();
}

function updateTotal() {
    let cartBoxes = document.querySelectorAll('.cart-box');
    const  totalElement = cart.querySelector('.total-price');
    let total =0;
    cartBoxes.forEach(cartBox => {
        let priceElement = cartBox.querySelector('.cart-price');
        let price = parseFloat(priceElement.innerHTML.replace("$", ""));
        let quanity = cartBox.querySelector(".cart-quantity").value;
        total += price * quanity;
    });

    //keep 2 digits after the decimal point
    total = total.toFixed(2);


    totalElement.innerHTML = "$" +  total;
}
function CartBoxComponent(title,price,imgSrc){
    return `
    <div class="cart-box">
    <img src="${imgSrc}" alt="" class="cart-img">
    <div class="details-box">
        <div class="cart-product-title">${title}</div>
        <div class="cart-price">${price}</div>
        <input type="number" value="1" class="cart-quantity">
    </div>
    <i class='bx bxs-trash-alt cart-remove'></i>
    </div>`;
}

function saveCartItems() {
    localStorage.setItem('cartItems', JSON.stringify(itemsAdded));
  }
  
function retrieveCartItems() {
    const storedItems = localStorage.getItem('cartItems');
    if (storedItems) {
      itemsAdded = JSON.parse(storedItems);
      for (const item of itemsAdded) {
        let cartBoxElement = CartBoxComponent(item.title, item.price, item.imgSrc);
        let newNode = document.createElement("div");
        newNode.innerHTML = cartBoxElement;
        const cartContent = cart.querySelector(".cart-content");
        cartContent.appendChild(newNode);
      }
    }
  }

const products = [
    { name: "Under Armour Men's Charged Assert 10 Running Shoe",link: "product-details1"},
    { name: "New Balance Men's 608 V5 Cross Trainer", link: "product-details-nb"},
    { name: "Adidas Women's Cloudfoam Pure 2.0 Running Shoe", link: "product-details-adidas"},
    { name: "Under Armour Men's Charged Pursuit 3 Running Shoe", link:"product-details-uarun"},
    { name: "Nike mens Air Jordan 1 Mid Shoes, Cement Grey/White-true Blue",link: "product-details-nike"},
    { name: "ASUS ROG Strix G16 (2023) Gaming Laptop",link: "product-details-rog"},
    { name: "Acer Nitro 5 AN515-58-525P Gaming Laptop",link: "product-details-acer"},
    { name: "ASUS TUF Gaming F15 Gaming Laptop",link: "product-details-tuf"},
    { name: "Breitling Solid Rose Gold Navitimer 1 B01 Chronograph 43 Mens Watch",link: "product-details-breitling"},
    { name: "SAMSUNG Galaxy Watch 4 Classic 46mm Smartwatch",link: "product-details-initial"},
    { name: "GUESS 48MM Crystal Embellished Watch",link: "product-details-guess"},
    { name: "Bulova Men's Marine Star Watch",link: "product-details-bulova"},
];

// Function to display product list
function displayProducts(products) {
    const productList = document.getElementById("productList");
    productList.innerHTML = "";

    products.forEach(product => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="${product.link}.html">${product.name}</a>`;
        productList.appendChild(li);
    });
}

// Function to filter products based on search query
function searchProducts(query) {
    const filteredProducts = products.filter(product => {
        return product.name.toLowerCase().includes(query.toLowerCase());
    });

    displayProducts(filteredProducts);
}

function toggleDropdown(show) {
    const dropdown = document.getElementById("searchDropdown");
    if (show) {
        dropdown.classList.add("show");
    } else {
        dropdown.classList.remove("show");
    }
}

function handleDropdownSelection(product) {
    searchInput.value = product.name;
    toggleDropdown(false);
    location.href = `${product.link}.html`;
  }

// Event listener for search input
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", () => {
    const query = searchInput.value;
    if (query.length > 0) {
      const matchedProducts = products.filter(product => {
        return product.name.toLowerCase().startsWith(query.toLowerCase());
      });
  
      const dropdown = document.getElementById("searchDropdown");
      dropdown.innerHTML = "";
  
      matchedProducts.forEach(product => {
        const li = document.createElement("li");
        const link = document.createElement("a");
        link.href = `${product.link}.html`;
        link.textContent = product.name;
        link.addEventListener("click", event => {
          event.preventDefault();
          handleDropdownSelection(product);
        });
        li.appendChild(link);
        dropdown.appendChild(li);
      });
  
      toggleDropdown(true);
    } else {
      toggleDropdown(false);
    //   displayProducts(products);
    }
  });

// Initial display of all products
// displayProducts(products);

function validateform(event){
  //buat nyimpen data yang dimasukan user
  var username = document.getElementById("username").value
  var email= document.getElementById("email").value
  var password= document.getElementById("password").value
  var checkpassword= document.getElementById("checkpassword").value
  //checked will retrun true kalo dia dipilih
  var errormessage= document.getElementById("errormessage").value

  event.preventDefault()
  if(username == ""){
      alert("Username cannot be empty")
  }else if(!email.endsWith("@gmail.com")){
      alert("Email must ends with @gmail.com")
  }else if(!CheckPassword(password)){
      alert("Password must be at least 8 characters and must inlcude both characters and numbers")
  }else if(checkpassword != password){
      alert("Password check must be the same as password")
  }else{
    window.location.href = "index.html";
  }
}

function CheckPassword(password){
  if(password.length<8){
      return false
  }
  isAlpha=false
  isNum=false

  for(var i=0;i<password.length;i++){
      //NaN -> not a number, if not number it will reurn true
      if(isNaN(password[i])){
          isAlpha=true
      }else{
          isNum=true
      }
      if(isAlpha && isNum){
          return true
      }
  }
  return false
}


