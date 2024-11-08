import { LightningElement, wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import movie_channel from '@salesforce/messageChannel/movieFilter__c';

const DELAY = 1000;

export default class MovieFilterComp extends LightningElement {

    Selectedvalue="";
    delaytimeout;
    type=""; 
    page = "1";
    loading = true;
    searchResult = [];
    selectedMovie = "";

    @wire(MessageContext)
    messageContext;

    get Selectoptions() {
        return [
            { label: 'Movies', value: 'movie' },
            { label: 'Web Series', value: 'series' },
            { label: 'Episodes', value: 'episode' },
        ];
    }

    handleChange(event) {
       let {name,value} = event.target;
 if (name === "Select Category"){
console.log('first');
this.Selectedvalue = value;
 }
else  if (name === "Enter the name"){
            console.log('second');
            this.type = value;
}
else  if (name === "Enter Page Number"){
            console.log('third');
            this.page = value;
 }

        //debouncing
        clearTimeout(this.delaytimeout);
        this.delaytimeout = setTimeout(() => {
            console.log('debounced');
            this.searchMovie();
            //console.log(this.Selectedvalue);
            //console.log(this.searchText);
        
        }, DELAY);
 }

   async searchMovie(){
        console.log('search');
       const url = `https://www.omdbapi.com/?s=${this.type}&type=${this.Selectedvalue}&page=${this.page}&apikey=40b20126`;
       console.log(url);
       const res = await fetch (url);
       const data = await res.json();
       console.log('console data = ',data);
       this.loading = false;
       if (data.Response === "True"){
        this.searchResult = data.Search;
        console.log('this.searchResult ', this.searchResult);

       }
       
    }
    
    get displaySearchResult(){
        console.log('displaySearchResult ');

        return this.searchResult.length >0 ? true : false;
    }

    selectedTile(event) {
this.selectedMovie = event.detail;
const payload = { movieId: this.selectedMovie };

        publish(this.messageContext, movie_channel, payload);

    }


}