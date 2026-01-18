(function () {
    if (window.__ABLY_SCROLL_AND_SORT_FINAL__) return;
    window.__ABLY_SCROLL_AND_SORT_FINAL__ = true;

    let originalOrder = null;
    let sorted = false;
    let scrolling = false;
    let scrollTimer = null;

    const scrollBtn = createButton("스크롤 끝까지 로드 ON", "180px");
    const sortBtn = createButton("구매중 많은순 정렬 ON", "230px");

    /* =====================
       내부 스크롤 처리
    ====================== */
    scrollBtn.onclick = () => {
        if (scrolling) {
            scrolling = false;
            clearInterval(scrollTimer);
            scrollBtn.innerText = "스크롤 끝까지 로드 ON";
            return;
        }

        const scrollContainer = findScrollContainer();
        if (!scrollContainer) {
            alert("스크롤 컨테이너를 찾지 못했어");
            return;
        }

        scrolling = true;
        scrollBtn.innerText = "스크롤 끝까지 로드 OFF";

        let lastHeight = 0;

        scrollTimer = setInterval(() => {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;

            const currentHeight = scrollContainer.scrollHeight;
            if (currentHeight === lastHeight) {
                clearInterval(scrollTimer);
                scrolling = false;
                scrollBtn.innerText = "스크롤 끝까지 로드 ON";
            }

            lastHeight = currentHeight;
        }, 1000);
    };

    /* =====================
       정렬 처리
    ====================== */
    sortBtn.onclick = () => {
        const products = collectProducts();
        if (!products.length) {
            alert("정렬할 상품을 찾지 못했어");
            return;
        }

        const container = products[0].root.parentElement;

        if (!sorted) {
            if (!originalOrder) {
                originalOrder = Array.from(container.children);
            }

            products.sort((a, b) => b.count - a.count);
            products.forEach(p => container.appendChild(p.root));

            sortBtn.innerText = "구매중 많은순 정렬 OFF";
            sorted = true;
        } else {
            container.innerHTML = "";
            originalOrder.forEach(el => container.appendChild(el));

            sortBtn.innerText = "구매중 많은순 정렬 ON";
            sorted = false;
        }

        applyTwoColumnLayout(container);
    };

    /* =====================
       유틸 함수들
    ====================== */
    function collectProducts() {
        return Array.from(document.querySelectorAll('a[href^="https://m.a-bly.com/goods/"]'))
            .map(link => {
                const root = findProductRoot(link);
                const count = findPurchaseCount(root);
                return { root, count };
            })
            .filter(p => p.root && typeof p.count === "number");
    }

    function findProductRoot(link) {
        let el = link;
        while (el && el !== document.body) {
            if (el.querySelector && el.querySelector("img")) return el;
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

    function applyTwoColumnLayout(container) {
        container.style.display = "grid";
        container.style.gridTemplateColumns = "repeat(4, minmax(0, 1fr))";
        // container.style.columnGap = "12px";
        // container.style.rowGap = "20px";
    }

    function findScrollContainer() {
        return Array.from(document.querySelectorAll("div"))
            .find(el => {
                const style = getComputedStyle(el);
                return (
                    style.overflowY === "auto" ||
                    style.overflowY === "scroll"
                ) && el.scrollHeight > el.clientHeight;
            });
    }

    function createButton(text, top) {
        const btn = document.createElement("button");
        btn.innerText = text;
        Object.assign(btn.style, {
            position: "fixed",
            top,
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
})();
