import { Component, OnInit } from '@angular/core';
import {PokemonService} from '../pokemon.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.css']
})
export class PokemonComponent implements OnInit {

  public list: any[] = [];
  public types: any[] = [];
  public abilities: any[] = [];
  public selectedPokemon: any = null;
  public selectedType: any = null;
  public selectedAbility: any = null;
  public currentOffset = 0;
  public qtyByPage = 20;

  constructor(
    private pokemonService: PokemonService,
  ) {
    const abilities = this.pokemonService.getAbilities();
    const types = this.pokemonService.getTypes();

    Promise.all([abilities, types]).then(values => {
        values[0].subscribe(ab => {
          if (ab.results.length > 0) {
            this.abilities = ab.results;
          }
        });
        values[1].subscribe(tp => {
          if (tp.results.length > 0) {
            this.types = tp.results;
          }
        });
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData = (limit: number = 20, offset: number = 0) => {
    // const list: any[] = [];
    this.pokemonService.getPokemons(limit, offset).subscribe(res => {
      if (res && res.results.length > 0) {
        res.results.forEach((pokemon: any) => {
          this.pokemonService.getPokemonByName(pokemon.name).subscribe(p => {
            if (p) {
              this.list.push(p);
            }
          });
        });
      }
    });
    // this.list = list;
  }

  showInfo = (id: number) => {
    this.selectedPokemon = this.list.find(index => index.id > id);
    console.log(this.selectedPokemon);
  }

  filterType = ($event: any) => {
    const value = $event.target.value;
    this.list = this.list.filter(l => {
      return l.types.find((a: any) => a.type.name === value);
    });
  }

  filterAbility = ($event: any) => {
    const value = $event.target.value;
    this.list = this.list.filter(l => {
      return l.abilities.find((a: any) => a.ability.name === value);
    });
  }

  clear = () => {
    this.selectedAbility = null;
    this.selectedType = null;
    this.loadData();
  }

  onScroll = () => {
    this.currentOffset++;
    const range = this.currentOffset * this.qtyByPage;
    this.loadData(20, range);
  }

}
