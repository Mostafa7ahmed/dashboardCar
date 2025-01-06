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

  async addBrand(newCar: any): Promise<void> {
    try {
      const { data, error } = await this.supabase.from('Brand').insert(newCar);
      
      if (error) {
        console.error('Error adding car:', error);
        throw error;
      }

      console.log('Car added successfully:', data);
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  }

  async getcar(filter?: { name?: string }): Promise<any[]> {
    try {
      // إنشاء استعلام Supabase
      let query = this.supabase.from('Brand').select('*');
        if (filter) {
        if (filter.name) {
          query = query.eq('name', filter.name);
        }
     
      }
  
      const { data, error } = await query;
      console.log('Error fetching data:', data);

      if (error) {
        console.error('Error fetching data:', error);
        return [];
      }
  
      console.log('Fetched data:', data);
      return data || [];
    } catch (err) {
      console.error('Unexpected error:', err);
      return [];
    }
  }

}
