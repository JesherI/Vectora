import { NextRequest, NextResponse } from 'next/server';

interface CustomAsset {
  size: number;
  format: 'png' | 'jpg' | 'ico';
  name: string;
}

export async function POST(req: NextRequest) {
  try {
    const { convertSvg } = await import('@/lib/convert');
    const formData = await req.formData();
    const svgFile = formData.get('svg') as File | null;
    const selected: string[] = JSON.parse((formData.get('selected') as string) || '[]');
    const custom: CustomAsset[] = JSON.parse((formData.get('custom') as string) || '[]');
    const baseName = (formData.get('baseName') as string) || 'app-icon';

    if (!svgFile) {
      return NextResponse.json({ error: 'No SVG file provided' }, { status: 400 });
    }

    const svgBuffer = Buffer.from(await svgFile.arrayBuffer());
    const zipData = await convertSvg(svgBuffer, selected, custom, baseName);

    return new NextResponse(zipData as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${baseName}.zip"`,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Convert error:', msg, err);
    return NextResponse.json({ error: 'Conversion failed', detail: msg }, { status: 500 });
  }
}