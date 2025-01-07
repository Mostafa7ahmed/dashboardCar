import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BodyService {

  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }
  // رفع صورة إلى Supabase Storage
  async uploadImage(file: File): Promise<string> {
    try {
      const filePath = `Body/${new Date().getTime()}_${file.name}`;
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
  async addBody(newBody: any): Promise<void> {
    try {
      let imageUrl: string | null = null;
      if (newBody.image) {
        imageUrl = await this.uploadImage(newBody.image);
      }

      const BodyDataWithImage = { ...newBody, image: imageUrl };

      const { data, error } = await this.supabase
        .from('Body')
        .insert(BodyDataWithImage);

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
      let query = this.supabase.from('Body').select('*');
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
  async deleteBody(BodyId: number): Promise<void> {
    try {
      // جلب بيانات السيارة الحالية
      const { data: existingBody, error: fetchError } = await this.supabase
        .from('Body')
        .select('*')
        .eq('id', BodyId)
        .single();
  
        await this.deleteImage(existingBody.image);

  
      // حذف السيارة من الجدول
      const { error } = await this.supabase
        .from('Body')
        .delete()
        .eq('id', BodyId);

    } catch (err) {
      console.error('Unexpected error:', err);
      throw err;
    }
  }
  async updateBody(BodyId: number, updatedBody: any): Promise<void> {
    try {
      // جلب بيانات السيارة الحالية
      const { data: existingBody, error: fetchError } = await this.supabase
        .from('Body')
        .select('*')
        .eq('id', BodyId)
        .single();
  
      if (fetchError) {
        throw fetchError;
      }
  
      let imageUrl: string | null = null;
  
      // إذا كانت هناك صورة جديدة
      if (updatedBody.image && updatedBody.image instanceof File) {
        // إذا كانت السيارة تحتوي على صورة قديمة، قم بحذفها
        if (existingBody.image) {
          await this.deleteImage(existingBody.image);
        }
  
        // رفع الصورة الجديدة
        imageUrl = await this.uploadImage(updatedBody.image);
      }
  
      // تحديث بيانات السيارة
      const BodyDataToUpdate = {
        ...updatedBody,
        ...(imageUrl ? { image: imageUrl } : {}),
      };
  
      const { data, error } = await this.supabase
        .from('Body')
        .update(BodyDataToUpdate)
        .eq('id', BodyId);
  
      if (error) {
        throw error;
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      throw err;
    }
  }
  
  async getBody(BodyId: number): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('Body')
        .select('*')
        .eq('id', BodyId)
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
