import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }
  async addCar(newCar: any): Promise<void> {
    try {
      const { data, error } = await this.supabase.from('Car').insert(newCar);
      
      if (error) {
        console.error('Error adding car:', error);
        throw error;
      }

      console.log('Car added successfully:', data);
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  }

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
