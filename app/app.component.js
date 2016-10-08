"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
require('rxjs/Rx');
var AppComponent = (function () {
    function AppComponent() {
        this.lcdValue = '';
        this.lcdValueExpression = false;
        this.cancelOrClearValue = 'AC';
        this.pattern = new RegExp("[0-9-+*/.()]");
    }
    AppComponent.prototype.calcButtonPress = function (inputValue) {
        if (!this.lcdValue || this.isNextValueAllowed(inputValue)) {
            this.lcdValue += inputValue;
            this.lcdValueExpression = true;
            this.flipACButton();
        }
    };
    // Only handle keyboard input we want to use.
    // Route keyboard input to their appropriate functions
    AppComponent.prototype.handleKeyboardEvents = function (keyPress) {
        var key = keyPress.key;
        switch (key) {
            case '0':
                this.calcButtonPress(key);
                break;
            case '1':
                this.calcButtonPress(key);
                break;
            case '2':
                this.calcButtonPress(key);
                break;
            case '3':
                this.calcButtonPress(key);
                break;
            case '4':
                this.calcButtonPress(key);
                break;
            case '5':
                this.calcButtonPress(key);
                break;
            case '6':
                this.calcButtonPress(key);
                break;
            case '7':
                this.calcButtonPress(key);
                break;
            case '8':
                this.calcButtonPress(key);
                break;
            case '9':
                this.calcButtonPress(key);
                break;
            case '+':
                this.calcButtonPress(key);
                break;
            case '-':
                this.calcButtonPress(key);
                break;
            case '*':
                this.calcButtonPress('x');
                break;
            case '/':
                this.calcButtonPress(key);
                break;
            case '(':
                this.calcButtonPress(key);
                break;
            case ')':
                this.calcButtonPress(key);
                break;
            case '.':
                this.calcButtonPress(key);
                break;
            case 'Backspace':
                this.cancelOrClearButtonPress;
                break;
            case '=':
                this.evaluate();
                break;
            case 'Enter':
                this.evaluate();
                break;
        }
    };
    // If the LCD contains an expression -> clear the last entry
    // If the LCD contains a result -> clear the entire result
    AppComponent.prototype.cancelOrClearButtonPress = function () {
        if (this.lcdValueExpression) {
            this.lcdValue = this.lcdValue.slice(0, -1);
            if (!this.lcdValue) {
                this.lcdValueExpression = false;
                this.flipACButton();
            }
            else {
                this.lcdValueExpression = true;
                this.flipACButton();
            }
        }
        else {
            this.lcdValue = '';
            this.lcdValueExpression = false;
            this.flipACButton();
        }
    };
    AppComponent.prototype.flipACButton = function () {
        this.cancelOrClearValue = (this.lcdValueExpression) ? 'CE' : 'AC';
    };
    AppComponent.prototype.isNextValueAllowed = function (input) {
        var lastCharacter = this.lcdValue.slice(-1);
        return true;
    };
    AppComponent.prototype.evaluate = function () {
        // Evaluate the LCD value with the RegEx Pattern
        if (this.pattern.test(this.lcdValue)) {
        }
        else {
            this.lcdValue = "Error";
        }
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            templateUrl: 'app/app.component.html',
            host: {
                '(document:keypress)': 'handleKeyboardEvents($event)'
            }
        }), 
        __metadata('design:paramtypes', [])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map