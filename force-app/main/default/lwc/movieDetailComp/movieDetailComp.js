import { LightningElement, wire } from 'lwc';
import {subscribe,unsubscribe,APPLICATION_SCOPE,MessageContext,} from 'lightning/messageService';
import movie_channel from '@salesforce/messageChannel/movieFilter__c';


export default class MovieDetailComp extends LightningElement {

    selectedMovieId="";
    selectedMovie="";
    subscription=null;
    loadComponent = false;
    movieDetails = {};

    @wire(MessageContext)
    messageContext;

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    disconnectedCallback() {
        this.unsubscribeToMessageChannel();}

    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                movie_channel,
                (message) => this.handleMessage(message),
                { scope: APPLICATION_SCOPE }
            );
        }
    }

    handleMessage(message) {
        let movieID = message.movieId;       
        console.log('movieId ', movieID);
        this.selectedMovieId = message.selectedMovieId;
        this.selectedMovie = message.selectedMovie;
        this.fetchMovieDetail(movieID);
    }

        unsubscribeToMessageChannel() {
            unsubscribe(this.subscription);
            this.subscription = null;
        }

       async fetchMovieDetail(movieId){
        let url = `https://www.omdbapi.com/?i=${movieId}&plot=full&apikey=40b20126`;
          const res =  await  fetch(url);
          const data =  await res.json();
          console.log('Movie detail= ',data);
          this.loadComponent = true;
          this.movieDetails = data;
        
       }

       
        
}