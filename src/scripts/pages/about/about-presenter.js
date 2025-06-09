import AboutView from "./about-view";

export default class AboutPresenter {
    async render(){
        return AboutView.render();
    }
    async afterRender(){
        
    }
}