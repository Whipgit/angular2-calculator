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
var CalculatorComponent = (function () {
    function CalculatorComponent() {
        this.lcdValue = '';
        this.lcdValueExpression = false;
        this.clearValue = 'AC';
        this.completePattern = new RegExp("[0-9-+*/.()]");
        this.numbersPattern = new RegExp('^[0-9]+$');
        this.lcdBackGroundColor = '#424242';
        this.parenthesisFlag = 0;
        this.expression = '=';
    }
    // Handles all calculator buttons except "AC".
    CalculatorComponent.prototype.calcButtonPress = function (inputValue) {
        if (this.lcdValue === 'Error' || this.lcdValue === 'NaN')
            this.lcdValue = '';
        if (this.validateInput(inputValue)) {
            if ('/*-+'.indexOf(inputValue) === -1 && !this.lcdValueExpression) {
                this.lcdValue = inputValue;
            }
            else if (this.completePattern.test(inputValue)) {
                this.lcdValue += inputValue;
            }
            else if (inputValue === '=') {
                this.evaluate();
                return;
            }
            this.flipACButton(true);
        }
        else {
            this.flashLCD();
        }
    };
    // Only handle keyboard input we want to use.
    // Route keyboard input to their appropriate functions
    CalculatorComponent.prototype.handleKeyboardEvents = function (keyPress) {
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
                this.calcButtonPress(key);
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
                this.calcButtonPress(key);
                break;
            case 'Enter':
                this.calcButtonPress('=');
                break;
        }
    };
    // Return true if the next input matches something that makes sense
    CalculatorComponent.prototype.validateInput = function (input) {
        var lastValue = this.lcdValue.substr(this.lcdValue.length - 1, 1);
        this.editParenthesisFlag(input, true);
        if (!lastValue || '(/*+.'.indexOf(lastValue) > -1) {
            if (')*/'.indexOf(input) > -1) {
                this.editParenthesisFlag(input, false);
                return false;
            }
            if (lastValue === '.' && ')(-+'.indexOf(input) > -1) {
                this.editParenthesisFlag(input, false);
                return false;
            }
        }
        if (this.numbersPattern.test(lastValue) && this.parenthesisFlag) {
            if (')'.indexOf(input) > -1) {
                this.editParenthesisFlag(input, false);
                return false;
            }
        }
        return true;
    };
    // For every open parenthesis, we must have a closed parenthesis
    // We use this for input validation before we evaluate
    CalculatorComponent.prototype.editParenthesisFlag = function (input, add) {
        if (add) {
            if ('('.indexOf(input) > -1)
                this.parenthesisFlag += 1;
            if (')'.indexOf(input) > -1)
                this.parenthesisFlag -= 1;
        }
        else {
            if ('('.indexOf(input) > -1)
                this.parenthesisFlag -= 1;
            if (')'.indexOf(input) > -1)
                this.parenthesisFlag += 1;
        }
    };
    // In case of anticipated input error: flash the lcd red
    CalculatorComponent.prototype.flashLCD = function () {
        var _this = this;
        var currentLCDValue = this.lcdValue;
        this.lcdValue = 'Input Error';
        this.lcdBackGroundColor = '#a02626';
        setTimeout(function () {
            _this.lcdBackGroundColor = '#424242';
            _this.lcdValue = currentLCDValue;
        }, 500);
    };
    // If the LCD contains an expression -> clear the last entry (backspace)
    // If the LCD contains a result -> clear the entire value
    CalculatorComponent.prototype.clearButtonPress = function () {
        if (this.lcdValueExpression) {
            var valueToRemove = this.lcdValue.substring(this.lcdValue.length, this.lcdValue.length - 1);
            if ('()'.indexOf(valueToRemove) > -1) {
                this.editParenthesisFlag(valueToRemove, false);
            }
            this.lcdValue = this.lcdValue.slice(0, -1);
            if (!this.lcdValue)
                this.flipACButton(false);
            else
                this.flipACButton(true);
        }
        else {
            this.lcdValue = '';
            this.expression = '=';
            this.parenthesisFlag = 0;
            this.flipACButton(false);
        }
    };
    // Change the string value for the CE button
    // CE = Clear Entry (backspace)
    // AC = All Clear (remove entire value)
    CalculatorComponent.prototype.flipACButton = function (input) {
        this.lcdValueExpression = input;
        this.clearValue = (this.lcdValueExpression) ? 'CE' : 'AC';
    };
    // Helperfunction used by standardizeString()
    CalculatorComponent.prototype.replaceBy = function (target, find, replace) {
        return target
            .split(find)
            .join(replace);
    };
    // To round results such as:
    // 0.1 + 0.2 = 0.300000000000004 -> 0.3
    // 0.1 * 0.2 = 0.020000000000000004 -> 0.02
    CalculatorComponent.prototype.roundValue = function (input) {
        var dotLocation = input.toString().indexOf('.');
        var flagDigit = false;
        if (dotLocation > -1 && input.length > 15) {
            var afterDotString = input.substring(dotLocation, input.length);
            for (var i = 0; i < afterDotString.length; i++) {
                if (parseInt(afterDotString[i]) > 0)
                    flagDigit = true;
                if (afterDotString[i] === '0' && flagDigit) {
                    return input.substring(0, dotLocation + i);
                }
            }
        }
        return input;
    };
    CalculatorComponent.prototype.evaluate = function () {
        var valueToEvaluate = this.lcdValue;
        var polishNotation = '';
        var solution = '';
        if (this.completePattern.test(valueToEvaluate) && !this.parenthesisFlag) {
            polishNotation = this.convertToPolishNotation(valueToEvaluate);
            solution = this.solvePolishNotation(polishNotation);
            this.expression = this.lcdValue + ' =';
            this.lcdValue = this.roundValue(solution);
        }
        else {
            this.expression = 'Cannot resolve: ' + this.lcdValue;
            this.lcdValue = "Error";
            this.parenthesisFlag = 0;
        }
        this.flipACButton(false);
    };
    CalculatorComponent.prototype.convertToPolishNotation = function (input) {
        var output = "";
        var operatorStack = [];
        var operators = {
            "/": { weight: 3 },
            "*": { weight: 3 },
            "+": { weight: 2 },
            "-": { weight: 2 }
        };
        input = this.standardizeString(input);
        input = input.replace(/\s+/g, '');
        input = input.split(/([\+\-\*\/\^\(\)])/);
        input = this.cleanArray(input);
        for (var i = 0; i < input.length; i++) {
            var token = input[i];
            if ('(/*'.indexOf(input[i - 1]) > -1 && token === '-') {
                token += input[i + 1];
                i += 1;
            }
            if (this.isNumeric(token)) {
                output += token + ' ';
            }
            else if ('*/+-'.indexOf(token) !== -1) {
                var r1 = token;
                var r2 = operatorStack[operatorStack.length - 1];
                while ('*/+-'.indexOf(r2) !== -1 && operators[r1].weight <= operators[r2].weight) {
                    output += operatorStack.pop() + ' ';
                    r2 = operatorStack[operatorStack.length - 1];
                }
                operatorStack.push(r1);
            }
            else if (token === '(') {
                operatorStack.push(token);
            }
            else if (token === ')') {
                while (operatorStack[operatorStack.length - 1] !== '(') {
                    output += operatorStack.pop() + ' ';
                }
                operatorStack.pop();
            }
        }
        while (operatorStack.length > 0) {
            output += operatorStack.pop() + ' ';
        }
        return output;
    };
    CalculatorComponent.prototype.solvePolishNotation = function (polish) {
        var results = [];
        polish = polish.split(" ");
        polish = this.cleanArray(polish);
        for (var i = 0; i < polish.length; i++) {
            if (this.isNumeric(polish[i])) {
                results.push(polish[i]);
            }
            else {
                var a = results.pop();
                var b = results.pop();
                if (polish[i] === '+') {
                    results.push(parseFloat(a) + parseFloat(b));
                }
                else if (polish[i] === '-') {
                    results.push(parseFloat(b) - parseFloat(a));
                }
                else if (polish[i] === '*') {
                    results.push(parseFloat(a) * parseFloat(b));
                }
                else if (polish[i] === '/') {
                    results.push(parseFloat(b) / parseFloat(a));
                }
            }
        }
        if (results.length > 1) {
            return 'Error';
        }
        else {
            return results
                .pop()
                .toString();
        }
    };
    // We turn the string into something our convertToPolishNotation() can read
    CalculatorComponent.prototype.standardizeString = function (input) {
        while (input.charAt(0) === '+')
            input = input.substr(1);
        input = this.replaceBy(input, ' ', '');
        input = this.replaceBy(input, 'x', '*');
        input = this.replaceBy(input, '-(', '-1*(');
        input = this.replaceBy(input, ')(', ')*(');
        input = this.replaceBy(input, '--', '+');
        input = this.replaceBy(input, '+-', '-');
        input = this.replaceBy(input, '-+', '-');
        input = this.replaceBy(input, '++', '+');
        input = this.replaceBy(input, '(+', '(');
        for (var i = 0; i < 10; i++) {
            input = this.replaceBy(input, i + "(", i + "*(");
        }
        return input;
    };
    // Remove empty values from Array
    CalculatorComponent.prototype.cleanArray = function (input) {
        for (var i = 0; i < input.length; i++) {
            if (input[i] === '')
                input.splice(i, 1);
        }
        return input;
    };
    // Return true if input is numeric
    CalculatorComponent.prototype.isNumeric = function (input) {
        return !isNaN(parseFloat(input));
    };
    CalculatorComponent = __decorate([
        core_1.Component({
            selector: 'js-calculator',
            templateUrl: './app/calculator/calculator.component.html',
            host: {
                '(document:keypress)': 'handleKeyboardEvents($event)'
            }
        }), 
        __metadata('design:paramtypes', [])
    ], CalculatorComponent);
    return CalculatorComponent;
}());
exports.CalculatorComponent = CalculatorComponent;
//# sourceMappingURL=calculator.component.js.map