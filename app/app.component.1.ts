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
    clearValue: string = 'AC'
    completePattern = new RegExp("[0-9-+*/.()]");

    constructor() { }

    // Handles all calculator buttons except "=" and "AC"
    calcButtonPress(inputValue: string) {
        this.lcdValue += inputValue;
        this.flipACButton(true);
    }

    // Only handle keyboard input we want to use.
    // Route keyboard input to their appropriate functions
    handleKeyboardEvents(keyPress: KeyboardEvent) {
        let key = keyPress.key;
        console.log(key);
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
            case '=': this.evaluate(); break;
            case 'Enter': this.evaluate(); break;
        }
    }

    // If the LCD contains an expression -> clear the last entry (backspace)
    // If the LCD contains a result -> clear the entire value
    clearButtonPress() {
        if (this.lcdValueExpression) {
            this.lcdValue = this.lcdValue.slice(0, -1);
            if (!this.lcdValue) {
                this.flipACButton(false);
            } else {
                this.flipACButton(true);
            }
        } else {
            this.lcdValue = '';

            this.flipACButton(false);
        }
    }

    // Change the string value for the CE button
    // CE = Clear Entry (backspace)
    // AC = All Clear (remove entire value)
    flipACButton(input: boolean) {
        this.lcdValueExpression = input;
        this.clearValue = (this.lcdValueExpression) ? 'CE' : 'AC';
    }

    // We turn the string into something our evaluate() can read
    standardizeString(input: string) {
        while (input.charAt(0) === "+") input = input.substr(1);
        input = this.replaceBy(input, ' ', '');
        input = this.replaceBy(input, 'x', '*');
        input = this.replaceBy(input, '-(', '-1*(');
        input = this.replaceBy(input, ')(', ')*(');
        input = this.replaceBy(input, '-', '+-');
        input = this.replaceBy(input, '--', '+');
        input = this.replaceBy(input, '++', '+');
        input = this.replaceBy(input, '(+', '(');
        for (let i = 0; i < 10; i++) {
            input = this.replaceBy(input, `${i}(`, `${i}*(`);
        }
        return input;
    }

    // Helperfunction used by standardizeString()
    replaceBy(target: string, find: string, replace: string) {
        return target
            .split(find)
            .join(replace);
    }

    evaluate() {
        let valueToEvaluate: string = this.lcdValue;
        let solution = '';

        if (this.completePattern.test(valueToEvaluate)) {
            valueToEvaluate = this.standardizeString(valueToEvaluate);
            solution = this.solveStr(valueToEvaluate);
            solution = this.roundDecimals(solution);
            this.lcdValue = solution;
        } else {
            this.lcdValue = "Error";
            this.flipACButton(false);
        }
    }

    roundDecimals(input: string) {
        let dotLocation: number = input.indexOf('.');
        let rightOfDot: string = '';
        let firstZeroLocation: number = 0;
        if (dotLocation > -1) {
            rightOfDot = input.substring(dotLocation, input.length);
            firstZeroLocation = rightOfDot.indexOf('0');
            input = (firstZeroLocation > -1) ?
                Number(input).toFixed(firstZeroLocation-1) :
                Number(input).toFixed(2);
            rightOfDot = input.substring(dotLocation, input.length);
            firstZeroLocation = rightOfDot.indexOf('0');
            input = (firstZeroLocation > -1) ?
                Number(input).toFixed(firstZeroLocation-1) :
                Number(input).toFixed(2);
        }
        return input;
    }


    solveStr(eq) {
        firstNest:
        while (this.strContain(eq, "(")) { // while the string has any parentheses
            var first = eq.indexOf("("); // first get the earliest open parentheses
            var last = first + 1; // start searching at the character after
            var layer = 1; // we might run into more parentheses, so this integer will keep track
            while (layer != 0) { // loop this until we've found the close parenthesis
                if (eq[last] == ")") { // if we run into a close parenthesis, then subtract one from "layer"
                    layer--;
                    if (layer == 0) break; // if it is the corresponding closing parenthesis for our outermost open parenthesis, then we can deal with this expression
                }
                else if (eq[last] == "(") { // if we see an open parenthesis, add one to "layer"
                    layer++;
                }
                last++; // increment the character we're looking at
                if (last > eq.length) break firstNest; // if the parentheses are incorrectly nested, don't bother with this string
            }

            var nested = eq.substr(first + 1, last - first - 1); // get the expression between the parentheses

            if (last + 1 <= eq.length) { // if there is exponentiation, change to a different symbol
                if (eq[last + 1] == "^") {
                    eq = eq.substr(0, last + 1) + "&" + eq.substr((last + 1) + 1);
                }
            }

            var solvedStr = this.solveStr(nested);
            var preStr = "(" + nested + ")";
            eq = eq.replace(preStr, solvedStr); // replace parenthetical with value
        }
        while (this.strContain(eq, "^")) eq = this.allocFx(eq, "^", function (l, r) { return Math.pow(parseFloat(l), parseFloat(r)); }, false);
        while (this.strContain(eq, "&")) eq = this.allocFx(eq, "&", function (l, r) { return Math.pow(parseFloat(l), parseFloat(r)); }, undefined); // account for things like (-3)^2
        while (this.strContain(eq, "*") || this.strContain(eq, "/")) {
            var multiply = true;
            if (eq.indexOf("*") < eq.indexOf("/")) {
                multiply = (this.strContain(eq, "*"));
            } else {
                multiply = !(this.strContain(eq, "/"));
            }
            eq = (multiply) ? this.allocFx(eq, "*", function (l, r) { return parseFloat(l) * parseFloat(r); }, undefined) : this.allocFx(eq, "/", function (l, r) { return parseFloat(l) / parseFloat(r); }, undefined);
        }
        while (this.strContain(eq, "+")) eq = this.allocFx(eq, "+", function (l, r) { return parseFloat(l) + parseFloat(r); }, undefined);
        return eq;
    }

    allocFx(eq, symbol, alloc, minus) {
        minus = (typeof minus !== 'undefined'); // sometimes we want to capture minus signs, sometimes not
        if (this.strContain(eq, symbol)) {
            var middleIndex = eq.indexOf(symbol);
            var left = this.getSide(eq, middleIndex, -1, minus);
            var right = this.getSide(eq, middleIndex, 1, false);
            eq = this.replaceBy(eq, left + symbol + right, alloc(left, right));
        }
        return eq;
    }

    strContain(haystack, needle) {
        return haystack.indexOf(needle) > -1;
    }

    getSide(haystack, middle, direction, minus) {
        var i = middle + direction;
        var term = "";
        var limit = (direction == -1) ? 0 : haystack.length; // set the stopping point, when you have gone too far
        while (i * direction <= limit) { // while the current position is >= 0, or <= upper limit
            if (this.isParseable(haystack[i], minus)) {
                if (direction == 1) term = term + haystack[i];
                else term = haystack[i] + term;
                i += direction;
            } else { return term; }
        }
        return term;
    }

    isParseable(n, minus) {
        return (!isNaN(n) || (n == "-" && !minus) || n == ".");
    }

}
