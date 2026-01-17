(function () {
    if (window.__ABLY_TEST_INIT__) return;
    window.__ABLY_TEST_INIT__ = true;

    const button = document.createElement("button");
    button.innerText = "구매중 카드 인식 테스트";
    Object.assign(button.style, {
        position: "fixed",
        top: "80px",
        right: "16px",
        zIndex: "9999",
        padding: "10px 14px",
        background: "#c0392b",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        fontSize: "14px",
        cursor: "pointer"
    });

    document.body.appendChild(button);

    button.addEventListener("click", () => {
        const purchaseEls = Array.from(document.querySelectorAll("body *"))
            .filter(el => el.innerText === "개 구매중" || el.innerText?.includes("구매중"));

        const cards = [];

        purchaseEls.forEach(el => {
            const card = findCardRoot(el);
            if (card && !cards.includes(card)) {
                cards.push(card);
            }
        });

        cards.forEach(card => {
            card.style.outline = "3px solid red";
        });

        alert(`인식된 카드 수 ${cards.length}`);
    });

    function findCardRoot(el) {
        let current = el;

        while (current && current !== document.body) {
            const link = current.querySelector?.('a[href*="/goods/"]');
            if (link) {
                return current;
            }
            current = current.parentElement;
        }
        return null;
    }
})();
