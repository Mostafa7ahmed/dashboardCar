import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  // رفع صورة إلى Supabase Storage
  async uploadImage(file: File): Promise<string> {
    try {
      const filePath = `Brands/${new Date().getTime()}_${file.name}`;
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

  async deleteImage(imageUrl: string): Promise<void> {
    try {
      const fileName = imageUrl.split('/products/').pop();
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
  async addBarnd(newBarnd: any): Promise<void> {
    try {
      let imageUrl: string | null = null;
      if (newBarnd.image) {
        imageUrl = await this.uploadImage(newBarnd.image);
      }

      const BarndDataWithImage = { ...newBarnd, image: imageUrl };

      const { data, error } = await this.supabase
        .from('Brand')
        .insert(BarndDataWithImage);

      if (error) {
        throw error;
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      throw err;
    }
  }

  // جلب بيانات السيارات مع التصفية
  async getTableData(filter?: { name?: string}): Promise<any[]> {
    try {
      let query = this.supabase.from('Brand').select('*');
      if (filter) {
        if (filter.name) {
          query = query.eq('name', filter.name);
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
  async deleteBarnd(BarndId: number): Promise<void> {
    try {
      const { data: existingBarnd, error: fetchError } = await this.supabase
        .from('Brand')
        .select('*')
        .eq('id', BarndId)
        .single();
  
        await this.deleteImage(existingBarnd.image);

  
      // حذف السيارة من الجدول
      const { error } = await this.supabase
        .from('Brand')
        .delete()
        .eq('id', BarndId);

    } catch (err) {
      console.error('Unexpected error:', err);
      throw err;
    }
  }
  async updateBarnd(BarndId: number, updatedBarnd: any): Promise<void> {
    try {
      // جلب بيانات السيارة الحالية
      const { data: existingBarnd, error: fetchError } = await this.supabase
        .from('Brand')
        .select('*')
        .eq('id', BarndId)
        .single();
  
      if (fetchError) {
        throw fetchError;
      }
  
      let imageUrl: string | null = null;
  
      // إذا كانت هناك صورة جديدة
      if (updatedBarnd.image && updatedBarnd.image instanceof File) {
        // إذا كانت السيارة تحتوي على صورة قديمة، قم بحذفها
        if (existingBarnd.image) {
          await this.deleteImage(existingBarnd.image);
        }
  
        // رفع الصورة الجديدة
        imageUrl = await this.uploadImage(updatedBarnd.image);
      }
  
      // تحديث بيانات السيارة
      const BarndDataToUpdate = {
        ...updatedBarnd,
        ...(imageUrl ? { image: imageUrl } : {}),
      };
  
      const { data, error } = await this.supabase
        .from('Brand')
        .update(BarndDataToUpdate)
        .eq('id', BarndId);
  
      if (error) {
        throw error;
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      throw err;
    }
  }
  
  async getBarnd(BarndId: number): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('Brand')
        .select('*')
        .eq('id', BarndId)
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
