import { Component } from '@angular/core';

@Component({
  selector: 'app-custom-select',
  standalone: true,
  imports: [],
  templateUrl: './custom-select.component.html',
  styleUrl: './custom-select.component.scss'
})
export class CustomSelectComponent {
  nums = [1, 2, 3, 4, 5, 6, 7];
  oddNums: number[] = [];
  filterOddNums: number[] = [];

  constructor() {
    const cleanFilter = (arr: number[], checkCallback: (element: unknown) => boolean): number[] => {
      const filteredArr = [];
      for (let i = 0;  i < arr.length; i++) {
        if (checkCallback(arr[i])) filteredArr.push(arr[i]);
      }
      return filteredArr;
    };
    this.oddNums = this.nums.filter(isOdd);
    this.filterOddNums = cleanFilter(this.nums, isOdd);

    function isOdd(n: any): boolean {
      return n % 2 !== 0;
    }
  }
}
