const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Headless Chrome has no visible mouse pointer, so draw one that follows the
// bot's real mouse events. Runs on every page the bot opens.
export async function injectCursor(page) {
  await page.evaluateOnNewDocument(() => {
    const add = () => {
      const cursor = document.createElement("div");
      cursor.id = "__bot-cursor";
      cursor.innerHTML =
        '<svg width="32" height="32" viewBox="0 0 24 24"><path d="M3 2l7 19 2.5-7.5L20 11z" fill="#ef4444" stroke="white" stroke-width="1.5"/></svg>';
      Object.assign(cursor.style, {
        position: "fixed",
        left: "-50px",
        top: "-50px",
        zIndex: "2147483647",
        pointerEvents: "none",
        transition: "transform 0.1s",
      });
      document.body.appendChild(cursor);
      document.addEventListener("mousemove", (e) => {
        cursor.style.left = `${e.clientX - 3}px`;
        cursor.style.top = `${e.clientY - 2}px`;
      });
      document.addEventListener("mousedown", () => {
        cursor.style.transform = "scale(0.75)";
      });
      document.addEventListener("mouseup", () => {
        cursor.style.transform = "scale(1)";
      });
    };
    if (document.body) add();
    else document.addEventListener("DOMContentLoaded", add);
  });
}

// Glide the mouse to the center of an element (25 small steps looks human).
export async function moveTo(page, elementOrSelector) {
  const el =
    typeof elementOrSelector === "string"
      ? await page.waitForSelector(elementOrSelector)
      : elementOrSelector;
  const box = await el.boundingBox();
  if (box) {
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, {
      steps: 25,
    });
  }
  return el;
}

export async function moveAndClick(page, selector) {
  await moveTo(page, selector);
  await pause(150);
  await page.mouse.down();
  await page.mouse.up();
}

export async function typeInInput(page, selector, text) {
  await moveAndClick(page, selector);
  await page.keyboard.type(text, { delay: 70 });
}

export { pause };
