import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  constructor(
    // private readonly pokemonService: PokemonService,
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
  ){
    
  }
 
  async executeSeed() {

    await this.pokemonModel.deleteMany({}); //delete * from pokemons
    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650')

    const pokemonToInsert: { name: string, no: number}[] = [];
    
    data.results.forEach(({name, url}) => {
      // console.log({name,url});
      const segments = url.split('/');
      const no:number = +segments[segments.length - 2];

      // const pokemon = await this.pokemonModel.create( {name,no} );
      pokemonToInsert.push({name,no});


      // console.log({name,no});
    });

    // await Promise.all( insertPromisesArray );
    await this.pokemonModel.insertMany(pokemonToInsert);

    
    // return data.results;
    return 'Seed Executed';
  }

  // async executeSeed() {

  //   await this.pokemonModel.deleteMany({}); //delete * from pokemons
  //   const { data } = await axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10')

  //   const insertPromisesArray = [];
    
  //   data.results.forEach(({name, url}) => {
  //     console.log({name,url});
  //     const segments = url.split('/');
  //     const no:number = +segments[segments.length - 2];

  //     const pokemon = await this.pokemonModel.create( {name,no} );
  //     insertPromisesArray.push(
  //       this.pokemonModel.create({name,no})
  //     );

  //     console.log({name,no});
  //   });

  //   await Promise.all( insertPromisesArray );

    
  //   // return data.results;
  //   return 'Seed Executed';
  // }
}
