import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { ServiceService } from 'src/app/services/service.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(public store: Store<any>, private route: ActivatedRoute, private service: ServiceService) { }

  characterDetails: any;
  characterId!: any;
  species: string = ''
  planet: string = ''
  loading: boolean = false;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.characterId = params.get('id');
      this.loading = true;
      this.service.getCharacter(this.characterId).subscribe(character => {
        this.service.addDataByKey([character]).subscribe(res => {
          if (res && res.length > 0) {
            this.characterDetails = res[0];
            this.loading = false;
            console.log(this.characterDetails)
            this.species = this.characterDetails?.specicesData?.map((speice: any) => speice.name).join(',');
            this.planet = this.characterDetails?.planetData?.map((planet: any) => planet.name).join(',');
          }
        })
      }, err => {
        console.log(err)
      })
    });
  }

}
