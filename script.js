const firebaseConfig = {
    apiKey: "AIzaSyBhmgeexv6ZHPhVlEazZe3_2i7qVHRtRDs",
    authDomain: "king-of-the-street-shop-c625d.firebaseapp.com",
    projectId: "king-of-the-street-shop-c625d",
    storageBucket: "king-of-the-street-shop-c625d.firebasestorage.app",
    appId: "1:135739038699:web:727bc7a0f4bf2e39d657ae"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const BOT_TOKEN = "8526807871:AAGuFjDoVdNM04TnzUhxzdEAOG01VOb3j7U";
const CHAT_ID = "6972208496";

let allProducts = [];

db.collection("products").orderBy("time", "desc").onSnapshot(snap => {
    allProducts = [];
    snap.forEach(doc => allProducts.push({ id: doc.id, ...doc.data() }));
    renderProducts(allProducts);
});

function renderProducts(products) {
    const grid = document.getElementById('shop');
    grid.innerHTML = "";
    products.forEach(p => {
        grid.innerHTML += `
            <div class="card">
                <small style="color:var(--red)">${p.category}</small>
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

    const order = { name: cName, phone, address: addr, item: name, price, time: new Date().toLocaleString() };

    db.collection("orders").add(order).then(() => {
        const msg = `🛒 *New Order*\nName: ${cName}\nPhone: ${phone}\nAddr: ${addr}\nItem: ${name}\nPrice: ${price}`;
        fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(msg)}&parse_mode=Markdown`);
        alert("Order တင်ပြီးပါပြီ!");
    });
}
