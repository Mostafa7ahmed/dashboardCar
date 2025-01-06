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

  async addBody(newCar: any): Promise<void> {
    try {
      const { data, error } = await this.supabase.from('Body').insert(newCar);
      
      if (error) {
        console.error('Error adding car:', error);
        throw error;
      }

      console.log('Car added successfully:', data);
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  }
  async getBody(): Promise<any[]> {
    try {
      const { data, error } = await this.supabase.from('Body').select('*');
      if (error) throw new Error(error.message);
      console.log('Records fetched successfully:', data);
      return data || [];
    } catch (err) {
      console.error('Error fetching records:', err);
      return [];
    }
  }

  async updateBody(id: number, updatedData: any): Promise<void> {
    try {
      const { data, error } = await this.supabase.from('Body').update(updatedData).eq('id', id);
      if (error) throw new Error(error.message);
      console.log('Record updated successfully:', data);
    } catch (err) {
      console.error('Error updating record:', err);
    }
  }

  async deleteBody(id: number): Promise<void> {
    try {
      const { data, error } = await this.supabase.from('Body').delete().eq('id', id);
      if (error) throw new Error(error.message);
      console.log('Record deleted successfully:', data);
    } catch (err) {
      console.error('Error deleting record:', err);
    }
  }


}
