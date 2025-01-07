import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CarService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  // رفع صورة إلى Supabase Storage
  async uploadImage(file: File): Promise<string> {
    try {
      const filePath = `${new Date().getTime()}_${file.name}`;
      const { data, error } = await this.supabase.storage
        .from('products')
        .upload(filePath, file, {
          contentType: file.type,
        });

      if (error) {
        console.error('Error uploading image:', error);
        throw error;
      }

      const { data: publicUrlData } = this.supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      if (publicUrlData) {
        return publicUrlData.publicUrl;
      } else {
        throw new Error('Failed to get public URL');
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      throw err;
    }
  }

  // حذف صورة من Supabase Storage
  async deleteImage(imageUrl: string): Promise<void> {
    try {
      const fileName = imageUrl.split('/').pop();
      if (!fileName) {
        throw new Error('Invalid image URL');
      }

      const { error } = await this.supabase.storage
        .from('products')
        .remove([fileName]);

      if (error) {
        console.error('Error deleting image:', error);
        throw error;
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      throw err;
    }
  }

  // إضافة سيارة جديدة
  async addCar(newCar: any): Promise<void> {
    try {
      let imageUrl: string | null = null;
      if (newCar.images) {
        imageUrl = await this.uploadImage(newCar.images);
      }

      const carDataWithImage = { ...newCar, images: imageUrl };

      const { data, error } = await this.supabase
        .from('Car')
        .insert(carDataWithImage);

      if (error) {
        throw error;
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      throw err;
    }
  }

  // جلب بيانات السيارات مع التصفية
  async getTableData(filter?: { name?: string; price_day?: number }): Promise<any[]> {
    try {
      let query = this.supabase.from('Car').select('*');
      if (filter) {
        if (filter.name) {
          query = query.eq('name', filter.name);
        }
        if (filter.price_day) {
          query = query.eq('price_day', filter.price_day);
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching data:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Unexpected error:', err);
      return [];
    }
  }

  // حذف سيارة بواسطة الـ ID
  async deleteCar(carId: number): Promise<void> {
    try {
      // جلب بيانات السيارة الحالية
      const { data: existingCar, error: fetchError } = await this.supabase
        .from('Car')
        .select('*')
        .eq('id', carId)
        .single();
  
        await this.deleteImage(existingCar.images);

  
      // حذف السيارة من الجدول
      const { error } = await this.supabase
        .from('Car')
        .delete()
        .eq('id', carId);

    } catch (err) {
      console.error('Unexpected error:', err);
      throw err;
    }
  }
  async updateCar(carId: number, updatedCar: any): Promise<void> {
    try {
      // جلب بيانات السيارة الحالية
      const { data: existingCar, error: fetchError } = await this.supabase
        .from('Car')
        .select('*')
        .eq('id', carId)
        .single();
  
      if (fetchError) {
        throw fetchError;
      }
  
      let imageUrl: string | null = null;
  
      // إذا كانت هناك صورة جديدة
      if (updatedCar.images && updatedCar.images instanceof File) {
        // إذا كانت السيارة تحتوي على صورة قديمة، قم بحذفها
        if (existingCar.images) {
          await this.deleteImage(existingCar.images);
        }
  
        // رفع الصورة الجديدة
        imageUrl = await this.uploadImage(updatedCar.images);
      }
  
      // تحديث بيانات السيارة
      const carDataToUpdate = {
        ...updatedCar,
        ...(imageUrl ? { images: imageUrl } : {}),
      };
  
      const { data, error } = await this.supabase
        .from('Car')
        .update(carDataToUpdate)
        .eq('id', carId);
  
      if (error) {
        throw error;
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      throw err;
    }
  }
  
  async getCar(carId: number): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('Car')
        .select('*')
        .eq('id', carId)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (err) {
      console.error('Unexpected error:', err);
      throw err;
    }
  }
}