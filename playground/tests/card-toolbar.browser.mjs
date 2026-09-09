// Run against the playground dev server. Requires Playwright with Chromium.
// PLAYWRIGHT_MODULE and BROWSER_PATH optionally select an existing installation.
import assert from 'node:assert/strict';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright');
const browser = await chromium.launch({
  headless: true,
  ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}),
});
const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1, `${actual} != ${expected}`);

try {
  for (const width of [1440, 900, 375]) {
    const page = await browser.newPage({ viewport: { width, height: 1100 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(process.argv[2] ?? 'http://127.0.0.1:5174');
    const grid = page.getByTestId('toolbar-divider-grid');
    await grid.waitFor();

    const layout = await grid.evaluate(el => {
      const toolbar = el.parentElement;
      const css = getComputedStyle(toolbar);
      return {
        columns: getComputedStyle(el).gridTemplateColumns.split(' ').length,
        width: el.getBoundingClientRect().width,
        available: toolbar.clientWidth - parseFloat(css.paddingLeft) - parseFloat(css.paddingRight),
      };
    });
    assert.equal(layout.columns, width > 1024 ? 4 : width > 720 ? 2 : 1);
    near(layout.width, layout.available);

    for (const divider of ['none', 'left', 'right', 'both']) {
      const actual = await page.getByTestId(`toolbar-group-${divider}`).evaluate(el => {
        const css = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        const button = el.querySelector('button').getBoundingClientRect();
        return {
          left: css.borderLeftWidth, right: css.borderRightWidth,
          paddingLeft: css.paddingLeft, paddingRight: css.paddingRight,
          buttonInset: button.left - rect.left,
          overflow: el.scrollWidth > el.clientWidth,
        };
      });
      const left = divider === 'left' || divider === 'both';
      const right = divider === 'right' || divider === 'both';
      assert.deepEqual(actual, {
        left: left ? '1px' : '0px', right: right ? '1px' : '0px',
        paddingLeft: left ? '8px' : '0px', paddingRight: right ? '8px' : '0px',
        buttonInset: left ? 9 : 0, overflow: false,
      });
    }

    // Compare actual button-to-divider distances, not just padding values.
    const balancedRow = page.getByTestId('toolbar-balanced-dividers');
    for (const gap of [8, 12]) {
      await balancedRow.evaluate((el, value) => {
        el.style.setProperty('--card-toolbar-group-divider-gap', `${value}px`);
      }, gap);
      const distances = await balancedRow.evaluate(el => {
        const groups = Array.from(el.children);
        return groups.slice(1).flatMap((group, index) => {
          const previous = groups[index];
          const previousButtons = previous.querySelectorAll('button, a.btn');
          const last = previousButtons[previousButtons.length - 1];
          const first = group.querySelector('button, a.btn');
          const rect = group.getBoundingClientRect();
          const prev = previous.getBoundingClientRect();
          // A wrapped group keeps its explicit line; only compare neighbours on one row.
          if (Math.abs(rect.top - prev.top) > 1) return [];
          return [{
            outside: rect.left - last.getBoundingClientRect().right,
            inside: first.getBoundingClientRect().left - rect.left - parseFloat(getComputedStyle(group).borderLeftWidth),
          }];
        });
      });
      if (width >= 900) assert.ok(distances.length > 0);
      for (const { outside, inside } of distances) {
        near(outside, gap);
        near(inside, gap);
      }
    }
    await balancedRow.evaluate(el => el.style.removeProperty('--card-toolbar-group-divider-gap'));

    for (const inset of [true, false]) {
      const card = page.getByTestId(inset ? 'toolbar-inset-example' : 'toolbar-full-width-example');
      const positions = await card.evaluate(el => {
        const toolbar = el.querySelector('[aria-label]');
        const css = getComputedStyle(toolbar);
        return {
          title: el.querySelector('h1').getBoundingClientRect().left,
          frame: toolbar.getBoundingClientRect().left,
          button: toolbar.querySelector('button').getBoundingClientRect().left,
          side: css.borderLeftWidth, radius: css.borderTopLeftRadius,
        };
      });
      near(inset ? positions.frame : positions.button, positions.title);
      assert.equal(positions.side, inset ? '1px' : '0px');
      assert.equal(parseFloat(positions.radius) > 0, inset);
    }

    const tableToolbar = page.locator('[aria-label="Действия таблицы"]');
    const tableLayout = await tableToolbar.evaluate(el => {
      const row = el.firstElementChild;
      const group = row.lastElementChild;
      const css = getComputedStyle(group);
      return {
        justify: getComputedStyle(row).justifyContent,
        side: css.borderLeftWidth,
        pseudo: getComputedStyle(group, '::before').content,
        oldWrappers: el.querySelectorAll('[data-card-toolbar-item]').length,
      };
    });
    assert.deepEqual(tableLayout, { justify: 'space-between', side: '0px', pseudo: 'none', oldWrappers: 0 });

    const columns = await page.locator('[aria-label="Три колонки через Grid"] > div').evaluate(el =>
      getComputedStyle(el).gridTemplateColumns.split(' ').length);
    assert.equal(columns, width > 720 ? 3 : 1);
    assert.deepEqual(errors, []);
    console.log(`PASS ${width}px: Grid, explicit group dividers, inset alignment, table space-between, responsive columns`);
    await page.close();
  }
} finally {
  await browser.close();
}
