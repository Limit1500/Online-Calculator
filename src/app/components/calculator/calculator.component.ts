import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BigNumber } from 'bignumber.js';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.css'
})
export class CalculatorComponent {
  inputValue:string = "";
  character:string = '';

  addCharacter():void {
    this.inputValue += this.character;
  }

  clearInput() {
    this.inputValue = '';
  }

  getNumber(currentIndex:number):any {

    let nextNumber:string;

    if (this.inputValue[currentIndex] == '√'){
      nextNumber = '√';
      currentIndex++;
    }
    else {
      nextNumber = '';
    }

    if (this.inputValue[currentIndex] == 'π'){
      currentIndex++;
      nextNumber += '3.1415926535897932';
      return {nextNumber, currentIndex};
    }

    while (this.inputValue[currentIndex] >= '.' && this.inputValue[currentIndex] <= '9' && this.inputValue[currentIndex] != '/'){
      nextNumber += this.inputValue[currentIndex];
      currentIndex++;
    }
    return {nextNumber, currentIndex};
  }

  operationPriority(inputValueSegmented:string[], operatorsList:string[]) {

    let arePrimaryOperationsDone:boolean = false;

    while (arePrimaryOperationsDone == false){
      arePrimaryOperationsDone = true; 

      for (let i = 0; i < inputValueSegmented.length; i++){

        if (operatorsList.includes(inputValueSegmented[i])){
          
          arePrimaryOperationsDone = false; 

          const num1 = new BigNumber(inputValueSegmented[i - 1]);
          const num2 = new BigNumber(inputValueSegmented[i + 1]);

          let response:string = '';

          switch (inputValueSegmented[i]) {
            case '+':
              response = num1.plus(num2).toString();
              break
            case '-':
              response = num1.minus(num2).toString();
              break
            case '%':
              response = num1.mod(num2).toString();
              break
            case '^':
              response = num1.exponentiatedBy(num2).toString();
              break
            case '÷':
              response = num1.dividedBy(num2).toString();
              break
            case '×':
              response = num1.multipliedBy(num2).toString();
              break
          }

          inputValueSegmented.splice(i - 1, 3, response);

          i--;
        }
      }
    }
    return inputValueSegmented;
  }

  equal() {
    let inputValueLenght:number = this.inputValue.length;

    let inputValueSegmented:string[] = [];

    let currentIndex:number = 0;

    while (currentIndex < inputValueLenght){
      let response = this.getNumber(currentIndex);

      console.log(response.nextNumber);
      
      if (response.nextNumber[0] == '√'){

        response.nextNumber = response.nextNumber.slice(1);

        const num1 = new BigNumber(response.nextNumber);

        response.nextNumber = num1.sqrt().toString();
      }

      currentIndex = response.currentIndex;

      inputValueSegmented.push(response.nextNumber);
      inputValueSegmented.push(this.inputValue[currentIndex]);

      currentIndex++;
    }

    inputValueSegmented = this.operationPriority(inputValueSegmented, ['^'])
    inputValueSegmented = this.operationPriority(inputValueSegmented, ['÷', '×', '%'])
    inputValueSegmented = this.operationPriority(inputValueSegmented, ['+', '-'])

    this.inputValue = inputValueSegmented[0];
  }

}
