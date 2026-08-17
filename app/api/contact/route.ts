import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import * as nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    console.log('Contact form submission:', { name: data.name, email: data.email });
    
    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 });
    }
    
    // Save to database
    const contact = await prisma.contact.create({
      data: {
        name: data.name,
        email: data.email,
        message: data.message,
      },
    });
    
    console.log('Contact saved to database:', contact.id);
    
    // Send email notification
    try {
      // Check if email credentials are configured
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        console.error('Email credentials not configured');
        return NextResponse.json({ 
          success: true, 
          data: contact,
          warning: 'Message saved but email notification not sent (credentials not configured)'
        });
      }

      console.log('Attempting to send email from:', process.env.EMAIL_USER);
      console.log('Sending to:', process.env.EMAIL_TO);

      const emailPassword = process.env.EMAIL_PASSWORD?.replace(/\s+/g, '');

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER?.trim(),
          pass: emailPassword,
        },
      });

      // Verify transporter configuration
      await transporter.verify();
      console.log('Email transporter verified successfully');

      const info = await transporter.sendMail({
        from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO || process.env.EMAIL_USER,
        replyTo: data.email,
        subject: `Portfolio Contact: ${data.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #3B82F6;">New Contact Form Submission</h2>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Name:</strong> ${data.name}</p>
              <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
              <p><strong>Message:</strong></p>
              <div style="background: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
                ${data.message.replace(/\n/g, '<br>')}
              </div>
            </div>
            <p style="color: #666; font-size: 12px;">
              This message was sent from your portfolio contact form.
            </p>
          </div>
        `,
        text: `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}

Message:
${data.message}
        `,
      });

      console.log('Email sent successfully:', info.messageId);
      
      return NextResponse.json({ 
        success: true, 
        data: contact,
        emailSent: true 
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      
      // Return success since data is saved, but indicate email failed
      return NextResponse.json({ 
        success: true, 
        data: contact,
        warning: 'Message saved but email notification failed',
        emailError: emailError instanceof Error ? emailError.message : 'Unknown error'
      });
    }
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ 
      error: 'Failed to send message',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
