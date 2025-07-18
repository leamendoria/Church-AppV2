import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Supabase configuration missing' },
        { status: 500 }
      );
    }

    const devotionData = await request.json();

    // Check if a devotion already exists for today
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayFormatted = `${year}-${month}-${day}`;

    const { data: existingDevotion } = await supabase
      .from('daily_devotions')
      .select('id')
      .eq('published_date', todayFormatted)
      .single();

    let result;
    if (existingDevotion) {
      // Update existing devotion
      const { data, error } = await supabase
        .from('daily_devotions')
        .update(devotionData)
        .eq('id', existingDevotion.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Insert new devotion
      const { data, error } = await supabase
        .from('daily_devotions')
        .insert([devotionData])
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error saving devotion:', error);
    return NextResponse.json(
      { error: 'Failed to save devotion' },
      { status: 500 }
    );
  }
} 