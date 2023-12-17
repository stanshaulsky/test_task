import {test, expect } from "@playwright/test";
import { SEARCH_TABS } from "../constants/searchPageConstants";
import {SearchPage} from "../pages/search/SearchPage";
import { LOCATORS } from "../pages/search/searchPageLocators"; 


test.describe("Yandex search page", () => {
  
  let searchPage: SearchPage;

  //Фикстура браузера здесь чтобы можно было без проблем запускать на разных браузерах
  test.beforeAll(async ({browser}) =>{
    searchPage = new SearchPage(await browser.newPage());
    await searchPage.navigateTo(SEARCH_TABS.Video);
    /*
    При использовании плейрайта у Яндекса на странице поиска видео почему то кликается автоматически 
    кнопка про перевод нейросетями и всплывает сообщение, при разных способах навигации, она мешает,
    добавил такой костыль, не понимаю откуда она там берется.
    */
    await expect.poll(async () => {
      await searchPage.page.locator(LOCATORS.closeMessageBox).click();
      return searchPage.page.locator(LOCATORS.messageBox).isVisible();
    }, {
      message: 'make sure there is no strange messageBox', 
      timeout: 10000,
    }).toBe(true);
  }) 

  test('Markup visual ', async () => {
    expect(await searchPage.page.screenshot())
           .toMatchSnapshot(["yandex","search","main.png"], 
           { maxDiffPixelRatio: 0.05 });     
  });

  test("Search input click", async ()=>{
    await searchPage.page.locator(LOCATORS.searchInput).click();
    await expect(searchPage.page.locator(LOCATORS.searchBtn))
          .toBeVisible();
    await expect(searchPage.page.locator(LOCATORS.searchBtn))
      .toHaveText(/Найти/);      
  });

  test("Perform subject search", async () => {
    await searchPage.searchFor("Ураган");
    await searchPage.page.locator(`${LOCATORS.resultVideoItem} >> nth=0`).waitFor({state:"visible"});
    expect(await searchPage.page.locator(LOCATORS.resultVideoItem).count()).toBeGreaterThan(0);
  });

  /*
  Здесь на хромиуме у меня не работает hover на видео, не меняет состояние элемента почему-то,
  хотя на обычном десктоп хроме все ок, для вебкита и фаерфокс тоже ок в тестах, тыкал по разному, 
  не смог найти причину. 
  */
  test("First video has preview video", async() =>{
    let firstVideo = searchPage.page.locator(`${LOCATORS.resultVideoItem} >> nth=0 >> video >> xpath=..`);
    await firstVideo.hover();
    await expect(firstVideo).toHaveClass(/VideoThumb3_playing/);
  });


});


