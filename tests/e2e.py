import sys, json
from playwright.sync_api import sync_playwright

URL = "http://localhost:4173/Portfolio/"
results = []


def check(name, ok, detail=""):
    results.append((name, ok, detail))
    print(("PASS" if ok else "FAIL"), "-", name, ("| " + str(detail)) if detail else "")


def visible_cards(page):
    # A card is really visible only if it has the is-in class AND computed opacity > 0.5
    return page.evaluate(
        """() => [...document.querySelectorAll('.project-card')].map(c => ({
            name: c.querySelector('h3')?.textContent,
            isIn: c.classList.contains('is-in'),
            opacity: parseFloat(getComputedStyle(c).opacity)
        }))"""
    )


def goto_projects(page):
    page.evaluate("document.getElementById('projects').scrollIntoView({behavior:'instant'})")
    page.wait_for_timeout(700)


with sync_playwright() as p:
    browser = p.chromium.launch()
    ctx = browser.new_context(viewport={"width": 1280, "height": 800})
    page = ctx.new_page()
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.on("console", lambda m: errors.append(m.text) if m.type == "error" and "api.github.com" not in m.text and "ERR_" not in m.text and "Failed to load resource" not in m.text else None)

    page.goto(URL)
    page.wait_for_selector(".project-card", state="attached")
    page.wait_for_timeout(600)

    # ---------- 1. Project filter ----------
    goto_projects(page)
    page.wait_for_timeout(5000)  # let deck animation finish
    cards = visible_cards(page)
    check("filter: initial All shows 4 visible cards", len(cards) == 4 and all(c["isIn"] and c["opacity"] > 0.9 for c in cards), cards)

    page.click(".filter-chip:has-text('E-commerce')")
    page.wait_for_timeout(1500)
    cards = visible_cards(page)
    names = sorted(c["name"] for c in cards)
    check("filter: E-commerce shows RaceCore + Essence, both visible",
          names == ["Essence", "RaceCore"] and all(c["opacity"] > 0.9 for c in cards), cards)

    page.click(".filter-chip:has-text('All')")
    page.wait_for_timeout(5500)
    cards = visible_cards(page)
    check("filter: back to All shows all 4 cards VISIBLE (user's bug)",
          len(cards) == 4 and all(c["opacity"] > 0.9 for c in cards), cards)

    for label, expected in [("React", ["RaceCore"]), ("Landing Page", ["OrbitaX"]),
                            ("Interactive", ["Kemet Protocol"]), ("E-commerce", ["Essence", "RaceCore"]),
                            ("All", ["Essence", "Kemet Protocol", "OrbitaX", "RaceCore"]),
                            ("Interactive", ["Kemet Protocol"]), ("All", ["Essence", "Kemet Protocol", "OrbitaX", "RaceCore"])]:
        page.click(f".filter-chip:has-text('{label}')")
        page.wait_for_timeout(1200 if label != "All" else 5200)
        cards = visible_cards(page)
        got = sorted(c["name"] for c in cards)
        check(f"filter sequence -> {label}", got == expected and all(c["opacity"] > 0.9 for c in cards), cards if got != expected or any(c['opacity'] <= 0.9 for c in cards) else "")

    # rapid clicking
    for label in ["React", "All", "E-commerce", "All", "Landing Page", "All"]:
        page.click(f".filter-chip:has-text('{label}')")
        page.wait_for_timeout(120)
    page.wait_for_timeout(5500)
    cards = visible_cards(page)
    check("filter: rapid clicking ends on All with 4 visible", len(cards) == 4 and all(c["opacity"] > 0.9 for c in cards), cards)

    # ---------- 2. Cursor stacking vs palette ----------
    page.keyboard.press("Control+k")
    page.wait_for_selector(".cmdk-overlay")
    z = page.evaluate(
        """() => ({
            dot: parseInt(getComputedStyle(document.querySelector('.cursor-dot')).zIndex),
            ring: parseInt(getComputedStyle(document.querySelector('.cursor-ring')).zIndex),
            overlay: parseInt(getComputedStyle(document.querySelector('.cmdk-overlay')).zIndex)
        })"""
    )
    check("cursor: dot/ring z-index above command palette overlay", z["dot"] > z["overlay"] and z["ring"] > z["overlay"], z)

    # ---------- 3. Mode desync (Cmd+K vs appearance panel) ----------
    page.keyboard.press("Escape")
    page.wait_for_timeout(200)
    page.click("#themeToggleBtn")
    page.click(".mode-btn[data-mode-value='light']")
    page.wait_for_timeout(200)
    page.keyboard.press("Escape")
    page.keyboard.press("Control+k")
    page.wait_for_selector(".cmdk-overlay")
    labels = page.eval_on_selector_all(".cmdk-item span:first-child", "els => els.map(e => e.textContent)")
    theme_label = [l for l in labels if l.startswith("Switch to")]
    check("mode: palette label reflects mode chosen in appearance panel (should say Dark)",
          theme_label == ["Switch to Dark Mode"], theme_label)
    page.click(".cmdk-item:has-text('Switch to')")
    page.wait_for_timeout(300)
    attr = page.evaluate("document.documentElement.getAttribute('data-mode')")
    check("mode: palette command actually switches page to dark", attr is None, attr)
    page.click("#themeToggleBtn")
    dark_checked = page.get_attribute(".mode-btn[data-mode-value='dark']", "aria-checked")
    check("mode: appearance panel shows Dark selected after palette toggle", dark_checked == "true", dark_checked)
    page.keyboard.press("Escape")

    # ---------- 4. Active nav highlighting ----------
    goto_projects(page)
    page.wait_for_timeout(600)
    active = page.eval_on_selector_all(".nav-link.is-active", "els => els.map(e => e.textContent)")
    check("nav: Projects link is highlighted while in Projects section", active == ["Projects"], active)

    # ---------- 5. Repeated click on same nav hash ----------
    page.evaluate("window.scrollTo(0,0)")
    page.wait_for_timeout(400)
    page.click(".nav-link:has-text('Skills')")
    page.wait_for_timeout(1500)
    y1 = page.evaluate("window.scrollY")
    page.evaluate("window.scrollTo({top:0,behavior:'instant'})")
    page.wait_for_timeout(400)
    page.click(".nav-link:has-text('Skills')")
    page.wait_for_timeout(1500)
    y2 = page.evaluate("window.scrollY")
    check("nav: clicking the same nav link twice scrolls both times", y1 > 500 and y2 > 500, {"first": y1, "second": y2})

    # ---------- 6. Route change scroll reset + case study ----------
    goto_projects(page)
    page.click(".project-cs-link >> nth=0")
    page.wait_for_timeout(1200)
    sy = page.evaluate("window.scrollY")
    check("router: opening a case study starts at top of page", sy < 50, sy)
    page.evaluate("window.scrollTo({top: document.body.scrollHeight, behavior:'instant'})")
    page.wait_for_timeout(800)
    page.click(".cs-next-link")
    page.wait_for_timeout(1200)
    sy = page.evaluate("window.scrollY")
    check("router: 'Next project' starts at top of new case study", sy < 50, sy)

    # ---------- 7. Nav highlight after returning Home from another route ----------
    page.click(".floating-nav .logo a")
    page.wait_for_timeout(900)
    goto_projects(page)
    page.wait_for_timeout(700)
    active = page.eval_on_selector_all(".nav-link.is-active", "els => els.map(e => e.textContent)")
    check("nav: highlight still works after visiting a case study and coming back", active == ["Projects"], active)

    # ---------- 8. Easter egg should not fire while typing in the palette ----------
    page.keyboard.press("Control+k")
    page.wait_for_selector(".cmdk-overlay")
    page.keyboard.type("kemet")
    page.wait_for_timeout(300)
    egg = page.query_selector(".egg-overlay")
    check("egg: typing 'kemet' inside palette search does NOT trigger the overlay", egg is None)
    page.keyboard.press("Escape")

    # ---------- 9. Palette keyboard nav scrolls active item into view ----------
    page.keyboard.press("Control+k")
    page.wait_for_selector(".cmdk-overlay")
    for _ in range(14):
        page.keyboard.press("ArrowDown")
    inview = page.evaluate(
        """() => { const a = document.querySelector('.cmdk-item.is-active'); const l = document.querySelector('.cmdk-list');
          const ar = a.getBoundingClientRect(), lr = l.getBoundingClientRect();
          return ar.top >= lr.top - 1 && ar.bottom <= lr.bottom + 1; }"""
    )
    check("palette: active item stays visible when navigating with arrow keys", inview)
    page.keyboard.press("Escape")

    # ---------- 10. Hidden panels shouldn't be tabbable ----------
    focusable = page.evaluate(
        """() => { const p = document.querySelector('#themePanel'); const btns = [...p.querySelectorAll('button')];
        return btns.filter(b => b.tabIndex >= 0 && !b.closest('[inert]')).length; }"""
    )
    check("a11y: closed appearance panel buttons are not keyboard-focusable", focusable == 0, focusable)

    # ---------- 11. Persistence + theme accent ----------
    page.click("#themeToggleBtn")
    page.click(".theme-swatch[data-theme-value='blue']")
    page.wait_for_timeout(200)
    page.reload()
    page.wait_for_timeout(800)
    th = page.evaluate("document.documentElement.getAttribute('data-theme')")
    check("theme: accent color persists across reload", th == "blue", th)

    check("no uncaught JS errors", len(errors) == 0, errors)
    browser.close()

failed = [r for r in results if not r[1]]
print(f"\n{len(results) - len(failed)}/{len(results)} passed")
sys.exit(1 if failed else 0)
