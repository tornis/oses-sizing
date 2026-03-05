import { NextRequest, NextResponse } from 'next/server';
import { saveUser, getAllUsers } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json();
    
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }
    
    const user = saveUser(name, email);
    
    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (error) {
    console.error('Error saving user:', error);
    return NextResponse.json(
      { error: 'Failed to save user' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const users = getAllUsers();
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
