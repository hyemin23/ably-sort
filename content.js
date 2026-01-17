(function () {
    if (window.__ABLY_SORT_FINAL__) return;
    window.__ABLY_SORT_FINAL__ = true;

    const button = document.createElement("button");
    button.innerText = "구매중 오름차순";
    Object.assign(button.style, {
        position: "fixed",
        top: "80px",
        right: "16px",
        zIndex: "9999",
        padding: "10px 14px",
        background: "#111",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        fontSize: "14px",
        cursor: "pointer"
    });

    document.body.appendChild(button);
    button.addEventListener("click", sortProducts);

    function sortProducts() {
        const goodsLinks = Array.from(
            document.querySelectorAll('a[href^="https://m.a-bly.com/goods/"]')
        );

        if (goodsLinks.length === 0) {
            alert("상품을 찾지 못했어");
            return;
        }

        const products = goodsLinks.map(link => {
            const root = findProductRoot(link);
            const count = extractPurchaseCount(root);
            return { root, count };
        }).filter(p => p.root);

        products.sort((a, b) => a.count - b.count);

        const firstRoot = products[0].root;
        const parent = firstRoot.parentElement;
        const insertBeforeNode = firstRoot;

        products.forEach(p => {
            parent.insertBefore(p.root, insertBeforeNode);
        });
    }

    function findProductRoot(link) {
        let el = link;
        while (el && el !== document.body) {
            if (
                el.querySelector &&
                el.querySelector("img") &&
                el.innerText.includes("구매중")
            ) {
                return el;
            }
            el = el.parentElement;
        }
        return null;
    }

    function extractPurchaseCount(root) {
        if (!root) return Number.MAX_SAFE_INTEGER;
        const match = root.innerText.match(/(\d+)\s*개\s*구매중/);
        return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
    }
})();
