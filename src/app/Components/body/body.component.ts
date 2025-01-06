import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BodyService } from '../../Core/services/body.service';
declare var bootstrap: any;

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './body.component.html',
  styleUrl: './body.component.scss'
})
export class BodyComponent {
  carForm: FormGroup;
  isLoading = true; 
  submissionMessage = ''; 
  brantcars: any[] = [];

  constructor(private fb: FormBuilder, private bodyService: BodyService) {
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
        await this.bodyService.addBody(this.carForm.value);
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
    this.brantcars = await this.bodyService.getBody();
     this.isLoading =false;

    console.log(this.brantcars)
  }
}
