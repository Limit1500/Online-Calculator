import { Component } from '@angular/core';
import { CalculatorComponent } from '../../components/calculator/calculator.component';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [ CalculatorComponent ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {

}
