import { LightningElement, api } from 'lwc';

export default class MovieTile extends LightningElement {
    @api movie;
    @api selectedMovieId;

    clickHandler(event){
console.log('value = ', this.movie.imdbID);

//customevent
const evt = new CustomEvent("tileclicked",{
    detail: this.movie.imdbID
});
this.dispatchEvent(evt);

    }

    get tileSelected(){
        return this.selectedMovieId === this.movie.imdbID ? "tile-selected" : "tile";
    }
}