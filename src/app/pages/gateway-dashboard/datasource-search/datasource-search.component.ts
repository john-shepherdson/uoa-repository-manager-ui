import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from "@angular/router";
import { DatasourceSearchService } from "../services/datasource-search.service";
import { JsonPipe, NgForOf } from "@angular/common";
import { Datasource } from "../domain/datasource.domain";
import { InputComponent } from "../../../shared/input.component";
import { FormControl, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'datasource-search',
  templateUrl: './datasource-search.component.html',
  imports: [
    NgForOf,
    JsonPipe,
    InputComponent,
    ReactiveFormsModule
  ],
  standalone: true
})

export class DatasourceSearchComponent implements OnInit {

  qParams: Params = {};
  page = 0;
  size = 10;

  datasources: Datasource[] = [];

  keyword: FormControl = new FormControl(null);

  constructor(private route: ActivatedRoute, private router: Router, private datasourceSearch: DatasourceSearchService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.qParams = params;
      // 1) parse
      this.page = +(params['page'] ?? 0);
      this.size = +(params['size'] ?? 10);

      // 2) optionally push defaults into the URL if absent:
      if (!params['page'] || !params['size']) {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {page: this.page, size: this.size},
          queryParamsHandling: 'merge'
        });
        return;  // prevents the search below from running on renavigation
      }

      this.datasourceSearch.search(params).pipe().subscribe({
        next: (data) => {
          console.log(data);
          this.datasources = data;
        },
        error: (err) => {
          console.error(err);
        }
      });
    });

  }

}
