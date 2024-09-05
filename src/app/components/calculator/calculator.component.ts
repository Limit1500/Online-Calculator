import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BigNumber } from 'bignumber.js';
import { log } from 'node:console';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent {
  inputValue: string = "";
  character: string = '';

  addCharacter(): void {
    this.inputValue += this.character;
  }

  clearInput() {
    this.inputValue = '';
  }

  getNumber(currentIndex: number, inputValue: string): any {
    let nextNumber: string = '';
    let isSqareRoot:boolean = false;

    if (inputValue[currentIndex] === '√' && inputValue[currentIndex + 1] !== '(') {
      nextNumber = '√';
      currentIndex++;
    }
    else if (inputValue[currentIndex] === '√') {
      isSqareRoot = true;
      currentIndex++;
    }

    if (inputValue[currentIndex] === '(') {
      let parenthesesParity = 1;
      currentIndex++;

      while (parenthesesParity !== 0 && currentIndex < inputValue.length) {
        if (inputValue[currentIndex] === '(') {
          parenthesesParity++;
        } else if (inputValue[currentIndex] === ')') {
          parenthesesParity--;
        }

        if (parenthesesParity !== 0) {
          nextNumber += inputValue[currentIndex];
        }

        currentIndex++;
      }

      console.log(nextNumber);

      nextNumber = this.performEquation(nextNumber);

      if (isSqareRoot){
        nextNumber = '√' + nextNumber;
      }

      console.log(nextNumber);

      return { nextNumber, currentIndex: currentIndex - 1 };
    }

    if (inputValue[currentIndex] === 'π') {
      nextNumber = '3.1415926535897932';
      currentIndex++;
      return { nextNumber, currentIndex };
    }

    while (currentIndex < inputValue.length &&
      (inputValue[currentIndex] >= '0' && inputValue[currentIndex] <= '9' || inputValue[currentIndex] === '.')) {
      nextNumber += inputValue[currentIndex];
      currentIndex++;
    }

    return { nextNumber, currentIndex: currentIndex - 1 };
  }

  operationPriority(inputValueSegmented: string[], operatorsList: string[]) {
    let arePrimaryOperationsDone: boolean = false;

    while (!arePrimaryOperationsDone) {
      arePrimaryOperationsDone = true;

      for (let i = 0; i < inputValueSegmented.length; i++) {
        if (operatorsList.includes(inputValueSegmented[i])) {
          arePrimaryOperationsDone = false;

          const num1 = new BigNumber(inputValueSegmented[i - 1]);
          const num2 = new BigNumber(inputValueSegmented[i + 1]);

          let response: string = '';

          switch (inputValueSegmented[i]) {
            case '+':
              response = num1.plus(num2).toString();
              break;
            case '-':
              response = num1.minus(num2).toString();
              break;
            case '%':
              response = num1.mod(num2).toString();
              break;
            case '^':
              response = num1.exponentiatedBy(num2).toString();
              break;
            case '÷':
              response = num1.dividedBy(num2).toString();
              break;
            case '×':
              response = num1.multipliedBy(num2).toString();
              break;
          }

          inputValueSegmented.splice(i - 1, 3, response);
          i--;
        }
      }
    }

    return inputValueSegmented;
  }

  performEquation(inputValue: string): string {
    let inputValueLength: number = inputValue.length;
    let inputValueSegmented: string[] = [];
    let currentIndex: number = 0;

    while (currentIndex < inputValueLength) {
      let response = this.getNumber(currentIndex, inputValue);

      if (response.nextNumber[0] === '√') {
        response.nextNumber = response.nextNumber.slice(1);
        const num1 = new BigNumber(response.nextNumber);
        response.nextNumber = num1.sqrt().toString();
      }

      currentIndex = response.currentIndex;

      inputValueSegmented.push(response.nextNumber);

      if (currentIndex + 1 < inputValue.length) {
        currentIndex++;
        const operator = inputValue[currentIndex];

        if (['+', '-', '÷', '×', '%', '^'].includes(operator)) {
          inputValueSegmented.push(operator);
        }
      }

      currentIndex++;
    }

    console.log(inputValueSegmented);

    inputValueSegmented = this.operationPriority(inputValueSegmented, ['^']);
    inputValueSegmented = this.operationPriority(inputValueSegmented, ['÷', '×', '%']);
    inputValueSegmented = this.operationPriority(inputValueSegmented, ['+', '-']);
    
    return inputValueSegmented.length > 0 ? inputValueSegmented[0] : '0';
  }

  equal() {
    try {
      let response = this.performEquation(this.inputValue);
      if (response === 'NaN' || response === '') {
        throw new Error("Invalid input");
      }
      else {
        this.inputValue = response;
      }

    }
    catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        this.inputValue = error.message;
      }
    }
  }
}
