import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
    this.inputValue = this.character + this.inputValue;
  }

  clearInput() {
    this.inputValue = '';
  }
}
