// script.js
const SHEETDB_URL = "https://sheetdb.io/api/v1/p2de2efcg0awa"; // SheetDB ကရလာတဲ့ Link ထည့်ရန်
const BOT_TOKEN = "8526807871:AAGuFjDoVdNM04TnzUhxzdEAOG01VOb3j7U";
const CHAT_ID = "6972208496";

let allProducts = [];

// Google Sheet မှ Data ဆွဲထုတ်ခြင်း
async function loadProducts() {
    try {
        const response = await fetch(SHEETDB_URL);
        allProducts = await response.json();
        renderProducts(allProducts);
    } catch (error) {
        console.error("Data ဆွဲလို့မရပါ:", error);
    }
}

function renderProducts(products) {
    const grid = document.getElementById('shop');
    grid.innerHTML = "";
    products.forEach(p => {
        grid.innerHTML += `
            <div class="card">
                <small style="color:#ff3e3e">${p.category}</small>
                <img src="${p.image}">
                <h3>${p.name}</h3>
                <div class="price">${p.price} MMK</div>
                <p class="desc">${p.description || 'No description available.'}</p>
                <button class="buy-btn" onclick="buy('${p.name}', '${p.price}')">Order Now</button>
            </div>`;
    });
}

function filterItems(cat) {
    cat === 'All' ? renderProducts(allProducts) : renderProducts(allProducts.filter(p => p.category === cat));
}

function buy(name, price) {
    const cName = prompt("အမည် -");
    const phone = prompt("ဖုန်းနံပါတ် -");
    const addr = prompt("နေရပ်လိပ်စာ -");
    if(!cName || !phone || !addr) return alert("အကုန်ဖြည့်ပါ");

    // Telegram သို့ Order ပို့ခြင်း
    const msg = `🛒 *New Order from KOTS*\n\nName: ${cName}\nPhone: ${phone}\nAddr: ${addr}\nItem: ${name}\nPrice: ${price}`;
    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(msg)}&parse_mode=Markdown`);
    
    alert("Order တင်ပြီးပါပြီ!");
}

loadProducts(); // Website တက်လာတာနဲ့ စခေါ်ပေးပါ
