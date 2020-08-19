import { dark, light } from './darkmode.js';
import * as GIFOS from './gifs.js';
import * as STORAGE from './storage.js';
import * as BUTTONS from './buttons.js';
import * as GIPHY from './giphy.js';
import * as INSERTS from './inserts.js';
import * as SEARCHS from './autocomplete.js';
import * as FAVS from './favorites.js';
import * as CAR from './carrousel.js';
import * as RECORD from './record.js';


const MENU = BUTTONS.DOC.querySelector('ul.menu');
let is_dark = false;

let search_arr = [];
let fav_arr = [];
let mis_arr = [];
let carrousel = [];
const WIN = window;
let record_step;

WIN.onload = () => {
    record_step = 0;
    GIPHY.getTrendingImages().then( gifs => {
        carrousel = GIFOS.createArray( gifs );
        CAR.initCarrousel( carrousel );
    });
}

// limpiea de clases extras y estilos a elementos de menu
WIN.onresize = () => {
    if(screen.width > 550){
        BUTTONS.OPEN.removeAttribute('style');
        BUTTONS.CLOSE.removeAttribute('style');
        MENU.classList.remove('fadeOutUp');
        MENU.classList.remove('fadeInDown');
        setTimeout(() => MENU.removeAttribute('style'),1001);
    }
}

// Home Button
BUTTONS.HOME.addEventListener('click',() =>{
    BUTTONS.DOC.getElementById('search-section').classList.remove('hide');
    BUTTONS.DOC.getElementById('result-section').classList.add('hide');
    BUTTONS.DOC.getElementById('fav-section').classList.add('hide');
    BUTTONS.DOC.getElementById('mis-section').classList.add('hide');
    BUTTONS.DOC.getElementById('carrousel-section').classList.remove('hide');
    BUTTONS.DOC.getElementById('record-section').classList.add('hide');
    if( record_step !== 0 ) {
        RECORD.reset();
    }
})

// botones de menu hamburguesa
BUTTONS.OPEN.addEventListener('click', (event) => {
    event.target.style.display = 'none';
    MENU.classList.remove('fadeOutUp');
    MENU.classList.add('fadeInDown');
    MENU.style.display = 'block';
    BUTTONS.CLOSE.style.display = 'block';
    BUTTONS.DOC.body.style.overflow = 'hidden';
});

BUTTONS.CLOSE.addEventListener('click', (event) => {
    event.target.style.display = 'none';
    MENU.classList.remove('fadeInDown');
    MENU.classList.add('fadeOutUp');
    setTimeout(() => MENU.style.display = 'none',1000);
    BUTTONS.OPEN.style.display = 'block';
    BUTTONS.DOC.body.style.overflow = '';
});

// botones de secciones de menu
BUTTONS.DARK_B.addEventListener('click', () => {
    if(!is_dark){
        dark();
        is_dark = true;
    } else {
        light();
        is_dark = false;
    }
});

// Show Favorites secction
BUTTONS.FAVORITES_B.addEventListener('click', () =>{
    BUTTONS.DOC.getElementById('search-section').classList.add('hide');
    BUTTONS.DOC.getElementById('result-section').classList.add('hide');
    BUTTONS.DOC.getElementById('fav-section').classList.remove('hide');
    BUTTONS.DOC.getElementById('mis-section').classList.add('hide');
    BUTTONS.DOC.getElementById('carrousel-section').classList.remove('hide');
    BUTTONS.DOC.getElementById('record-section').classList.add('hide');
    if ( STORAGE.existData( 'fav' ) ) {
        const favs = STORAGE.getData( 'fav' );
        fav_arr = JSON.parse( favs );
        FAVS.insertfavs( fav_arr, 'fav', is_dark );
    } else {
        FAVS.emptySecction( 'fav', is_dark );
    }
    if( record_step !== 0 ) {
        RECORD.reset();
    }
});

// Show my gifos secction
BUTTONS.MY_GIFOS_B.addEventListener('click', () =>{
    BUTTONS.DOC.getElementById('search-section').classList.add('hide');
    BUTTONS.DOC.getElementById('result-section').classList.add('hide');
    BUTTONS.DOC.getElementById('fav-section').classList.add('hide');
    BUTTONS.DOC.getElementById('mis-section').classList.remove('hide');
    BUTTONS.DOC.getElementById('carrousel-section').classList.remove('hide');
    BUTTONS.DOC.getElementById('record-section').classList.add('hide');
    if ( STORAGE.existData( 'mis' ) ) {
        const mis = STORAGE.getData( 'mis' );
        mis_arr = GIFOS.arrayFromMis( JSON.parse( mis ) );
        FAVS.insertfavs( mis_arr, 'mis', is_dark );
        
    } else {
        FAVS.emptySecction( 'mis', is_dark );
    }
    if( record_step !== 0 ) {
        RECORD.reset();
    }
});

// Sow new secction 
BUTTONS.PLUS_B.addEventListener( 'click', () => {
    BUTTONS.DOC.getElementById('search-section').classList.add('hide');
    BUTTONS.DOC.getElementById('result-section').classList.add('hide');
    BUTTONS.DOC.getElementById('fav-section').classList.add('hide');
    BUTTONS.DOC.getElementById('mis-section').classList.add('hide');
    BUTTONS.DOC.getElementById('carrousel-section').classList.add('hide');
    BUTTONS.DOC.getElementById('record-section').classList.remove('hide');
} );

// start event create gifos
BUTTONS.START_B.addEventListener('click', function() {
    switch( record_step ) {
        case 0:// star camera stream
            record_step = RECORD.start();
            BUTTONS.UNO.classList.add( 'active-round' );
            this.classList.add('hide');
            RECORD.getMedia();
            break;
        case 1:// stard record
            record_step = RECORD.startRecord();
            break;
        case 2:// stop record
            record_step = RECORD.endRecord();
            break;
        case 3: // save gifo
            BUTTONS.DOS.classList.remove( 'active-round' );
            BUTTONS.TRES.classList.add( 'active-round' );
            RECORD.saveBlob();
            // record_step = 0;
            break;
    }
});

// Delete text search
BUTTONS.DELETE.addEventListener( 'click', () => {
    SEARCHS.cleanText();
    SEARCHS.deleteClass();
});

// peticiones giphy

//Trendings text
GIPHY.getTrending().then( trendings => INSERTS.insertTrendingText( trendings ) );

//boton search
BUTTONS.SEARCH.addEventListener( 'click', () => {
    let text = SEARCHS.getSearchText();
    if( text.length > 0 ) {
        GIPHY.search(text).then( gifs => {
            if(gifs) {
                if( gifs.length > 0 ) {
                    search_arr = GIFOS.createArray( gifs );
                    INSERTS.insertResults( text, search_arr, is_dark );
                    SEARCHS.cleanText();
                } else {
                    INSERTS.emptySecction( text, is_dark );
                }
                BUTTONS.INPUT_SEARCH.value = '';
            }
        } );
    } else {
        alert( 'No se ingreso valor a buscar' );
    }
} );

BUTTONS.INPUT_SEARCH.addEventListener( 'keyup', function(e) {
    if(e.which === 13 && e.keyCode === 13){
        if ( this.value.length > 0 ) {
            GIPHY.search(this.value).then( gifs => {
                if(gifs) {
                    if( gifs.length > 0 ) {
                        search_arr = GIFOS.createArray( gifs );
                        INSERTS.insertResults( this.value, search_arr, is_dark );
                        SEARCHS.cleanText();
                        SEARCHS.deleteClass();
                    } else {
                        INSERTS.emptySecction( this.value, is_dark );
                    }
                }
            } );
        } else {
            alert( 'No se ingreso valor a buscar' );
        }
    } else {
        GIPHY.autocomplete(this.value).then( list => {
            if( list.length > 0 ) {
                SEARCHS.setClass();
                INSERTS.insertRecomendations( list, is_dark );
            } else {
                SEARCHS.deleteClass();
            }
        } );
    }
});

export function setStep( value ) {
    record_step = value;
}