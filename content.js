(function () {
    if (window.__ABLY_PURCHASE_SORT_V2__) return;
    window.__ABLY_PURCHASE_SORT_V2__ = true;

    let originalOrder = null;

    const sortBtn = createButton("구매중 많은순 정렬", "80px");
    const resetBtn = createButton("원래 순서", "130px");

    sortBtn.addEventListener("click", () => {
        const goodsLinks = Array.from(
            document.querySelectorAll('a[href^="https://m.a-bly.com/goods/"]')
        );

        if (goodsLinks.length === 0) {
            alert("상품 링크를 찾지 못했어");
            return;
        }

        const products = goodsLinks
            .map(link => {
                const root = findProductRoot(link);
                const count = findPurchaseCount(root);
                return { root, count };
            })
            .filter(p => p.root && typeof p.count === "number");

        if (products.length === 0) {
            alert("구매중 숫자를 인식하지 못했어");
            return;
        }

        const container = products[0].root.parentElement;
        if (!container) {
            alert("상품 컨테이너를 찾지 못했어");
            return;
        }

        if (!originalOrder) {
            originalOrder = Array.from(container.children);
        }

        products.sort((a, b) => b.count - a.count);

        products.forEach(p => {
            container.appendChild(p.root);
        });

        applyFourColumnLayout(container);

        alert("구매중 많은 순으로 정렬 완료");
    });

    resetBtn.addEventListener("click", () => {
        if (!originalOrder) {
            alert("원래 순서 정보가 없어");
            return;
        }

        const container = originalOrder[0].parentElement;
        container.innerHTML = "";

        originalOrder.forEach(node => {
            container.appendChild(node);
        });

        applyFourColumnLayout(container);

        alert("원래 순서로 복구 완료");
    });

    function createButton(text, top) {
        const btn = document.createElement("button");
        btn.innerText = text;
        Object.assign(btn.style, {
            position: "fixed",
            top: top,
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
        document.body.appendChild(btn);
        return btn;
    }

    function findProductRoot(link) {
        let el = link;
        while (el && el !== document.body) {
            if (el.querySelector && el.querySelector("img")) {
                return el;
            }
            el = el.parentElement;
        }
        return null;
    }

    function findPurchaseCount(root) {
        if (!root) return null;
        const text = root.innerText || "";
        const match = text.match(/(\d+)\s*개\s*구매중/);
        return match ? Number(match[1]) : null;
    }

    function applyFourColumnLayout(container) {
        container.style.display = "grid";
        container.style.gridTemplateColumns = "repeat(4, 1fr)";
        container.style.columnGap = "8px";
        container.style.rowGap = "16px";
    }
})();
