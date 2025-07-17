
document.addEventListener("DOMContentLoaded", function () {
    const generateBtn = document.getElementById("generateBtn");
    const addressSpan = document.getElementById("address");
    const privateKeySpan = document.getElementById("privateKey");
    const wifSpan = document.getElementById("wif");
    const walletInfo = document.getElementById("walletInfo");
    const darkToggle = document.getElementById("darkModeToggle");
    const btcPriceSpan = document.getElementById("btcPrice");

    // Load saved wallet from localStorage if exists
    if (localStorage.getItem("wallet")) {
        const wallet = JSON.parse(localStorage.getItem("wallet"));
        addressSpan.textContent = wallet.address;
        privateKeySpan.textContent = wallet.privateKey;
        wifSpan.textContent = wallet.wif;
        walletInfo.style.display = "block";
    }

    // Generate Wallet
    generateBtn.addEventListener("click", () => {
        const keyPair = bitcoin.ECPair.makeRandom();
        const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
        const privateKey = keyPair.privateKey.toString("hex");
        const wif = keyPair.toWIF();
        
        addressSpan.textContent = address;
        privateKeySpan.textContent = privateKey;
        wifSpan.textContent = wif;
        walletInfo.style.display = "block";
        
        const wallet = { address, privateKey, wif };
        localStorage.setItem("wallet", JSON.stringify(wallet));

        // generate QR
        const qr = new QRious({
            element: document.getElementById("qrCanvas"),
            value: address,
            size: 200
        });
    });

    // PDF Download
    document.getElementById("downloadPdfBtn").addEventListener("click", () => {
        const doc = new jsPDF();
        doc.text("Wishend Wallet", 20, 20);
        doc.text("Address: " + addressSpan.textContent, 20, 40);
        doc.text("Private Key: " + privateKeySpan.textContent, 20, 60);
        doc.text("WIF: " + wifSpan.textContent, 20, 80);
        doc.save("wishend-wallet.pdf");
    });

    // PNG QR Download
    document.getElementById("downloadQrBtn").addEventListener("click", () => {
        const canvas = document.getElementById("qrCanvas");
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "wishend-wallet-qr.png";
        link.click();
    });

    // Dark Mode Toggle
    darkToggle.addEventListener("change", () => {
        document.body.classList.toggle("dark-mode");
    });

    // BTC Price Fetch
    fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=idr")
        .then(res => res.json())
        .then(data => {
            btcPriceSpan.textContent = "Rp " + data.bitcoin.idr.toLocaleString();
        });
});
