import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  constructor(private supabase: SupabaseService) {}

async signUp(email: string, password: string) {
  return this.supabase.supabase.auth.signUp({
    email,
    password
  });
}

async signIn(email: string, password: string) {
  return this.supabase.supabase.auth.signInWithPassword({
    email,
    password
  });
}

async signOut() {
  return this.supabase.supabase.auth.signOut();
}
}
