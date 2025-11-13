import React from 'react';
import { Tool, ToolCategory, ToolConfig } from './types';
import { createAIToolComponent } from './tools/GenericAITool';
import AIImageGenerator from './tools/AIImageGenerator';
import AIVideoGenerator from './tools/AIVideoGenerator';
import WordCounter from './tools/WordCounter';
import QRCodeGenerator from './tools/QRCodeGenerator';
import Calculator from './tools/Calculator';
import Dashboard from './tools/Dashboard';
import About from './tools/About';
import Service from './tools/Service';
import Contact from './tools/Contact';
import MergePdf from './tools/MergePdf';
import EditPdf from './tools/EditPdf';
import PdfToJpg from './tools/PdfToJpg';
import JpgToPdf from './tools/JpgToPdf';
import PngToPdf from './tools/PngToPdf';
import CompressPdf from './tools/CompressPdf';
import SplitPdf from './tools/SplitPdf';
import PdfToWord from './tools/PdfToWord';
import WordToPdf from './tools/WordToPdf';
import UnlockPdf from './tools/UnlockPdf';
import PdfToExcel from './tools/PdfToExcel';
import PdfToPowerpoint from './tools/PdfToPowerpoint';
import PdfToText from './tools/PdfToText';
import MsOutlookToPdf from './tools/MsOutlookToPdf';
import AddTextToPdf from './tools/AddTextToPdf';
import ImagesToPdf from './tools/ImagesToPdf';
import AddWatermark from './tools/AddWatermark';
import AddNumbersToPdf from './tools/AddNumbersToPdf';
import PowerpointToPdf from './tools/PowerpointToPdf';
import EsignPdf from './tools/EsignPdf';
import PdfWatermarkRemover from './tools/PdfWatermarkRemover';
import ProtectPdf from './tools/ProtectPdf';
import PdfToCsv from './tools/PdfToCsv';
import * as ConverterTools from './tools/ConverterTools';
import * as Icons from '../components/ToolIcons';
import PrivacyPolicy from './tools/PrivacyPolicy';
import TermsAndConditions from './tools/TermsAndConditions';

// Helper function to create a tool definition for the generic AI tool component
const createAIWritingTool = (id: string, name: string, description: string, icon: React.ReactElement, config: ToolConfig): Tool => ({
  id,
  name,
  description,
  category: ToolCategory.AIWritingAids,
  icon,
  component: createAIToolComponent({ ...config, showChatHistory: true }, name), // Pass the name as the title
  config,
});

const AI_WRITING_AIDS_TOOLS: Tool[] = [
  createAIWritingTool('essay-writer', 'Essay Writer', 'Easily create an essay with AI', <Icons.EssayWriterIcon />, {
    systemInstruction: 'You are an expert academic writer. Write a well-structured, insightful, and comprehensive essay on the given topic. Use clear language, proper citations if applicable, and a formal tone.',
    inputLabel: 'Essay Topic',
    fields: [{ id: 'length', label: 'Desired Length (e.g., 5 paragraphs, 1000 words)', type: 'text' }]
  }),
  createAIWritingTool('content-improver', 'Content Improver', 'Improve your content', <Icons.ContentImproverIcon />, {
    systemInstruction: 'You are a professional editor. Rewrite the following text to improve its clarity, engagement, flow, and overall quality. Correct any grammatical errors and enhance the vocabulary.',
    inputLabel: 'Text to Improve',
  }),
  createAIWritingTool('paragraph-writer', 'Paragraph Writer', 'Generate a paragraph on any topic', <Icons.ParagraphWriterIcon />, {
    systemInstruction: 'You are a skilled writer. Write a clear, concise, and well-developed paragraph on the given topic.',
    inputLabel: 'Topic for the paragraph',
  }),
  createAIWritingTool('paragraph-completer', 'Paragraph Completer', 'Finish your thoughts seamlessly', <Icons.ParagraphCompleterIcon />, {
    systemInstruction: 'You are a creative writing assistant. Complete the following sentence or paragraph in a natural and coherent way.',
    inputLabel: 'Start of the paragraph to complete',
  }),
  createAIWritingTool('story-generator', 'Story Generator', 'Generate a story', <Icons.StoryGeneratorIcon />, {
    systemInstruction: 'You are a master storyteller. Write a captivating story based on the provided prompt. Consider plot, character development, and setting.',
    inputLabel: 'Story Prompt or Idea',
    fields: [{ id: 'genre', label: 'Genre (e.g., fantasy, sci-fi, mystery)', type: 'text' }]
  }),
  createAIWritingTool('grammar-fixer', 'Grammar Fixer', 'Easily fix the grammar in a block of text', <Icons.GrammarFixerIcon />, {
    systemInstruction: 'You are a meticulous grammar checker. Correct all spelling, grammar, and punctuation errors in the provided text. Only output the corrected text, with no extra explanations.',
    inputLabel: 'Text to check for grammar',
  }),
  createAIWritingTool('sentence-rewriter', 'Sentence Rewriter', 'Rewrite a sentence for clarity or style', <Icons.SentenceRewriterIcon />, {
    systemInstruction: 'You are an expert wordsmith. Rewrite the following sentence to be more clear, concise, or engaging, based on the user\'s goal.',
    inputLabel: 'Sentence to rewrite',
    fields: [{ id: 'goal', label: 'Goal (e.g., make it simpler, more formal, more persuasive)', type: 'text' }]
  }),
  createAIWritingTool('content-summarizer', 'Content Summarizer', 'Summarize long texts into concise paragraphs', <Icons.ContentSummarizerIcon />, {
    systemInstruction: 'You are an expert summarizer. Provide a concise and accurate summary of the following text, capturing the main points and key information.',
    inputLabel: 'Text to summarize',
  }),
  createAIWritingTool('article-writer', 'Article Writer', 'Create an article from a title', <Icons.ArticleWriterIcon />, {
    systemInstruction: 'You are a professional content writer and SEO expert. Write a comprehensive, engaging, and well-structured article based on the given title or topic. Include headings, subheadings, and a clear introduction and conclusion.',
    inputLabel: 'Article Title or Topic',
  }),
  createAIWritingTool('tone-of-voice', 'Tone of Voice', 'Change your content\'s tone', <Icons.ToneOfVoiceIcon />, {
    systemInstruction: 'You are a writing expert specializing in tone and style. Rewrite the provided text to match the desired tone, while preserving the core message.',
    inputLabel: 'Original Text',
    fields: [{ id: 'tone', label: 'Desired Tone', type: 'text', placeholder: 'e.g., Formal, Casual, Confident, Empathetic', required: true }]
  }),
  createAIWritingTool('youtube-script-writer', 'YouTube Script Writer', 'Generate a YouTube script', <Icons.YoutubeScriptWriterIcon />, {
    systemInstruction: 'You are a creative scriptwriter for YouTube. Write an engaging video script based on the topic provided, including hooks, main content points, and a call-to-action.',
    inputLabel: 'Video Topic',
  }),
  createAIWritingTool('ai-humanizer', 'AI Humanizer', 'Make AI text sound more human', <Icons.AIHumanizerIcon />, {
    systemInstruction: 'You are an expert in writing style. Rewrite the following AI-generated text to sound more natural, engaging, and human-like. Vary sentence structure, use more conversational language, and add a touch of personality.',
    inputLabel: 'AI-generated text to humanize',
  }),
  createAIWritingTool('paragraph-rewriter', 'Paragraph Rewriter', 'Rephrase a paragraph', <Icons.ParagraphRewriterIcon />, {
    systemInstruction: 'You are a skilled writer. Rephrase the following paragraph to be unique, while retaining its original meaning. Improve clarity and flow.',
    inputLabel: 'Paragraph to rephrase',
  }),
  createAIWritingTool('instagram-caption-generator', 'Instagram Caption Generator', 'Generate an Instagram caption for your post', <Icons.InstagramCaptionGeneratorIcon />, {
    systemInstruction: 'You are a social media expert. Write a catchy and engaging Instagram caption for a post about the given topic. Include relevant emojis and hashtags.',
    inputLabel: 'What is your post about?',
  }),
  createAIWritingTool('explain-it', 'Explain it', 'Explain it like I\'m five', <Icons.ExplainItIcon />, {
    systemInstruction: 'You are an expert at simplifying complex topics. Explain the following concept in very simple terms, as if you were explaining it to a five-year-old.',
    inputLabel: 'Concept to explain',
  }),
  createAIWritingTool('article-generator', 'Article Generator', 'AI SEO Optimized Article Generator', <Icons.ArticleGeneratorIcon />, {
    systemInstruction: 'You are a professional content writer and SEO expert. Write a comprehensive, engaging, and well-structured article based on the given title or topic. Include headings, subheadings, and a clear introduction and conclusion.',
    inputLabel: 'Article Title or Topic',
  }),
  createAIWritingTool('content-shortener', 'Content Shortener', 'Resize your content', <Icons.ContentShortenerIcon />, {
    systemInstruction: 'You are an expert at concise writing. Shorten the following text while retaining the key information and main message.',
    inputLabel: 'Text to shorten',
  }),
  createAIWritingTool('translate', 'Translate', 'Easily Translate Text', <Icons.TranslateIcon />, {
    systemInstruction: 'You are a professional translator. Translate the provided text into the specified language accurately.',
    inputLabel: 'Text to Translate',
    fields: [{ id: 'language', label: 'Translate To', type: 'text', placeholder: 'e.g., Spanish, Japanese, French', required: true }]
  }),
  createAIWritingTool('title-rewriter', 'Title Rewriter', 'Rewrite your article title', <Icons.TitleRewriterIcon />, {
    systemInstruction: 'You are a professional copywriter. Generate several alternative, catchy, and SEO-friendly titles for an article based on the original title or topic.',
    inputLabel: 'Original Title or Topic',
  }),
  createAIWritingTool('linkedin-post-generator', 'LinkedIn Post Generator', 'Generate a LinkedIn post for your profile', <Icons.LinkedInPostGeneratorIcon />, {
    systemInstruction: 'You are a LinkedIn marketing expert. Write a professional and engaging LinkedIn post based on the given topic. Use a professional tone and include relevant hashtags.',
    inputLabel: 'Topic for the LinkedIn post',
  }),
  createAIWritingTool('blog-post-generator', 'Blog Post Generator', 'AI SEO Post Generator', <Icons.BlogPostGeneratorIcon />, {
    systemInstruction: 'You are an expert blog writer and SEO specialist. Write a complete, high-quality blog post based on the given topic. Include a catchy title, introduction, headings, and a conclusion.',
    inputLabel: 'Blog Post Topic',
  }),
  createAIWritingTool('business-name-generator', 'Business Name Generator', 'Generate a business name for your idea', <Icons.BusinessNameGeneratorIcon />, {
    systemInstruction: 'You are a branding expert. Generate a list of creative, memorable, and available business names based on the provided business idea or keywords.',
    inputLabel: 'Business idea or keywords',
  }),
  createAIWritingTool('content-paraphraser', 'Content Paraphraser', 'Paraphrasing Content', <Icons.ContentParaphraserIcon />, {
    systemInstruction: 'You are skilled at rephrasing text. Paraphrase the following content to make it unique, while ensuring the original meaning is preserved.',
    inputLabel: 'Content to paraphrase',
  }),
  createAIWritingTool('ai-rephraser', 'AI Rephraser', 'AI Rephraser Content', <Icons.AIRephraserIcon />, {
    systemInstruction: 'You are an expert at rephrasing. Rewrite the following text in a different way, maintaining the original meaning but using different words and sentence structures.',
    inputLabel: 'Content to rephrase',
  }),
  createAIWritingTool('blog-post-ideas', 'Blog Post Ideas', 'Write Blog Post Ideas', <Icons.BlogPostIdeasIcon />, {
    systemInstruction: 'You are a content strategy expert. Generate a list of engaging and relevant blog post ideas based on the given topic or keyword.',
    inputLabel: 'Topic or Keyword',
  }),
  createAIWritingTool('business-plan-generator', 'Business Plan Generator', 'Generate a business plan for you', <Icons.BusinessPlanGeneratorIcon />, {
    systemInstruction: 'You are a business consultant. Create a basic business plan outline for the given business idea, including sections like Executive Summary, Products/Services, Market Analysis, and Marketing Strategy.',
    inputLabel: 'Business Idea',
  }),
  createAIWritingTool('cold-email-write', 'Cold Email Writer', 'Write a cold email for you', <Icons.ColdEmailWriterIcon />, {
    systemInstruction: 'You are a sales and marketing expert. Write a compelling and personalized cold email to the specified recipient for the given purpose.',
    inputLabel: 'Purpose of the email',
    fields: [{ id: 'recipient', label: 'Recipient Profile (e.g., Marketing Manager at a tech startup)', type: 'text' }]
  }),
  createAIWritingTool('article-rewriter', 'Article Rewriter', 'Rewrite an article', <Icons.ArticleRewriterIcon />, {
    systemInstruction: 'You are an expert content creator. Rewrite the following article to be completely unique, passing plagiarism checks, while retaining all the key information and concepts.',
    inputLabel: 'Article to rewrite',
  }),
  createAIWritingTool('meta-description-generator', 'Meta Description Generator', 'Generate a meta description for your article', <Icons.MetaDescriptionGeneratorIcon />, {
    systemInstruction: 'You are an SEO specialist. Write a concise and compelling meta description (under 160 characters) for a webpage with the following content or topic.',
    inputLabel: 'Article content or topic',
  }),
  createAIWritingTool('real-estate-description', 'Real Estate Description', 'Generate Real Estate Descriptions for your listings', <Icons.RealEstateDescriptionIcon />, {
    systemInstruction: 'You are a professional real estate copywriter. Write an attractive and persuasive property listing description based on the provided features.',
    inputLabel: 'Key features of the property (e.g., 3 bed, 2 bath, modern kitchen, large backyard)',
  }),
  createAIWritingTool('ai-detector', 'AI Detector', 'AI Content Detector', <Icons.AIDetectorIcon />, {
    systemInstruction: 'As an AI text analysis model, analyze the following text and provide an assessment of the likelihood that it was written by an AI. Explain your reasoning based on factors like sentence structure, word choice, and common AI patterns.',
    inputLabel: 'Text to analyze',
  }),
  createAIWritingTool('blog-outline-generator', 'Blog Outline Generator', 'Write Blog Outline', <Icons.BlogOutlineGeneratorIcon />, {
    systemInstruction: 'You are a content strategist. Create a detailed outline for a blog post on the given topic, including a title, introduction, main sections with sub-points, and a conclusion.',
    inputLabel: 'Blog Topic',
  }),
  createAIWritingTool('summarize-pdf', 'Summarize PDF', 'Summarize PDF Document', <Icons.SummarizePdfIcon />, {
    systemInstruction: 'You are an expert at summarizing documents. Read the text extracted from the PDF below and provide a clear, concise summary of its content.',
    inputLabel: 'Paste text from PDF to summarize',
  }),
  createAIWritingTool('post-writer', 'Post Writer', 'Generate a blog post', <Icons.PostWriterIcon />, {
    systemInstruction: 'You are an expert blog writer and SEO specialist. Write a complete, high-quality blog post based on the given topic. Include a catchy title, introduction, headings, and a conclusion.',
    inputLabel: 'Topic for the post',
  }),
  createAIWritingTool('content-planner', 'Content Planner', 'Generate a simple content plan', <Icons.ContentPlannerIcon />, {
    systemInstruction: 'You are a content marketing strategist. Create a simple weekly or monthly content plan for a blog or social media channel based on the given topic and goals.',
    inputLabel: 'Topic/Niche',
    fields: [{ id: 'goal', label: 'Goal (e.g., increase engagement, drive traffic)', type: 'text' }]
  }),
  createAIWritingTool('twitter-generator', 'Twitter Generator', 'Twitter generator', <Icons.TwitterGeneratorIcon />, {
    systemInstruction: 'You are a witty social media manager. Generate a tweet (under 280 characters) for the given topic. Include relevant hashtags.',
    inputLabel: 'Topic for the tweet',
  }),
  createAIWritingTool('tiktok-script-writer', 'TikTok Script Writer', 'TikTok Script Writer', <Icons.TiktokScriptWriterIcon />, {
    systemInstruction: 'You are a viral content creator. Write a short, punchy script for a TikTok video on the given topic, including visual cues and trending audio ideas.',
    inputLabel: 'TikTok Video Idea',
  }),
  createAIWritingTool('content-brief-generator', 'Content Brief Generator', 'Generator content brief for your article title', <Icons.ContentBriefGeneratorIcon />, {
    systemInstruction: 'You are a content manager. Create a detailed content brief for a writer based on the given article title. Include target audience, keywords, desired tone, key points to cover, and a suggested structure.',
    inputLabel: 'Article Title',
  }),
  createAIWritingTool('business-slogan-generator', 'Business Slogan Generator', 'Generate business slogan for you', <Icons.BusinessSloganGeneratorIcon />, {
    systemInstruction: 'You are a branding expert. Generate a list of catchy and memorable slogans for a business based on its name and industry.',
    inputLabel: 'Business Name and Industry',
  }),
  createAIWritingTool('instagram-story-ideas', 'Instagram Story Ideas', 'Generate instagram story ideas for you', <Icons.InstagramStoryIdeasIcon />, {
    systemInstruction: 'You are a creative social media manager. Generate a list of interactive and engaging Instagram Story ideas (e.g., polls, quizzes, Q&A) for the given topic or brand.',
    inputLabel: 'Topic or Brand',
  }),
  createAIWritingTool('fb-headline-generator', 'FB Headline Generator', 'Generate facebook ad headlines for your company', <Icons.FBHeadlineGeneratorIcon />, {
    systemInstruction: 'You are a direct response copywriter. Write a list of attention-grabbing headlines for a Facebook ad based on the provided product or service.',
    inputLabel: 'Product/Service and Target Audience',
  }),
  createAIWritingTool('trivia-generator', 'Trivia Generator', 'Generate Trivia Questions', <Icons.TriviaGeneratorIcon />, {
    systemInstruction: 'You are a trivia master. Generate a list of multiple-choice trivia questions and answers on the given topic.',
    inputLabel: 'Topic for trivia questions',
  }),
  createAIWritingTool('press-release-generator', 'Press Release Generator', 'Generate a press a release', <Icons.PressReleaseGeneratorIcon />, {
    systemInstruction: 'You are a public relations professional. Write a professional press release for the given announcement, following standard press release format.',
    inputLabel: 'Announcement (e.g., new product launch, company milestone)',
  }),
  createAIWritingTool('faq-generator', 'FAQ Generator', 'Generate FAQ for a blog', <Icons.FAQGeneratorIcon />, {
    systemInstruction: 'You are a customer support expert. Based on the provided topic, product, or service, generate a list of frequently asked questions (FAQs) with clear and concise answers.',
    inputLabel: 'Topic, Product, or Service',
  }),
  createAIWritingTool('podcast-script-writer', 'Podcast Script Writer', 'Podcast Script Generator', <Icons.PodcastScriptWriterIcon />, {
    systemInstruction: 'You are a podcast producer. Write an engaging script for a podcast episode on the given topic, including an intro, segments, and an outro.',
    inputLabel: 'Podcast Episode Topic',
  }),
  createAIWritingTool('blog-post-rewriter', 'Blog Post Rewriter', 'Rephrase a blog post', <Icons.BlogPostRewriterIcon />, {
    systemInstruction: 'You are an expert content creator. Rewrite the following blog post to be completely unique, passing plagiarism checks, while retaining all the key information and concepts.',
    inputLabel: 'Blog post to rewrite',
  }),
  createAIWritingTool('poll-generator', 'Poll Generator', 'AI Generated Polls', <Icons.PollGeneratorIcon />, {
    systemInstruction: 'You are a social media manager specializing in engagement. Create an interesting poll with multiple choice options for the given topic.',
    inputLabel: 'Topic for the poll',
  }),
  createAIWritingTool('landing-page-copy-generator', 'Landing Page Copy Generator', 'AI Generated Landing Page Copy', <Icons.LandingPageCopyGeneratorIcon />, {
    systemInstruction: 'You are a conversion-focused copywriter. Write compelling copy for a landing page for the given product or service, including a headline, sub-headline, key benefits, and a call-to-action.',
    inputLabel: 'Product or Service',
  }),
  createAIWritingTool('bill-of-sale', 'Bill of Sale', 'Generate bill of sale for your', <Icons.BillOfSaleIcon />, {
    systemInstruction: 'You are a legal document assistant. Generate a simple bill of sale based on the provided information. IMPORTANT: Add a clear disclaimer that this is not legal advice and should be reviewed by a lawyer.',
    inputLabel: 'Seller, Buyer, Item, and Price',
  }),
  createAIWritingTool('purchase-agreement', 'Purchase Agreement', 'Generate purchase agreement for your', <Icons.PurchaseAgreementIcon />, {
    systemInstruction: 'You are a legal document assistant. Generate a simple purchase agreement based on the provided information. IMPORTANT: Add a clear disclaimer that this is not legal advice and should be reviewed by a lawyer.',
    inputLabel: 'Seller, Buyer, Goods/Services, and Terms',
  }),
  createAIWritingTool('nda-generator', 'NDA Generator', 'Generate NDA for your', <Icons.NDAGeneratorIcon />, {
    systemInstruction: 'You are a legal document assistant. Generate a simple Non-Disclosure Agreement (NDA) based on the provided parties and confidential information. IMPORTANT: Add a clear disclaimer that this is not legal advice and should be reviewed by a lawyer.',
    inputLabel: 'Disclosing Party, Receiving Party, and Purpose',
  }),
  createAIWritingTool('privacy-policy-generator', 'Privacy Policy Generator', 'Generate privacy policy for your', <Icons.PrivacyPolicyGeneratorIcon />, {
    systemInstruction: 'You are a legal compliance assistant. Generate a basic privacy policy for a website or app, including common clauses like data collection, usage, and user rights. IMPORTANT: Add a clear disclaimer that this is not legal advice and should be reviewed by a lawyer.',
    inputLabel: 'Company/Website Name and types of data collected (e.g., names, emails, cookies)',
  }),
  createAIWritingTool('summarize-youtube', 'Summarize YouTube', 'Summarize YouTube Video', <Icons.SummarizeYoutubeIcon />, {
    systemInstruction: 'You are an expert at summarizing video content. Read the YouTube video transcript below and provide a concise summary, highlighting the key points and takeaways.',
    inputLabel: 'Paste YouTube video transcript here',
  }),
];

const DOCUMENT_EDITING_TOOLS: Tool[] = [
  { id: 'merge-pdf', name: 'Merge PDF', description: 'Merge 2 or more PDF files into a single PDF file', category: ToolCategory.DocumentEditing, icon: <Icons.MergePdfIcon />, component: MergePdf },
  { id: 'edit-pdf', name: 'Edit PDF', description: 'Free PDF Editor', category: ToolCategory.DocumentEditing, icon: <Icons.EditPdfIcon />, component: EditPdf },
  { id: 'compress-pdf', name: 'Compress PDF', description: 'Lessen the file size of a PDF file', category: ToolCategory.DocumentEditing, icon: <Icons.CompressPdfIcon />, component: CompressPdf },
  { id: 'split-pdf', name: 'Split PDF', description: 'Split into one or multiple PDF files', category: ToolCategory.DocumentEditing, icon: <Icons.SplitPdfIcon />, component: SplitPdf },
  { id: 'unlock-pdf', name: 'Unlock PDF', description: 'Remove the password from a PDF file(requires the password)', category: ToolCategory.DocumentEditing, icon: <Icons.UnlockPdfIcon />, component: UnlockPdf },
  { id: 'esign-pdf', name: 'eSign PDF', description: 'E-sign a PDF with a font or with your signature', category: ToolCategory.DocumentEditing, icon: <Icons.EsignPdfIcon />, component: EsignPdf },
  { id: 'pdf-watermark-remover', name: 'PDF Watermark Remover', description: 'Remove Watermark from PDF', category: ToolCategory.DocumentEditing, icon: <Icons.PdfWatermarkRemoverIcon />, component: PdfWatermarkRemover },
  { id: 'protect-pdf', name: 'Protect PDF', description: 'Add a password to a PDF file', category: ToolCategory.DocumentEditing, icon: <Icons.ProtectPdfIcon />, component: ProtectPdf },
  { id: 'add-numbers-to-pdf', name: 'Add Numbers to PDF', description: 'Add page numbers to a PDF file', category: ToolCategory.DocumentEditing, icon: <Icons.AddNumbersToPdfIcon />, component: AddNumbersToPdf },
  { id: 'add-watermark', name: 'Add Watermark', description: 'Stamp an image or text over your PDF', category: ToolCategory.DocumentEditing, icon: <Icons.AddWatermarkIcon />, component: AddWatermark },
  { id: 'add-text-to-pdf', name: 'Add Text To PDF', description: 'Add text to your PDF documents', category: ToolCategory.DocumentEditing, icon: <Icons.AddTextToPdfIcon />, component: AddTextToPdf },
];

const DATA_CONVERSION_TOOLS: Tool[] = [
    { id: 'pdf-to-jpg', name: 'PDF to JPG', description: 'Convert PDF to JPG and download each page as an image', category: ToolCategory.DataConversion, icon: <Icons.PdfToJpgIcon />, component: PdfToJpg },
    { id: 'jpg-to-pdf', name: 'JPG to PDF', description: 'Upload images and receive as a PDF', category: ToolCategory.DataConversion, icon: <Icons.JpgToPdfIcon />, component: JpgToPdf },
    { id: 'pdf-to-word', name: 'PDF to Word', description: 'Convert a PDF to Word Document', category: ToolCategory.DataConversion, icon: <Icons.PdfToWordIcon />, component: PdfToWord },
    { id: 'word-to-pdf', name: 'Word to PDF', description: 'Convert a Word Document to PDF', category: ToolCategory.DataConversion, icon: <Icons.WordToPdfIcon />, component: WordToPdf },
    { id: 'pdf-to-excel', name: 'PDF to Excel', description: 'Extract tables from PDF to an Excel-compatible CSV file', category: ToolCategory.DataConversion, icon: <Icons.PdfToExcelIcon />, component: PdfToExcel },
    { id: 'pdf-to-powerpoint', name: 'PDF to Powerpoint', description: 'Upload a PDF and Download as a PowerPoint Presentation', category: ToolCategory.DataConversion, icon: <Icons.PdfToPowerpointIcon />, component: PdfToPowerpoint },
    { id: 'png-to-pdf', name: 'PNG to PDF', description: 'Upload images and receive as a PDF', category: ToolCategory.DataConversion, icon: <Icons.PngToPdfIcon />, component: PngToPdf },
    { id: 'powerpoint-to-pdf', name: 'Powerpoint to PDF', description: 'Upload a Powerpoint presentation an Download as a PDF', category: ToolCategory.DataConversion, icon: <Icons.PowerpointToPdfIcon />, component: PowerpointToPdf },
    { id: 'pdf-to-csv', name: 'PDF to CSV', description: 'Extract tables from PDF to CSV', category: ToolCategory.DataConversion, icon: <Icons.PdfToCsvIcon />, component: PdfToCsv },
    { id: 'images-to-pdf', name: 'Images to PDF', description: 'Convert JPG, PNG to a single PDF', category: ToolCategory.DataConversion, icon: <Icons.ImagesToPdfIcon />, component: ImagesToPdf },
    { id: 'ms-outlook-to-pdf', name: 'MS Outlook to PDF', description: 'Upload a MS Outlook file an Download as a PDF', category: ToolCategory.DataConversion, icon: <Icons.MsOutlookToPdfIcon />, component: MsOutlookToPdf },
    { id: 'pdf-to-text', name: 'PDF to Text', description: 'Convert a PDF to Text', category: ToolCategory.DataConversion, icon: <Icons.PdfToTextIcon />, component: PdfToText },
    { id: 'excel-to-pdf', name: 'Excel to PDF', description: 'Convert Excel to PDF', category: ToolCategory.DataConversion, icon: <Icons.ExcelToPdfIcon />, component: ConverterTools.ExcelToPdf },
    { id: 'csv-to-excel', name: 'CSV to Excel', description: 'Convert CSV to Excel', category: ToolCategory.DataConversion, icon: <Icons.CsvToExcelIcon />, component: ConverterTools.CsvToExcel },
    { id: 'split-excel', name: 'Split Excel', description: 'Split into one or multiple Excel files', category: ToolCategory.DataConversion, icon: <Icons.SplitExcelIcon />, component: ConverterTools.SplitExcel },
    { id: 'xml-to-excel', name: 'XML to Excel', description: 'Convert XML to Excel', category: ToolCategory.DataConversion, icon: <Icons.XmlToExcelIcon />, component: ConverterTools.XmlToExcel },
    { id: 'split-csv', name: 'Split CSV', description: 'Split into one or multiple CSV files', category: ToolCategory.DataConversion, icon: <Icons.SplitCsvIcon />, component: ConverterTools.SplitCsv },
    { id: 'json-to-xml', name: 'JSON to XML', description: 'Convert JSON to XML', category: ToolCategory.DataConversion, icon: <Icons.JsonToXmlIcon />, component: ConverterTools.JsonToXml },
    { id: 'xml-to-csv', name: 'XML to CSV', description: 'Convert XML to CSV', category: ToolCategory.DataConversion, icon: <Icons.XmlToCsvIcon />, component: ConverterTools.XmlToCsv },
    { id: 'excel-to-csv', name: 'Excel to CSV', description: 'Convert Excel to CSV', category: ToolCategory.DataConversion, icon: <Icons.ExcelToCsvIcon />, component: ConverterTools.ExcelToCsv },
    { id: 'csv-to-json', name: 'CSV to JSON', description: 'Convert CSV to JSON', category: ToolCategory.DataConversion, icon: <Icons.CsvToJsonIcon />, component: ConverterTools.CsvToJson },
    { id: 'xml-to-json', name: 'XML to JSON', description: 'Convert XML to JSON', category: ToolCategory.DataConversion, icon: <Icons.XmlToJsonIcon />, component: ConverterTools.XmlToJson },
    { id: 'excel-to-xml', name: 'Excel to XML', description: 'Convert Excel to XML', category: ToolCategory.DataConversion, icon: <Icons.ExcelToXmlIcon />, component: ConverterTools.ExcelToXml },
    { id: 'csv-to-xml', name: 'CSV to XML', description: 'Convert CSV to XML', category: ToolCategory.DataConversion, icon: <Icons.CsvToXmlIcon />, component: ConverterTools.CsvToXml },
];

const CREATIVE_TOOLS: Tool[] = [
  {
    id: 'ai-image-generator',
    name: 'AI Image Generator',
    description: 'Create unique images from text descriptions.',
    category: ToolCategory.CreativeTools,
    icon: <Icons.AIImageGeneratorIcon />,
    component: AIImageGenerator
  },
  {
    id: 'ai-video-generator',
    name: 'AI Video Generator',
    description: 'Create short videos from text prompts.',
    category: ToolCategory.CreativeTools,
    icon: <Icons.AIVideoGeneratorIcon />,
    component: AIVideoGenerator,
  },
];

const UTILITIES_TOOLS: Tool[] = [
  {
    id: 'word-counter',
    name: 'Word Counter',
    description: 'Count words, characters, and sentences.',
    category: ToolCategory.Utilities,
    icon: <Icons.WordCounterIcon />,
    component: WordCounter
  },
  {
    id: 'qr-code-generator',
    name: 'QR Code Generator',
    description: 'Create QR codes for URLs, text, and more.',
    category: ToolCategory.Utilities,
    icon: <Icons.QRCodeGeneratorIcon />,
    component: QRCodeGenerator
  },
  {
    id: 'calculator',
    name: 'Calculator',
    description: 'Perform basic and scientific calculations.',
    category: ToolCategory.Utilities,
    icon: <Icons.CalculatorIcon />,
    component: Calculator
  },
];


export const TOOLS: Tool[] = [
  ...AI_WRITING_AIDS_TOOLS,
  ...DOCUMENT_EDITING_TOOLS,
  ...DATA_CONVERSION_TOOLS,
  ...CREATIVE_TOOLS,
  ...UTILITIES_TOOLS,
];

export const ALL_TOOLS_MAP: { [key: string]: Tool } = {
  'dashboard': {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Welcome to Workify',
    category: ToolCategory.Utilities, // This doesn't appear in lists, but needs a valid category
    icon: <div />,
    component: Dashboard
  },
  'about': {
    id: 'about',
    name: 'About Us',
    description: 'Learn more about the Workify team and mission.',
    category: ToolCategory.Utilities,
    icon: <div />,
    component: About
  },
  'service': {
    id: 'service',
    name: 'Our Services',
    description: 'Explore the wide range of tools and services offered by Workify.',
    category: ToolCategory.Utilities,
    icon: <div />,
    component: Service
  },
  'contact': {
    id: 'contact',
    name: 'Contact Us',
    description: 'Get in touch with the Workify team.',
    category: ToolCategory.Utilities,
    icon: <div />,
    component: Contact
  },
  'privacy-policy': {
    id: 'privacy-policy',
    name: 'Privacy Policy',
    description: 'Our privacy policy.',
    category: ToolCategory.Utilities,
    icon: <div />,
    component: PrivacyPolicy
  },
  'terms-and-conditions': {
    id: 'terms-and-conditions',
    name: 'Terms & Conditions',
    description: 'Our terms and conditions.',
    category: ToolCategory.Utilities,
    icon: <div />,
    component: TermsAndConditions
  },
  ...TOOLS.reduce((acc, tool) => {
    acc[tool.id] = tool;
    return acc;
  }, {} as { [key: string]: Tool })
};

export const categoryConfig: Record<ToolCategory, {
    color: string;
    // FIX: Specified that the icon element can accept a className prop to resolve type errors with React.cloneElement.
    icon: React.ReactElement<{ className?: string }>;
    subtitle: string;
    featuredToolId: string;
}> = {
    [ToolCategory.AIWritingAids]: {
        color: 'bg-blue-500',
        icon: <Icons.CategoryAIWriteIcon />,
        subtitle: 'Enhance your writing with AI',
        featuredToolId: 'paragraph-writer',
    },
    [ToolCategory.DocumentEditing]: {
        color: 'bg-indigo-500',
        icon: <Icons.CategoryPDFToolsIcon />,
        subtitle: 'Modify and manage your documents',
        featuredToolId: 'edit-pdf',
    },
    [ToolCategory.DataConversion]: {
        color: 'bg-green-500',
        icon: <Icons.CategoryConverterToolsIcon />,
        subtitle: 'Convert between various file formats',
        featuredToolId: 'pdf-to-word',
    },
    [ToolCategory.CreativeTools]: {
        color: 'bg-rose-500',
        icon: <Icons.CategoryImageToolsIcon />,
        subtitle: 'Generate images and videos with AI',
        featuredToolId: 'ai-image-generator',
    },
    [ToolCategory.Utilities]: {
        color: 'bg-teal-500',
        icon: <Icons.CategoryFileToolsIcon />,
        subtitle: 'Handy tools for daily tasks',
        featuredToolId: 'word-counter',
    },
};