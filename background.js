chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "convertCurrency",
    title: "Convert Currency",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "convertCurrency" && info.selectionText) {
    fetch("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json") //thanks
      .then(response => response.json())
      .then(data => {
        const rates = data["usd"];
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: convertCurrency,
          args: [info.selectionText, rates]
        });
      })
      .catch(error => {
        console.error("Error fetching rates:", error);
        alert("Failed to fetch currency conversion rates.");
      });
  }
});

function convertCurrency(selectedText, rates) {
  const amount = parseFloat(selectedText.replace(/[^0-9.-]+/g, ""));
  if (isNaN(amount)) {
    alert("Selected text is not a valid number");
    return;
  }

  const dt=new Date().toJSON().slice(0,10).replace(/-/g,'/');
  const cny = parseFloat((amount * rates["cny"]).toFixed(2)).toLocaleString();
  const gbp = parseFloat((amount * rates["gbp"]).toFixed(2)).toLocaleString();
  const jpy = parseFloat((amount * rates["jpy"]).toFixed(2)).toLocaleString();
  const krw = parseFloat((amount * rates["krw"]).toFixed(2)).toLocaleString();
  const eur = parseFloat((amount * rates["eur"]).toFixed(2)).toLocaleString();
  const cad = parseFloat((amount * rates["cad"]).toFixed(2)).toLocaleString();

  alert(`$${amount} is approximately:
  - ¥${cny} CNY
  - ₩${krw} KRW
  - ¥${jpy} JPY
  - £${gbp} GBP
  - €${eur} EUR
  - $${cad} CAD
  
  Last updated : ${dt}
  `);
}
