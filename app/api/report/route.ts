import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const supabaseUrl = 'https://afwqgpxstghiuiautokm.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tipo = 'episodio', seasonID, episodeNumber, slug, problemType, description, email } = body;

    // 1. Insertar en Supabase según tipo
    const { error } = await supabase.from('reports').insert([{
      tipo,
      season_id: tipo === 'episodio' ? seasonID : null,
      episode_number: tipo === 'episodio' ? episodeNumber : null,
      slug: tipo === 'pelicula' ? slug : null,
      problem_type: problemType,
      description,
      email,
    }]);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ message: 'Fallo Supabase' }, { status: 500 });
    }

    // 2. Email dinámico
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!,
      },
    });

    const subject = tipo === 'pelicula'
      ? `🎬 Reporte recibido - Película: ${slug}`
      : `🚨 Reporte recibido - T${seasonID}E${episodeNumber}`;

    const html = `
      <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px; border-radius: 8px;">
        <h2 style="color: #cc0000;">${
          tipo === 'pelicula' ? '🎬 Nuevo reporte de PELÍCULA' : '📺 Nuevo reporte de EPISODIO'
        }</h2>

        ${
          tipo === 'pelicula'
            ? `<p><strong>Película:</strong> ${slug}</p>`
            : `<p><strong>Temporada:</strong> ${seasonID}</p><p><strong>Episodio:</strong> ${episodeNumber}</p>`
        }

        <p><strong>Tipo de problema:</strong> <span style="color:#d35400">${problemType}</span></p>
        <p><strong>Descripción:</strong></p>
        <div style="background:#fff;border:1px solid #ddd;padding:10px;border-radius:4px;">
          ${description || '<em>(sin descripción)</em>'}
        </div>
        <p><strong>Correo del usuario:</strong> ${email || '<em>(no proporcionado)</em>'}</p>
        <hr />
        <p style="font-size: 12px; color: #999;">Este correo fue generado automáticamente por el sistema de reportes de tu web de Los Simpsons.</p>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER!,
      to: 'simpsonsresumenes@gmail.com',
      subject,
      html,
    });

    return NextResponse.json({ message: 'Reporte enviado correctamente' });
  } catch (err) {
    console.error('Error general:', err);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}
