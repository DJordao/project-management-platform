import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'app';

  constructor(private translateService: TranslateService) {
    this.translateService.addLangs(['en', 'pt']);
    this.translateService.setDefaultLang('en');
    this.translateService.use('en');
  }
    ngOnInit(): void {
      let lang = localStorage.getItem("language");
      if (lang && lang != "") {
        this.translateService.use(lang);
      }
    }
}
