import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase';
import { ApiResponse, User } from '../../types';

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, signature } = await request.json();

    if (!walletAddress) {
      return NextResponse.json(
        { success: false, error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    let user: User;

    if (existingUser) {
      user = {
        id: existingUser.id,
        walletAddress: existingUser.wallet_address,
        email: existingUser.email,
        createdAt: new Date(existingUser.created_at)
      };
    } else {
      
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([{ 
          wallet_address: walletAddress 
        }])
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      user = {
        id: newUser.id,
        walletAddress: newUser.wallet_address,
        email: newUser.email,
        createdAt: new Date(newUser.created_at)
      };
    }

    return NextResponse.json({
      success: true,
      data: { user }
    } as ApiResponse<{ user: User }>);

  } catch (error: any) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');

    if (!walletAddress) {
      return NextResponse.json(
        { success: false, error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    const userData: User = {
      id: user.id,
      walletAddress: user.wallet_address,
      email: user.email,
      createdAt: new Date(user.created_at)
    };

    return NextResponse.json({
      success: true,
      data: { user: userData }
    } as ApiResponse<{ user: User }>);

  } catch (error: any) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch user' },
      { status: 500 }
    );
  }
}