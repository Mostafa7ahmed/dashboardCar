import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BodyService } from '../../Core/services/body.service';
import { Body } from '../../Core/Interface/Body';
import { ToastsService } from '../../Core/services/toasts.service';
import { SearchPipe } from '../../Core/Pipes/search.pipe';
declare var bootstrap: any;

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [ReactiveFormsModule , SearchPipe, FormsModule],
  templateUrl: './body.component.html',
  styleUrl: './body.component.scss'
})
export class BodyComponent {
  BodyForm: FormGroup;
  loading = true; 
   submissionMessage = ''; 
   textSearch= '';
   bodys: Body[] = [];
   constructor(private fb: FormBuilder, private BodyService: BodyService , private _ToastsService:ToastsService) {
     this.BodyForm = this.fb.group({
       name: ['', Validators.required],
       image: ['', Validators.required],
     });
   }
   onFileSelect(event: any) {
     const file: File = event.target.files[0];
     if (file) {
       this.BodyForm.patchValue({
         image: file
       });
     }
     
   }
 // إضافة سيارة جديدة
 async onSubmit() {
   if (this.BodyForm.valid) {
     this.loading = true;
     this.submissionMessage = '';
     try {
       await this.BodyService.addBody(this.BodyForm.value);
       this.submissionMessage = 'Body added successfully';
       this._ToastsService.showToast("success", this.submissionMessage);
       const modalElement = document.getElementById('BodyModal');
       const modalInstance = bootstrap.Modal.getInstance(modalElement);
       modalInstance.hide();
       this.loadData();
       this.BodyForm.reset();
     } catch (error) {
       this.submissionMessage = 'Error during Body submission. Please try again.';
       this._ToastsService.showToast("error", this.submissionMessage);
     } finally {
       this.loading = false;
     }
   } else {
     this.submissionMessage = 'Please fill out all required fields.';
     this._ToastsService.showToast("error", this.submissionMessage);
   }
 }
 
 async onDeleteBody(BodyId: number): Promise<void> {
   try {
     const isConfirmed = await this._ToastsService.confirmDeletion();
     if (isConfirmed) {
       await this.BodyService.deleteBody(BodyId);
       this.loadData();
       this.submissionMessage = 'Body deleted successfully';
       this._ToastsService.showToast("success", this.submissionMessage);
     }
   } catch (error) {
     console.error('Error deleting Body:', error);
     this.submissionMessage = 'Error deleting Body';
     this._ToastsService.showToast("error", this.submissionMessage);
   }
 }
 
 
   ngOnInit(): void {
     this.loadData();
   }
 
   async loadData() {
     this.bodys = await this.BodyService.getTableData();
      this.loading =false;
 
     console.log(this.bodys)
   }
}
