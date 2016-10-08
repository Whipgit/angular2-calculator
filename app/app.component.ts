import { Component, OnInit, } from '@angular/core';
import 'rxjs/Rx';

@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html',
    host: {
        '(document:keypress)': 'handleKeyboardEvents($event)'
    }
})


export class AppComponent {

    lcdValue: string = '';
    lcdValueExpression: boolean = false;
    cancelOrClearValue: string = 'AC'
    pattern = new RegExp("[0-9-+*/.()]");

    constructor() { }

    calcButtonPress(inputValue) {
        if (!this.lcdValue || this.isNextValueAllowed(inputValue)) {
            this.lcdValue += inputValue;
            this.lcdValueExpression = true;
            this.flipACButton();
        }        
    }

    // Only handle keyboard input we want to use.
    // Route keyboard input to their appropriate functions
    handleKeyboardEvents(keyPress) {        
        let key = keyPress.key;
        switch (key) {
            case '0': this.calcButtonPress(key); break;
            case '1': this.calcButtonPress(key); break;
            case '2': this.calcButtonPress(key); break;
            case '3': this.calcButtonPress(key); break;
            case '4': this.calcButtonPress(key); break;
            case '5': this.calcButtonPress(key); break;
            case '6': this.calcButtonPress(key); break;
            case '7': this.calcButtonPress(key); break;
            case '8': this.calcButtonPress(key); break;
            case '9': this.calcButtonPress(key); break;
            case '+': this.calcButtonPress(key); break;
            case '-': this.calcButtonPress(key); break;
            case '*': this.calcButtonPress('x'); break;
            case '/': this.calcButtonPress(key); break;
            case '(': this.calcButtonPress(key); break;
            case ')': this.calcButtonPress(key); break;
            case '.': this.calcButtonPress(key); break;
            case 'Backspace': this.cancelOrClearButtonPress; break;
            case '=': this.evaluate(); break;
            case 'Enter': this.evaluate(); break;
        }
    }

    // If the LCD contains an expression -> clear the last entry
    // If the LCD contains a result -> clear the entire result
    cancelOrClearButtonPress() {
        if (this.lcdValueExpression) {
            this.lcdValue = this.lcdValue.slice(0, -1);
            if (!this.lcdValue) {
                this.lcdValueExpression = false;
                this.flipACButton();
            } else {
                this.lcdValueExpression = true;
                this.flipACButton();
            }
        } else {
            this.lcdValue = '';
            this.lcdValueExpression = false;
            this.flipACButton();
        }

    }

    flipACButton() {
        this.cancelOrClearValue = (this.lcdValueExpression) ? 'CE': 'AC';
    }

    isNextValueAllowed(input) {
        let lastCharacter = this.lcdValue.slice(-1);
        return true;
    }

    evaluate() {
        // Evaluate the LCD value with the RegEx Pattern
        if (this.pattern.test(this.lcdValue)) {

        } else {
            this.lcdValue = "Error";
        }
    }

}
