'use strict';

(function() {
    let template = `
    	<style>
    	    @import url('https://fonts.googleapis.com/css?family=Roboto:400,300');
            @import url('https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css');
            @import url('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css');
            @import url('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap-theme.min.css');
            @import '/src/css/osbPocketPoke.css';
    	</style>
    	<main class="osb-pocket-poke-holder">
    	    <section class="container">
    	        <h2><i class="fa fa-calculator"></i> PocketPoke</h2>
    		    <ul class="pokeList list-unstyled list-inline"></ul>
    	    </section>
    	</main>
    	`;
    class osbPocketPoke extends HTMLElement {
        createdCallback() {
            console.log('Lets get started');
            this.createShadowRoot().innerHTML = template;
            this.pokeApiBase = 'http://pokeapi.co/api/v2/';
            this.pokeApiBaseLeg = 'http://pokeapi.co/api/v1/';
            this.$holder = this.shadowRoot.querySelector('.osb-pocket-poke-holder');
            this.$pokeListing = this.$holder.querySelector('.pokeList');
            this.listCount = 20;
            this.pokemonData = [];
            this.pokemon = [];
            // Get Existing Cached Pokemon
            var pocketPokemons = localStorage.getItem('osbPocketPoke.pokemon');
            if (pocketPokemons) {
                this.pokemon = JSON.parse(pocketPokemons);
            }
            // Get Main Cached Pokemon List
            var holder = this;
            var pocketPokeDex = localStorage.getItem('osbPocketPoke');
            if (pocketPokeDex) {
                var pokeList = JSON.parse(pocketPokeDex).slice(0, this.listCount);
                var pokeCount = 0;
                pokeList.forEach(function(element, index, array) {
                    pokeCount++;
                    if (pokeCount === array.length) {
                        console.log('callback');
                    } else {
                        holder.pokemonData.push(element);
                        holder.getPokemon(element);
                    }
                });
            } else {
                this.getPokeList();
            }
        };

        attachedCallback() {};

        attributeChangedCallback(attrName, oldVal, newVal) {};

        renderMainList(data) {
            this.$pokeListing.innerHTML +=
                '<li id="' + data.name + '" class="col-md-3" poke-id="' + data.id + '">' +
                    '<div class="img-holder text-center"></div>' +
                    '<h2>' + data.name + '</h2>' +
                    '<p>Height: ' + data.height + ' Weight: ' + data.weight + '</p>' +
                    '<div class="abilities"></div>' +
                '</li>';
            this.getPokeSprite(data);
        };

        getPokeSprite(pokemon) {
            //console.log(pokemon);
            var holder = this;
            fetch(this.pokeApiBaseLeg + 'sprite/' + pokemon.id)
                .then(function(response) {
                    if (response.status !== 200) {
                        console.log('Looks like there was a problem. Status Code: ' + response.status);
                        return;
                    }
                    response.json().then(function(data) {
                        var sprite = new Image();
                        var spriteHolder = holder.$holder.querySelector('#' + data.pokemon.name + ' .img-holder');
                        spriteHolder.appendChild(sprite);
                        sprite.src = 'http://pokeapi.co' + data.image;
                    });
                })
                .catch(function(err) {
                    console.log('Failed');
                });
        }

        getPokemon(pokemon) {
            var holder = this;
            if (holder.pokemon.length > 1) {
                holder.pokemon.forEach(function(element, index, array) {
                   if (pokemon.name === element.name) {
                       holder.renderMainList(element);
                   }
                });
                return false;
            }
            fetch(pokemon.url)
                .then(function(response) {
                    if (response.status !== 200) {
                        console.log('Looks like there was a problem. Status Code: ' + response.status);
                        return;
                    }
                    response.json().then(function(data) {
                        holder.pokemon.push(data);
                        localStorage.setItem('osbPocketPoke.pokemon', JSON.stringify(holder.pokemon));
                        holder.renderMainList(data);
                    });
                })
                .catch(function(err) {
                    console.log('Failed');
                });
        };

        getPokeList() {
            var holder = this;
            fetch(this.pokeApiBase + 'pokemon/')
                .then(function(response) {
                    if (response.status !== 200) {
                        console.log('Looks like there was a problem. Status Code: ' + response.status);
                        return;
                    }
                    response.json().then(function(data) {
                        holder.pocketPoke = data;
                        localStorage.setItem('osbPocketPoke', JSON.stringify(data));
                        var pokeCount = 0;
                        var shortList = holder.pocketPoke.slice(0, holder.listCount);
                        shortList.forEach(function(element, index, array) {
                            pokeCount++;
                            if (pokeCount === array.length) {
                                console.log('callback');
                            } else {
                                holder.pokemonData.push(element);
                                holder.getPokemon(element);
                            }
                        });
                    });
                })
                .catch(function(err) {
                    console.log('Failed');
                });
        };
    }
    // Register Element
    document.registerElement('osb-pocket-poke', osbPocketPoke);
})();