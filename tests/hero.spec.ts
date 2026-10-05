import { test, expect } from '@playwright/test';
import { programs } from '../src/lib/content';

test('all program controls, keyboard, Escape and reserved detail space', async ({page}) => {
  await page.goto('/');
  const stage = page.locator('.earth-stage');
  await stage.scrollIntoViewIfNeeded();
  await expect(page.locator('.earth-explorer')).toHaveAttribute('data-renderer','webgl');
  const baseline = await page.locator('.hero').boundingBox();
  for (const program of programs) {
    const trigger=page.getByRole('button',{name:program.name,exact:true});
    await trigger.press('Enter');
    await expect(page.locator('#selected-program h3')).toHaveText(program.name);
    await expect(page.locator('#selected-program a')).toHaveAttribute('href',`/programs/${program.slug}`);
    await expect(page.locator('.program-selector [aria-pressed="true"]')).toHaveText(new RegExp(program.short));
    await expect(page.locator('.earth-explorer')).toHaveAttribute('data-moving','false');
    const open=await page.locator('.hero').boundingBox();
    expect(open!.height).toBeCloseTo(baseline!.height,0);
    await page.locator('#selected-program .close-card').focus();
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
    await expect(page.locator('#selected-program')).toHaveCount(0);
  }
});

test('WebGL projection stays stable while paused, motion resumes, hover/focus pause', async ({page}) => {
  await page.addInitScript(() => {
    const request=window.requestAnimationFrame.bind(window);
    (window as unknown as {frameCount:number}).frameCount=0;
    window.requestAnimationFrame=(cb) => request((t)=>{(window as unknown as {frameCount:number}).frameCount++; cb(t)});
  });
  await page.goto('/');
  await page.locator('.earth-stage').scrollIntoViewIfNeeded();
  await expect(page.locator('.earth-explorer')).toHaveAttribute('data-renderer','webgl');
  const control=page.getByRole('button',{name:'Остановить анимацию'});
  await control.click();
  await page.waitForTimeout(250);
  const before=await page.locator('.orb-position').evaluateAll(els=>els.map(e=>e.getAttribute('style')));
  const frames=await page.evaluate(()=>(window as unknown as {frameCount:number}).frameCount);
  await page.waitForTimeout(350);
  expect(await page.locator('.orb-position').evaluateAll(els=>els.map(e=>e.getAttribute('style')))).toEqual(before);
  expect(await page.evaluate(()=>(window as unknown as {frameCount:number}).frameCount)).toBeLessThanOrEqual(frames+1);
  await page.getByRole('button',{name:'Включить анимацию'}).click();
  await expect(page.locator('.earth-explorer')).toHaveAttribute('data-moving','true');
  const star=page.getByRole('button',{name:programs[0].name,exact:true});
  await star.focus();
  await expect(page.locator('.earth-explorer')).toHaveAttribute('data-moving','false');
  await page.getByRole('button',{name:'Остановить анимацию'}).focus();
  const target = await star.boundingBox();
  await page.mouse.move(target!.x + target!.width / 2, target!.y + target!.height / 2);
  await expect(page.locator('.earth-explorer')).toHaveAttribute('data-moving','false');
  await page.mouse.move(0,0);
  await expect(page.locator('.earth-explorer')).toHaveAttribute('data-moving','true');
  await page.locator('footer').scrollIntoViewIfNeeded();
  await expect(page.locator('.earth-explorer')).toHaveAttribute('data-moving','false');
});

test('reduced motion renders WebGL once and tab visibility pauses movement',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/'); await page.locator('.earth-stage').scrollIntoViewIfNeeded();
  await expect(page.locator('.earth-explorer')).toHaveAttribute('data-renderer','webgl');
  await expect(page.getByRole('button',{name:'Без анимации'})).toBeDisabled();
  await expect(page.getByRole('button',{name:'Без анимации'})).not.toHaveAttribute('aria-pressed');
  await expect(page.getByRole('button',{name:'Без анимации'}).locator('.lucide-pause')).toHaveCount(1);
  await expect(page.locator('.earth-explorer')).toHaveAttribute('data-moving','false');
  await page.emulateMedia({reducedMotion:'no-preference'});
  await expect(page.locator('.earth-explorer')).toHaveAttribute('data-moving','true');
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'))});
  await expect(page.locator('.earth-explorer')).toHaveAttribute('data-moving','false');
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:false});document.dispatchEvent(new Event('visibilitychange'))});
  await expect(page.locator('.earth-explorer')).toHaveAttribute('data-moving','true');
});

test('lost context and texture failure keep the static globe and working controls',async({page})=>{
  await page.goto('/'); await page.locator('.earth-stage').scrollIntoViewIfNeeded();
  await expect(page.locator('.earth-explorer')).toHaveAttribute('data-renderer','webgl');
  await page.locator('canvas').evaluate(c=>(c as HTMLCanvasElement).getContext('webgl2')!.getExtension('WEBGL_lose_context')!.loseContext());
  await expect(page.locator('.earth-explorer')).toHaveAttribute('data-failed','true');
  await expect(page.locator('.earth-explorer')).toHaveAttribute('data-renderer','static');
  await page.getByRole('button',{name:programs[1].name,exact:true}).click();
  await expect(page.locator('#selected-program h3')).toHaveText(programs[1].name);
  await page.route('**/assets/earth/surface-*.webp',route=>route.abort());
  await page.reload(); await page.locator('.earth-stage').scrollIntoViewIfNeeded();
  await expect(page.locator('.earth-explorer')).toHaveAttribute('data-failed','true');
  await page.getByRole('button',{name:programs[2].name,exact:true}).click();
  await expect(page.locator('#selected-program h3')).toHaveText(programs[2].name);
  expect(await page.locator('.earth-fallback').evaluate(e=>(e as HTMLImageElement).complete && (e as HTMLImageElement).naturalWidth > 0)).toBe(true);
});

test('layout, label collisions, HTML accessibility and normal console health',async({page},testInfo)=>{
  const errors:string[]=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  await page.goto('/');await page.locator('.earth-stage').scrollIntoViewIfNeeded();
  await expect(page.locator('.earth-explorer')).toHaveAttribute('data-renderer','webgl');
  await page.getByRole('button',{name:'Остановить анимацию'}).click();
  const result=await page.evaluate(()=>{
    const rects=[...document.querySelectorAll('.orb-label')].filter(el=>getComputedStyle(el).display!=='none').map(el=>el.getBoundingClientRect());
    return {
      canvasAspect:(() => { const canvas=document.querySelector('canvas')!; const r=canvas.getBoundingClientRect(); return {css:r.width/r.height,buffer:canvas.width/canvas.height}; })(),
      overflow:document.documentElement.scrollWidth>innerWidth,
      overlaps:rects.some((a,i)=>rects.slice(i+1).some(b=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top)),
      clipped:rects.some(r=>r.left<0||r.right>innerWidth),
      hiddenButtons:document.querySelector('.orb-button')?.closest('[aria-hidden="true"]')!==null,
      targets:[...document.querySelectorAll('.orb-button')].map(e=>({w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height})),
    };
  });
  expect(result.canvasAspect.css).toBeCloseTo(1,3);
  expect(result.canvasAspect.buffer).toBeCloseTo(result.canvasAspect.css,3);
  expect(result.overflow).toBe(false);expect(result.overlaps).toBe(false);expect(result.clipped).toBe(false);expect(result.hiddenButtons).toBe(false);
  result.targets.forEach(r=>{expect(r.w).toBeGreaterThanOrEqual(44);expect(r.h).toBeGreaterThanOrEqual(44)});
  expect(errors).toEqual([]);
  if(process.env.HERO_SCREENSHOT_DIR){
    const folder=process.env.HERO_SCREENSHOT_DIR;
    await page.evaluate(()=>scrollTo(0,0));
    await page.screenshot({path:`${folder}/${testInfo.project.name}-viewport.png`});
    await page.locator('.hero').screenshot({path:`${folder}/${testInfo.project.name}-hero.png`});
    await page.getByRole('button',{name:programs[2].name,exact:true}).click();
    await page.locator('.hero').screenshot({path:`${folder}/${testInfo.project.name}-selected.png`});
  }
});

test.describe('short desktop composition', () => {
  test.skip(({isMobile}) => isMobile, 'Desktop composition');
  test('keeps every star clickable while a card is open', async ({page}) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  for (const width of [1101, 1366, 1440, 1920, 2560]) {
    await page.setViewportSize({width, height:768});
    await page.goto('/?static');
    const baseline = await page.locator('.hero').boundingBox();
    for (const program of programs) {
      const trigger = page.getByRole('button', {name:program.name, exact:true});
      const target = await trigger.boundingBox();
      expect(target!.y).toBeGreaterThanOrEqual(baseline!.y);
      expect(target!.y + target!.height).toBeLessThanOrEqual(baseline!.y + baseline!.height);
      await trigger.click();
      await expect(page.locator('#selected-program h3')).toHaveText(program.name);
    }
    expect((await page.locator('.hero').boundingBox())!.height).toBe(baseline!.height);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', {name:programs.at(-1)!.name, exact:true})).toBeFocused();
  }
});

});
