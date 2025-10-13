// src/app/api/notion/[pageId]/route.ts
// Version: 1.3.0 - Robust Notion API integration with detailed logging and error handling

import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';
import { NotionToMarkdown } from 'notion-to-md';

export async function GET(
  request: Request,
  { params }: { params: { pageId: string } }
) {
  const { pageId } = params;
  console.log('🟦 API Route received pageId:', pageId);

  // IMPORTANT: Check for the environment variable
  const token = process.env.NOTION_TOKEN;
  if (!token) {
    console.error('❌ FATAL: NOTION_TOKEN is not set in the .env.local file.');
    return NextResponse.json({ 
      error: 'Server configuration error.', 
      details: 'The Notion API token is not configured on the server.' 
    }, { status: 500 });
  }
   console.log('🔑 Notion token found.');

  if (!pageId) {
    console.error('❌ Bad Request: pageId parameter is missing from URL.');
    return NextResponse.json({ error: 'No page ID was provided.' }, { status: 400 });
  }

  try {
    const notion = new Client({ auth: token });
    const n2m = new NotionToMarkdown({ notionClient: notion });

    const formattedId = pageId.replace(/-/g, '');
    console.log(`📄 Fetching page with formatted ID: ${formattedId}`);

    const page = await notion.pages.retrieve({ page_id: formattedId }) as any;
    console.log('✅ Page metadata retrieved.');

    const mdblocks = await n2m.pageToMarkdown(formattedId);
    const mdString = n2m.toMarkdownString(mdblocks);
    console.log('✅ Page content converted to Markdown.');

    const props = page.properties || {};
    const title = props.Name?.title?.[0]?.plain_text ||
                  props.Title?.title?.[0]?.plain_text ||
                  props.title?.title?.[0]?.plain_text ||
                  'Untitled';

    const content = mdString.parent || '';
    const sections = [{ id: 'main', type: 'text', title: 'Lesson Content', content }];

    const result = { id: pageId, title, type: 'topic', duration: 15, xpReward: 5, sections, source: 'notion' };

    console.log(`✅ Success! Returning lesson data for: "${title}"`);
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('❌ UNEXPECTED API ERROR:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from Notion.', details: error.message },
      { status: 500 }
    );
  }
}

