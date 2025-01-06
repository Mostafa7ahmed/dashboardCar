import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CarService } from '../../Core/services/car.service';

@Component({
  selector: 'app-car',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './car.component.html',
  styleUrl: './car.component.scss'
})
export class CarComponent  implements OnInit{
  tableData: any[] = [];
  loading:boolean=true;

  carForm: FormGroup;
  constructor(private fb: FormBuilder, private supabaseService: CarService) {
    this.carForm = this.fb.group({
      name: ['', Validators.required],
      price_day: ['', Validators.required],
      price_week: ['', Validators.required],
      Price_month: ['', Validators.required],
      color: ['', Validators.required],
      brand: ['', Validators.required],
      chair_num: ['', Validators.required],
      door_num: ['', Validators.required],
      type: ['', Validators.required],
      Image: [[]] 
    });
  }

  onFileSelect(event: any) {
    const files: FileList = event.target.files;
    const fileArray: File[] = Array.from(files);

    this.carForm.patchValue({
      Image: fileArray
    });
  }

  // Handle form submission
  async onSubmit() {
    if (this.carForm.valid) {
      try {
        await this.supabaseService.addCar(this.carForm.value);
        this.loading =false;
            this.loadData();

        console.log('Car added successfully');
      } catch (error) {
        this.loading =false;
        console.error('Error during car submission:', error);
      }
    } else {
      console.error('Form is not valid');
    }
  }
  ngOnInit(): void {
    this.loadData();
  }

  async loadData() {
    this.tableData = await this.supabaseService.getTableData({ name: '' ,price_day: 0 });
            this.loading =false;

    console.log(this.tableData)
  }
}
