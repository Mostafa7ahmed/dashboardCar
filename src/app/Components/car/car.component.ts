import { Brand } from './../../Core/Interface/Brand';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CarService } from '../../Core/services/car.service';
import { ToastsService } from '../../Core/services/toasts.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { SearchPipe } from '../../Core/Pipes/search.pipe';
import { Car } from '../../Core/Interface/car';
import { BodyService } from '../../Core/services/body.service';
import { BrandService } from '../../Core/services/brand.service';
import { Body } from '../../Core/Interface/Body';
declare var bootstrap: any;

@Component({
  selector: 'app-car',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, SearchPipe],
  templateUrl: './car.component.html',
  styleUrl: './car.component.scss'
})
export class CarComponent implements OnInit {
  carData: Car[] = [];
  bodyData: Body[] = [];
  brandData: Brand[] = [];
  editImage: string = "";
  loading: boolean = true;
  submissionMessage = '';
  textSearch: string = "";
  private _BodyService = inject(BodyService);
  private _BrandService = inject(BrandService);
  carIdToEdit: number | null = null;

  carForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private supabaseService: CarService,
    private _ToastsService: ToastsService
  ) {
    this.carForm = this.fb.group({
      name: ['', Validators.required],
      price_day: ['', Validators.required],
      price_week: ['', Validators.required],
      price_month: ['', Validators.required],
      color: ['', Validators.required],
      brand: ['', Validators.required],
      body: ['', Validators.required],
      chair_num: ['', Validators.required],
      door_num: ['', Validators.required],
      images: [''],
    });
  }

  // اختيار ملف صورة
  onFileSelect(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.carForm.patchValue({
        images: file
      });
    }
    
  }

  // إضافة سيارة جديدة
  async onSubmit() {
    if (this.carForm.valid) {
      this.loading = true;
      this.submissionMessage = '';
      try {
        await this.supabaseService.addCar(this.carForm.value);
        this.submissionMessage = 'Car added successfully';
        this._ToastsService.showToast("success", this.submissionMessage);
        const modalElement = document.getElementById('carModal');
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide();
        this.loadDataCar();
        this.carForm.reset();
      } catch (error) {
        this.submissionMessage = 'Error during car submission. Please try again.';
        this._ToastsService.showToast("error", this.submissionMessage);
      } finally {
        this.loading = false;
      }
    } else {
      this.submissionMessage = 'Please fill out all required fields.';
      this._ToastsService.showToast("error", this.submissionMessage);
    }
  }

  // تحميل بيانات السيارة للتعديل
  async loadCarData(carId: number) {
    this.carIdToEdit = carId;
    this.GetData();
     try {
      const car = await this.supabaseService.getCar(carId);
      this.editImage = car.images;
      this.carForm.setValue({
        name: car.name,
        price_day: car.price_day,
        price_week: car.price_week,
        price_month: car.price_month,
        color: car.color,
        brand: car.brand,
        body: car.body,
        chair_num: car.chair_num,
        door_num: car.door_num,
        images: car.images,
      });
      this.carIdToEdit = carId;
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  }

  async onEditSubmit() {
    this.loading = true;
    if (this.carForm.valid) {

      const updatedCar = this.carForm.value;
      if (this.carIdToEdit !== null && this.carIdToEdit !== undefined) {
        try {
          await this.supabaseService.updateCar(this.carIdToEdit, updatedCar);
          this.submissionMessage = 'Car updated successfully';
          this._ToastsService.showToast("success", this.submissionMessage);
          const modalElement = document.getElementById('carModalEdit');
          if (modalElement) {
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            modalInstance.hide();
          }
          this.loading = false;

          await this.loadDataCar();
        } catch (error) {
          // عرض رسالة خطأ
          this.submissionMessage = 'Error updating car';
          this._ToastsService.showToast("error", this.submissionMessage);
        }
      } else {
        // عرض رسالة خطأ إذا كان معرف السيارة مفقودًا
        this.submissionMessage = 'Car ID is missing';
        this._ToastsService.showToast("error", this.submissionMessage);
      }
    }
  }

  // تحميل بيانات السيارات
  async loadDataCar() {
    this.carData = await this.supabaseService.getTableData({ name: this.textSearch });
    this.loading = false;
  }

  // تحميل بيانات الهياكل
  async loadDataBody() {
    this.bodyData = await this._BodyService.getTableData();
  }

  // تحميل بيانات العلامات التجارية
  async loadDatabrand() {
    this.brandData = await this._BrandService.getTableData();
  }

  // حذف سيارة
  async onDeleteCar(carId: number): Promise<void> {
    try {
      const isConfirmed = await this._ToastsService.confirmDeletion();
      if (isConfirmed) {
        await this.supabaseService.deleteCar(carId);
        this.loadDataCar();
        this.submissionMessage = 'Car deleted successfully';
        this._ToastsService.showToast("success", this.submissionMessage);
      }
    } catch (error) {
      console.error('Error deleting car:', error);
      this.submissionMessage = 'Error deleting car';
      this._ToastsService.showToast("error", this.submissionMessage);
    }
  }

  // تحميل البيانات عند بدء التشغيل
  ngOnInit(): void {
    this.loadDataCar();

  }

  // تحميل البيانات الإضافية
  GetData() {
    this.loadDatabrand();
    this.loadDataBody();
  }
}