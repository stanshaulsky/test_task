import { Locator, Page } from "@playwright/test";
import {LOCATORS} from "./searchPageLocators"; 

export class SearchPage{
    page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }

    
    
    /*
    Тут я захотел сделать круто и правильно, но сам себе вставил палки в колеса так как
    там ссылки с target=_blank, а это оставляет контекст драйвера на предыдущей вкладке. 
    Можно было бы просто переключить вкладку как-то так
    const context = this.page.context();
        const [newPage] = await Promise.all([
            context.waitForEvent('page'),
            this.page.goto("/search"),
            this.page.locator(`${LOCATORS.navigationTabItem} >> nth= ${searchTabNum}`).click(),  
        ])
        await newPage.waitForLoadState();
        this.page = newPage;
    Но вроде как легче просто убрать аттрибут через eval, что тоже конечно не очень
    */

    //Использует enum из констант чтобы можно было переходить по разным табам поиска
    async navigateTo(searchTabNum:number){
        await this.page.goto("/search"); //путь от baseUrl
        let targetTab = this.page.locator(`${LOCATORS.navigationTabItem} >> nth= ${searchTabNum}`);
        await targetTab.evaluate(node => node.removeAttribute("target"));
        await targetTab.click();
    }

    async searchFor(subject:string){
        await this.page.locator(LOCATORS.searchInput).fill(subject);
        await this.page.locator(LOCATORS.searchBtn).click();
    }
}