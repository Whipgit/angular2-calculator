import { Component } from '@angular/core';
import { CalculatorComponent } from './calculator/calculator.component';

@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html',
    directives: [
        CalculatorComponent
    ]
})


export class AppComponent {

    constructor() { }

}
