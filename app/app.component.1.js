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
        this.clearValue = 'AC';
        this.completePattern = new RegExp("[0-9-+*/.()]");
    }
    // Handles all calculator buttons except "=" and "AC"
    AppComponent.prototype.calcButtonPress = function (inputValue) {
        this.lcdValue += inputValue;
        this.flipACButton(true);
    };
    // Only handle keyboard input we want to use.
    // Route keyboard input to their appropriate functions
    AppComponent.prototype.handleKeyboardEvents = function (keyPress) {
        var key = keyPress.key;
        console.log(key);
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
            case '=':
                this.evaluate();
                break;
            case 'Enter':
                this.evaluate();
                break;
        }
    };
    // If the LCD contains an expression -> clear the last entry (backspace)
    // If the LCD contains a result -> clear the entire value
    AppComponent.prototype.clearButtonPress = function () {
        if (this.lcdValueExpression) {
            this.lcdValue = this.lcdValue.slice(0, -1);
            if (!this.lcdValue) {
                this.flipACButton(false);
            }
            else {
                this.flipACButton(true);
            }
        }
        else {
            this.lcdValue = '';
            this.flipACButton(false);
        }
    };
    // Change the string value for the CE button
    // CE = Clear Entry (backspace)
    // AC = All Clear (remove entire value)
    AppComponent.prototype.flipACButton = function (input) {
        this.lcdValueExpression = input;
        this.clearValue = (this.lcdValueExpression) ? 'CE' : 'AC';
    };
    // We turn the string into something our evaluate() can read
    AppComponent.prototype.standardizeString = function (input) {
        while (input.charAt(0) === "+")
            input = input.substr(1);
        input = this.replaceBy(input, ' ', '');
        input = this.replaceBy(input, 'x', '*');
        input = this.replaceBy(input, '-(', '-1*(');
        input = this.replaceBy(input, ')(', ')*(');
        input = this.replaceBy(input, '-', '+-');
        input = this.replaceBy(input, '--', '+');
        input = this.replaceBy(input, '++', '+');
        input = this.replaceBy(input, '(+', '(');
        for (var i = 0; i < 10; i++) {
            input = this.replaceBy(input, i + "(", i + "*(");
        }
        return input;
    };
    // Helperfunction used by standardizeString()
    AppComponent.prototype.replaceBy = function (target, find, replace) {
        return target
            .split(find)
            .join(replace);
    };
    AppComponent.prototype.evaluate = function () {
        var valueToEvaluate = this.lcdValue;
        var solution = '';
        if (this.completePattern.test(valueToEvaluate)) {
            valueToEvaluate = this.standardizeString(valueToEvaluate);
            solution = this.solveStr(valueToEvaluate);
            solution = this.roundDecimals(solution);
            this.lcdValue = solution;
        }
        else {
            this.lcdValue = "Error";
            this.flipACButton(false);
        }
    };
    AppComponent.prototype.roundDecimals = function (input) {
        var dotLocation = input.indexOf('.');
        var rightOfDot = '';
        var firstZeroLocation = 0;
        if (dotLocation > -1) {
            rightOfDot = input.substring(dotLocation, input.length);
            firstZeroLocation = rightOfDot.indexOf('0');
            input = (firstZeroLocation > -1) ?
                Number(input).toFixed(firstZeroLocation - 1) :
                Number(input).toFixed(2);
            rightOfDot = input.substring(dotLocation, input.length);
            firstZeroLocation = rightOfDot.indexOf('0');
            input = (firstZeroLocation > -1) ?
                Number(input).toFixed(firstZeroLocation - 1) :
                Number(input).toFixed(2);
        }
        return input;
    };
    AppComponent.prototype.solveStr = function (eq) {
        firstNest: while (this.strContain(eq, "(")) {
            var first = eq.indexOf("("); // first get the earliest open parentheses
            var last = first + 1; // start searching at the character after
            var layer = 1; // we might run into more parentheses, so this integer will keep track
            while (layer != 0) {
                if (eq[last] == ")") {
                    layer--;
                    if (layer == 0)
                        break; // if it is the corresponding closing parenthesis for our outermost open parenthesis, then we can deal with this expression
                }
                else if (eq[last] == "(") {
                    layer++;
                }
                last++; // increment the character we're looking at
                if (last > eq.length)
                    break firstNest; // if the parentheses are incorrectly nested, don't bother with this string
            }
            var nested = eq.substr(first + 1, last - first - 1); // get the expression between the parentheses
            if (last + 1 <= eq.length) {
                if (eq[last + 1] == "^") {
                    eq = eq.substr(0, last + 1) + "&" + eq.substr((last + 1) + 1);
                }
            }
            var solvedStr = this.solveStr(nested);
            var preStr = "(" + nested + ")";
            eq = eq.replace(preStr, solvedStr); // replace parenthetical with value
        }
        while (this.strContain(eq, "^"))
            eq = this.allocFx(eq, "^", function (l, r) { return Math.pow(parseFloat(l), parseFloat(r)); }, false);
        while (this.strContain(eq, "&"))
            eq = this.allocFx(eq, "&", function (l, r) { return Math.pow(parseFloat(l), parseFloat(r)); }, undefined); // account for things like (-3)^2
        while (this.strContain(eq, "*") || this.strContain(eq, "/")) {
            var multiply = true;
            if (eq.indexOf("*") < eq.indexOf("/")) {
                multiply = (this.strContain(eq, "*"));
            }
            else {
                multiply = !(this.strContain(eq, "/"));
            }
            eq = (multiply) ? this.allocFx(eq, "*", function (l, r) { return parseFloat(l) * parseFloat(r); }, undefined) : this.allocFx(eq, "/", function (l, r) { return parseFloat(l) / parseFloat(r); }, undefined);
        }
        while (this.strContain(eq, "+"))
            eq = this.allocFx(eq, "+", function (l, r) { return parseFloat(l) + parseFloat(r); }, undefined);
        return eq;
    };
    AppComponent.prototype.allocFx = function (eq, symbol, alloc, minus) {
        minus = (typeof minus !== 'undefined'); // sometimes we want to capture minus signs, sometimes not
        if (this.strContain(eq, symbol)) {
            var middleIndex = eq.indexOf(symbol);
            var left = this.getSide(eq, middleIndex, -1, minus);
            var right = this.getSide(eq, middleIndex, 1, false);
            eq = this.replaceBy(eq, left + symbol + right, alloc(left, right));
        }
        return eq;
    };
    AppComponent.prototype.strContain = function (haystack, needle) {
        return haystack.indexOf(needle) > -1;
    };
    AppComponent.prototype.getSide = function (haystack, middle, direction, minus) {
        var i = middle + direction;
        var term = "";
        var limit = (direction == -1) ? 0 : haystack.length; // set the stopping point, when you have gone too far
        while (i * direction <= limit) {
            if (this.isParseable(haystack[i], minus)) {
                if (direction == 1)
                    term = term + haystack[i];
                else
                    term = haystack[i] + term;
                i += direction;
            }
            else {
                return term;
            }
        }
        return term;
    };
    AppComponent.prototype.isParseable = function (n, minus) {
        return (!isNaN(n) || (n == "-" && !minus) || n == ".");
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
//# sourceMappingURL=app.component.1.js.map