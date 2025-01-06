import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CarService } from '../../Core/services/car.service';
import { BodyService } from '../../Core/services/body.service';
import { BrandService } from '../../Core/services/brand.service';
declare var bootstrap: any;

@Component({
  selector: 'app-brand',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './brand.component.html',
  styleUrl: './brand.component.scss'
})
export class BrandComponent implements OnInit {
 carForm: FormGroup;
  isLoading = true; 
  submissionMessage = ''; 
  brantcars: any[] = [];
  constructor(private fb: FormBuilder, private brandService: BrandService) {
    this.carForm = this.fb.group({
      name: ['', Validators.required],
      image: ['', Validators.required],
    });
  }

  async onSubmit() {
    if (this.carForm.valid) {
      this.isLoading = true;
      this.submissionMessage = '';
      try {
        await this.brandService.addBrand(this.carForm.value);
        this.submissionMessage = 'Car added successfully';
        const modalElement = document.getElementById('carModal');
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide();
        this.loadData();

        this.carForm.reset(); 
      } catch (error) {
        this.submissionMessage = 'Error during car submission. Please try again.';
        console.error('Error during car submission:', error);
      } finally {
        this.isLoading = false;
      }
    } else {
      this.submissionMessage = 'Please fill out all required fields.';
      console.error('Form is not valid');
    }
  }


  ngOnInit(): void {
    this.loadData();
  }

  async loadData() {
    this.brantcars = await this.brandService.getcar();
     this.isLoading =false;

    console.log(this.brantcars)
  }
}
