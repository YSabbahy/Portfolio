from playwright.sync_api import sync_playwright
URL="http://localhost:4173/Portfolio/"
res=[]
def check(n,ok,d=""):
    res.append(ok); print("PASS" if ok else "FAIL","-",n,("| "+str(d)) if d else "")
with sync_playwright() as p:
    b=p.chromium.launch()

    # A. localStorage blocked entirely -> site must still render and work
    ctx=b.new_context(viewport={"width":1280,"height":800}); pg=ctx.new_page(); errs=[]
    pg.on("pageerror",lambda e:errs.append(str(e)))
    pg.add_init_script("Object.defineProperty(window,'localStorage',{get(){throw new DOMException('blocked','SecurityError')}})")
    pg.goto(URL); pg.wait_for_timeout(900)
    check("storage blocked: app renders (no error screen)", pg.query_selector("[role=alert]") is None and pg.query_selector("#projects") is not None, errs)
    pg.click("#themeToggleBtn"); pg.click(".mode-btn[data-mode-value='light']"); pg.wait_for_timeout(200)
    check("storage blocked: mode switch still works in-session", pg.evaluate("document.documentElement.getAttribute('data-mode')")=="light")
    ctx.close()

    # B. saved light mode applied by inline script BEFORE any app JS runs
    ctx=b.new_context(); pg=ctx.new_page()
    pg.add_init_script("localStorage.setItem('portfolioMode','light');localStorage.setItem('portfolioTheme','green')")
    pg.route("**/assets/*.js", lambda r: r.abort())
    pg.goto(URL); 
    check("no theme flash: data-mode/data-theme set with app JS blocked", pg.evaluate("[document.documentElement.getAttribute('data-mode'),document.documentElement.getAttribute('data-theme')]")==["light","green"])
    ctx.close()

    # C. Mobile: filters + menu
    ctx=b.new_context(viewport={"width":390,"height":800},has_touch=True,is_mobile=True); pg=ctx.new_page(); errs=[]
    pg.on("pageerror",lambda e:errs.append(str(e)))
    pg.goto(URL); pg.wait_for_timeout(800)
    pg.evaluate("document.getElementById('projects').scrollIntoView({behavior:'instant'})"); pg.wait_for_timeout(800)
    for lab in ["E-commerce","All"]:
        pg.tap(f".filter-chip:has-text('{lab}')"); pg.wait_for_timeout(1500 if lab!="All" else 5000)
    ops=pg.evaluate("[...document.querySelectorAll('.project-card')].map(c=>parseFloat(getComputedStyle(c).opacity))")
    check("mobile: E-commerce -> All shows 4 visible cards", len(ops)==4 and all(o>0.9 for o in ops), ops)
    inert=pg.evaluate("document.getElementById('mobileMenu').hasAttribute('inert')")
    pg.tap("#mobileMenuBtn"); pg.wait_for_timeout(400)
    check("mobile menu: inert when closed, interactive when open", inert and not pg.evaluate("document.getElementById('mobileMenu').hasAttribute('inert')"))
    pg.tap(".mobile-link >> nth=2"); pg.wait_for_timeout(1500)
    check("mobile menu: link scrolls to section and menu closes", pg.evaluate("scrollY")>500 and pg.evaluate("document.getElementById('mobileMenu').hasAttribute('inert')"))
    check("mobile: no JS errors", not errs, errs)
    ctx.close()

    # D. Direct deep link + settle position of repeated nav click + screenshots
    ctx=b.new_context(viewport={"width":1280,"height":900}); pg=ctx.new_page(); errs=[]
    pg.on("pageerror",lambda e:errs.append(str(e)))
    pg.goto(URL+"project/racecore"); pg.wait_for_timeout(900)
    check("deep link /project/racecore renders", "RaceCore" in pg.inner_text("h1"))
    pg.click(".floating-nav .logo a"); pg.wait_for_timeout(800)
    tops=[]
    for _ in range(2):
        pg.evaluate("scrollTo({top:0,behavior:'instant'})"); pg.wait_for_timeout(300)
        pg.click(".nav-link:has-text('Projects')"); pg.wait_for_timeout(3500)
        tops.append(round(pg.evaluate("document.getElementById('projects').getBoundingClientRect().top")))
    check("repeat nav click lands on the same spot each time", tops[0]==tops[1] and abs(tops[0]-110)<6, tops)
    pg.evaluate("document.getElementById('projects').scrollIntoView({behavior:'instant'})"); pg.wait_for_timeout(5200)
    pg.screenshot(path="/tmp/shot_all.png")
    pg.click(".filter-chip:has-text('E-commerce')"); pg.wait_for_timeout(1500)
    pg.screenshot(path="/tmp/shot_ecom.png")
    pg.click(".filter-chip:has-text('All')"); pg.wait_for_timeout(1500)
    pg.screenshot(path="/tmp/shot_back_all.png")
    pg.keyboard.press("Control+k"); pg.wait_for_timeout(500); pg.mouse.move(640,300); pg.wait_for_timeout(400)
    pg.screenshot(path="/tmp/shot_palette.png")
    check("desktop: no JS errors", not errs, errs)
    b.close()
print(f"{sum(res)}/{len(res)} passed")
