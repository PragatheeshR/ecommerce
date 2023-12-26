import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';

import {map} from 'rxjs/operators';
import { Country } from '../common/country';
import { State } from '../common/state';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShopFormService {

  private endPOint = environment.baseBackEndUrl;
  private countriesURL=this.endPOint + "/country";
  private statesURL= this.endPOint + "/states";

  constructor(private httpClient : HttpClient) { }

  getCountries() : Observable<Country[]>{
      return this.httpClient.get<GetCountryResponse>(this.countriesURL).pipe(
        map(response => response._embedded.country)
      );
  }

  getStates(countryCode : string) : Observable<State[]>{

    const stateSearchURL = `${this.statesURL}/search/findByCountryCode?code=${countryCode}`;
    console.log(stateSearchURL);
    return this.httpClient.get<GetStateResponse>(stateSearchURL).pipe(
      map(response => response._embedded.states)
    );
}




}

interface  GetCountryResponse{
    _embedded : {
        country : Country[]
    }
  
}


interface  GetStateResponse{
  _embedded : {
      states : State[]
  }

}