import { ToastsService } from './../../Core/services/toasts.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BodyService } from '../../Core/services/body.service';
import { BrandService } from '../../Core/services/brand.service';
import { Brand } from '../../Core/Interface/Brand';
import { SearchPipe } from '../../Core/Pipes/search.pipe';
declare var bootstrap: any;

@Component({
  selector: 'app-brand',
  standalone: true,
  imports: [ReactiveFormsModule , FormsModule , SearchPipe],
  templateUrl: './brand.component.html',
  styleUrl: './brand.component.scss'
})
export class BrandComponent implements OnInit {
 BrandForm: FormGroup;
 loading = true; 
  submissionMessage = ''; 
  textSearch= '';
  brands: Brand[] = [];
  constructor(private fb: FormBuilder, private brandService: BrandService , private _ToastsService:ToastsService) {
    this.BrandForm = this.fb.group({
      name: ['', Validators.required],
      image: ['', Validators.required],
    });
  }
  onFileSelect(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.BrandForm.patchValue({
        image: file
      });
    }
    
  }
// إضافة سيارة جديدة
async onSubmit() {
  if (this.BrandForm.valid) {
    this.loading = true;
    this.submissionMessage = '';
    try {
      await this.brandService.addBarnd(this.BrandForm.value);
      this.submissionMessage = 'Brand added successfully';
      this._ToastsService.showToast("success", this.submissionMessage);
      const modalElement = document.getElementById('BrandModal');
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance.hide();
      this.loadData();
      this.BrandForm.reset();
    } catch (error) {
      this.submissionMessage = 'Error during Brand submission. Please try again.';
      this._ToastsService.showToast("error", this.submissionMessage);
    } finally {
      this.loading = false;
    }
  } else {
    this.submissionMessage = 'Please fill out all required fields.';
    this._ToastsService.showToast("error", this.submissionMessage);
  }
}

async onDeleteBrand(BrandId: number): Promise<void> {
  try {
    const isConfirmed = await this._ToastsService.confirmDeletion();
    if (isConfirmed) {
      await this.brandService.deleteBarnd(BrandId);
      this.loadData();
      this.submissionMessage = 'Brand deleted successfully';
      this._ToastsService.showToast("success", this.submissionMessage);
    }
  } catch (error) {
    console.error('Error deleting Brand:', error);
    this.submissionMessage = 'Error deleting Brand';
    this._ToastsService.showToast("error", this.submissionMessage);
  }
}


  ngOnInit(): void {
    this.loadData();
  }

  async loadData() {
    this.brands = await this.brandService.getTableData();
     this.loading =false;

    console.log(this.brands)
  }
}
