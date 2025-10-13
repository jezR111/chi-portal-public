// File: scripts/syncNotion.ts
// Version: 5.2.0
// Description: Changed the Notion page update payload to correctly modify a 'Status' 
// property instead of a 'Select' property, fixing the API error.

import * as Notion from '@notionhq/client';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import { NotionToMarkdown } from 'notion-to-md';
import path from 'path';

// --- Explicitly load environment variables from .env ---
const envPath = path.resolve(process.cwd(), '.env');
const result = dotenv.config({ path: envPath });

if (result.error) {
    console.error(`🔴 FATAL ERROR: Could not parse your .env file.`);
    console.error(`   File path: ${envPath}`);
    console.error(`   Details:', result.error`);
    process.exit(1);
}

// --- CONFIGURATION & Validation ---
const {
    NOTION_TOKEN,
    NEXT_PUBLIC_SUPABASE_URL: SUPABASE_URL,
    SUPABASE_SERVICE_KEY,
    NOTION_DATABASE_ID
} = process.env;

// ... (Validation logic remains the same)

const PROCESSED_DIR = path.resolve(process.cwd(), 'src/features/yin/data/lessons/processed');
const IMAGE_BUCKET = 'lesson-assets';
const SYNC_STATUS_PROPERTY = 'Status'; 
const FORCE_SYNC = process.argv.includes('--force');


// --- INITIALIZE CLIENTS ---
const notion = new Notion.Client({ auth: NOTION_TOKEN });
const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_KEY!);
const n2m = new NotionToMarkdown({ notionClient: notion });


// --- HELPER FUNCTIONS ---
async function uploadImageToSupabase(imageUrl: string, pageId: string): Promise<string | null> {
    try {
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const fileExtension = path.extname(new URL(imageUrl).pathname) || '.jpg';
        const fileName = `${pageId}/${Date.now()}${fileExtension}`;
        const { data, error } = await supabase.storage.from(IMAGE_BUCKET).upload(fileName, buffer, { contentType: response.headers.get('content-type') || 'image/jpeg', upsert: true });
        if (error) throw error;
        const { data: { publicUrl } } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(data.path);
        console.log(`  🖼️  Image uploaded: ${publicUrl}`);
        return publicUrl;
    } catch (error) {
        console.error(`  ❌ Error uploading image:`, error);
        return null;
    }
}

async function processBlocks(pageId: string, rawBlocks: any[]): Promise<any[]> {
    const sections = [];
    for (const block of rawBlocks) {
        if (!block.type || !block[block.type]) continue;
        if (block.type === 'image') {
            const tempUrl = block.image.file?.url || block.image.external?.url;
            if (tempUrl) {
                const permanentUrl = await uploadImageToSupabase(tempUrl, pageId);
                if (permanentUrl) {
                    sections.push({ type: 'image', url: permanentUrl, caption: block.image.caption?.[0]?.plain_text || '' });
                }
            }
        } else if (block.type === 'video') {
            sections.push({ type: 'video', url: block.video.external.url, title: 'Embedded Video' });
        } else {
            const mdBlocks = await n2m.blocksToMarkdown([block]);
            const mdStringObject = n2m.toMarkdownString(mdBlocks);
            const markdownContent = Object.values(mdStringObject)[0] || '';
            if (markdownContent.trim()) {
                sections.push({ type: 'text', content: markdownContent });
            }
        }
    }
    return sections;
}


// --- MAIN SYNC FUNCTION ---
async function syncFromDatabase() {
    console.log(`🚀 Starting Notion content sync... ${FORCE_SYNC ? '(FORCE mode enabled)' : ''}`);
    
    const { results: lessonPages } = await notion.databases.query({
        database_id: NOTION_DATABASE_ID!,
    });
    console.log(`Found ${lessonPages.length} lessons in the database.`);

    for (const page of lessonPages) {
        if (!('properties' in page)) continue;

        const pageId = page.id;
        const props = (page as any).properties;

        const title = props['Lesson Title']?.title?.[0]?.plain_text || props.Name?.title?.[0]?.plain_text || 'Untitled Lesson';
        
        const pathName = props.Path?.select?.name?.toLowerCase().replace(/\s+/g, '-') || 'uncategorized';
        const chapterName = props.Chapter?.rich_text?.[0]?.plain_text?.toLowerCase().replace(/\s+/g, '-') || 'untitled-chapter';

        const outputDir = path.join(PROCESSED_DIR, pathName, chapterName);
        await fs.mkdir(outputDir, { recursive: true });
        const outputPath = path.join(outputDir, `${pageId}.json`);

        try {
            console.log(`\n🔄 Checking: ${title} (Path: ${pathName})`);
            const notionEditTime = new Date((page as any).last_edited_time);
            let localSyncTime = new Date(0);

            if (!FORCE_SYNC) {
                 try {
                    const localData = JSON.parse(await fs.readFile(outputPath, 'utf-8'));
                    if (localData.lastSynced) localSyncTime = new Date(localData.lastSynced);
                } catch {
                    console.log('  📄 No local version found. Processing as new lesson.');
                }
            } else {
                console.log('  --force flag detected. Re-syncing regardless of timestamps.');
            }

            if (notionEditTime > localSyncTime) {
                console.log(`  ✨ Notion version is newer. Processing...`);
                
                const { results: blocks } = await notion.blocks.children.list({ block_id: pageId });
                const processedSections = await processBlocks(pageId, blocks);

                const lessonData = {
                    id: pageId, title, path: pathName, chapter: chapterName,
                    order: props.Order?.number || 99,
                    source: 'notion-synced', lastSynced: new Date().toISOString(),
                    sections: processedSections,
                };

                await fs.writeFile(outputPath, JSON.stringify(lessonData, null, 2));
                console.log(`  ✅ Synced and saved to: ${path.relative(process.cwd(), outputPath)}`);

                // --- FIX: Changed 'select' to 'status' ---
                await notion.pages.update({
                    page_id: pageId,
                    properties: { [SYNC_STATUS_PROPERTY]: { status: { name: 'Synced' } } }
                });
                console.log(`  ✍️  Updated Notion status to 'Synced'.`);
            } else {
                console.log('  👍 Local version is up to date. Skipping.');
            }
        } catch (error) {
            console.error(`  ❌ Failed to process page ${pageId}:`, error);
            try {
                // --- FIX: Changed 'select' to 'status' ---
                await notion.pages.update({
                    page_id: pageId,
                    properties: { [SYNC_STATUS_PROPERTY]: { status: { name: 'Error' } } }
                });
                console.log(`  ✍️  Updated Notion status to 'Error'.`);
            } catch (notionError) {
                console.error(`  ❌ Failed to update Notion status after error:`, notionError);
            }
        }
    }
    console.log('\n✨ Content sync complete!');
}

syncFromDatabase();

