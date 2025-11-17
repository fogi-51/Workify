import React from 'react';

// A base component to pass props like className to SVGs
const Icon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    {props.children}
  </svg>
);

// --- Category Icons ---
export const CategoryPDFToolsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
        <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 4a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
    </Icon>
);
export const CategoryImageToolsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
    </Icon>
);
export const CategoryVideoToolsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.586 3l-2.293 2.293A1 1 0 0011.586 6H11v8h.586a1 1 0 00.707-.293L14.586 11H18V7h-3.414l-1.293-1.293A1 1 0 0012.586 5H12V3h2.586z" />
    </Icon>
);
export const CategoryAIWriteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </Icon>
);
export const CategoryFileToolsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h4M8 7a2 2 0 012-2h4a2 2 0 012 2v8a2 2 0 01-2 2h-4a2 2 0 01-2-2z" fill="none" stroke="currentColor"/>
    </Icon>
);
export const CategoryConverterToolsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <path d="M8 7a1 1 0 011-1h3a1 1 0 110 2H9a1 1 0 01-1-1zM8 13a1 1 0 011-1h3a1 1 0 110 2H9a1 1 0 01-1-1z" opacity=".4"/>
        <path fillRule="evenodd" d="M12 2.586a1 1 0 01.707.293l4.414 4.414a1 1 0 010 1.414l-4.414 4.414a1 1 0 01-1.414 0L8 10.414V14a1 1 0 11-2 0V6a1 1 0 112 0v2.586l3.293-3.293a1 1 0 01.707-.293zM3 4a1 1 0 011-1h4a1 1 0 110 2H4a1 1 0 01-1-1zm1 12a1 1 0 100 2h4a1 1 0 100-2H4z" clipRule="evenodd"/>
    </Icon>
);


// --- PDF Tool Icons ---
export const MergePdfIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v1H5V4zM5 7h10v2a2 2 0 01-2 2H7a2 2 0 01-2-2V7zm2 7a1.5 1.5 0 01.46-1.04l1.54-1.54a1 1 0 111.41 1.41l-.7.7V17h2v-1.59l-.7-.7a1 1 0 111.41-1.41l1.54 1.54A1.5 1.5 0 0115 14h-1v4H6v-4H5z" /></Icon>
);
export const EditPdfIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></Icon>
);
export const PdfToJpgIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm3.414 4.586a1 1 0 011.172 0l2.586 2.586a1 1 0 010 1.172l-2.586 2.586a1 1 0 01-1.172 0L6.828 10.75a1 1 0 010-1.172l2.586-2.586z" /><path fillRule="evenodd" d="M15 3a1 1 0 011 1v.5a.5.5 0 01-1 0V4h-.5a.5.5 0 010-1H15zm-1 2a.5.5 0 01.5.5v1.793l-2-2V5.5a.5.5 0 01.5-.5h1zm-2.5.5a.5.5 0 01.5.5v2.793l-2-2V6a.5.5 0 01.5-.5h1z" opacity=".4" clipRule="evenodd" /></Icon>
);
export const JpgToPdfIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" /><path d="M15 2H9a1 1 0 000 2h6a1 1 0 100-2z" opacity=".4"/></Icon>
);
export const CompressPdfIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 12a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/><path d="M8 8a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm-2.5 4.5a.5.5 0 010-.707l2-2a.5.5 0 01.707 0l2 2a.5.5 0 01-.707.707L9 11.707l-1.146 1.147a.5.5 0 01-.707 0zM12.5 6.5a.5.5 0 01.707 0l2 2a.5.5 0 010 .707l-2 2a.5.5 0 01-.707-.707L13.793 8 12.5 6.854zM7.5 6.5a.5.5 0 00-.707 0l-2 2a.5.5 0 000 .707l2 2a.5.5 0 00.707-.707L6.207 8l1.293-1.293z" /></Icon>
);
export const SplitPdfIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M4 2a1 1 0 00-1 1v4a1 1 0 001 1h12a1 1 0 001-1V3a1 1 0 00-1-1H4zM4 12a1 1 0 00-1 1v4a1 1 0 001 1h12a1 1 0 001-1v-4a1 1 0 00-1-1H4z"/><path d="M10 8.5a.5.5 0 01.5.5v2a.5.5 0 01-1 0v-2a.5.5 0 01.5-.5zM3.134 9.5l1.46-1.02a.5.5 0 01.612.768L4.01 10l1.195.752a.5.5 0 01-.612.768L3.134 10.5h13.732l-1.46 1.02a.5.5 0 11-.612-.768L15.99 10l-1.195-.752a.5.5 0 01.612-.768L16.866 9.5H3.134z" opacity=".5"/></Icon>
);
export const PdfToWordIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm1 4a1 1 0 00-1 1v6a1 1 0 001 1h10a1 1 0 001-1V7a1 1 0 00-1-1H5z" clipRule="evenodd"/><path d="M8 8h1l.5 2.5L10 8h1l-1.5 4h-1L8 8z"/><path d="M13 13.5a2.5 2.5 0 01-5 0V7.414a.5.5 0 01.854-.353l1.292 1.292A.5.5 0 0010.5 8.5H13v5z" opacity=".4"/></Icon>
);
export const WordToPdfIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm1 4a1 1 0 00-1 1v6a1 1 0 001 1h10a1 1 0 001-1V7a1 1 0 00-1-1H5z" clipRule="evenodd"/><path d="M8.5 7.414a.5.5 0 01.854-.353l1.292 1.292A.5.5 0 0011 8.5h2.5v5a2.5 2.5 0 01-5 0V7.414z"/><path d="M12 9l-1-1H8v4h1l.5-2 .5 2h1v-4h-.5z" opacity=".4"/></Icon>
);
export const UnlockPdfIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M11 1a3 3 0 00-3 3v1h5V4a3 3 0 00-2-3z"/><path fillRule="evenodd" d="M4.5 7a1 1 0 011-1h9a1 1 0 011 1v9a1 1 0 01-1 1h-9a1 1 0 01-1-1V7zm1 3a1 1 0 000 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/></Icon>
);
export const PdfToExcelIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zM6 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h4a1 1 0 100-2H7zm-1 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd"/><path d="M14 12.5a.5.5 0 01-.5.5h-2a.5.5 0 010-1h2a.5.5 0 01.5.5zm0-3a.5.5 0 01-.5.5h-2a.5.5 0 010-1h2a.5.5 0 01.5.5z" opacity=".4"/></Icon>
);
export const PdfToPowerpointIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm2 5a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 4a1 1 0 100 2h4a1 1 0 100-2H7z" clipRule="evenodd"/><path d="M12 4a1 1 0 100 2h1a1 1 0 100-2h-1zm-1 1a1 1 0 00-1-1H8a1 1 0 100 2h2a1 1 0 001-1z" opacity=".4"/></Icon>
);
export const PngToPdfIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 4a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z"/><path d="M15 2H9a1 1 0 000 2h6a1 1 0 100-2z" opacity=".4"/></Icon>
);
export const PowerpointToPdfIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm2 5a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 4a1 1 0 100 2h4a1 1 0 100-2H7z" clipRule="evenodd"/><path d="M9 4a1 1 0 100 2h1a1 1 0 100-2H9zm-1 1a1 1 0 00-1-1H5a1 1 0 100 2h2a1 1 0 001-1z" opacity=".4"/></Icon>
);
export const EsignPdfIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm0 6h12v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8zm1-4a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd"/><path d="M9.157 11.257C8.12 11.884 7.5 12.5 7.5 13.5s.62 1.616 1.657 2.243m3.686-4.486c1.037-.627 1.657-1.257 1.657-2.257s-.62-1.616-1.657-2.243" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></Icon>
);
export const PdfWatermarkRemoverIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm4 4a1 1 0 100 2h4a1 1 0 100-2H8zm0 3a1 1 0 100 2h4a1 1 0 100-2H8z" opacity=".4"/><path d="M12.707 7.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 10.586l3.293-3.293a1 1 0 011.414 0z"/></Icon>
);
export const ProtectPdfIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path fillRule="evenodd" d="M8 2a1 1 0 011 1v1h2V3a1 1 0 112 0v1h1a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 112 0v1h2V3a1 1 0 011-1zM4 8h12v8H4V8z" clipRule="evenodd"/><path d="M10 1a3 3 0 00-3 3v1h6V4a3 3 0 00-3-3z"/></Icon>
);
export const PdfToCsvIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm1 4h10v2H5V6zm0 4h10v2H5v-2z"/><path d="M7 14h2v2H7v-2zm4 0h2v2h-2v-2z" opacity=".4"/></Icon>
);
export const AddNumbersToPdfIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm2 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" /><path d="M11 11.5a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v3a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-3zM8 12.5a.5.5 0 01.5-.5h1a.5.5 0 010 1H9v.5h1a.5.5 0 010 1H9v.5h1a.5.5 0 010 1H8.5a.5.5 0 01-.5-.5v-3a.5.5 0 01.5-.5z" opacity=".5"/></Icon>
);
export const AddWatermarkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm4 4a1 1 0 100 2h4a1 1 0 100-2H8z" opacity=".4"/><path fillRule="evenodd" d="M10 8a3 3 0 100 6 3 3 0 000-6zm0 2a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"/></Icon>
);
export const ImagesToPdfIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2H4zm8 12H4l3-6 2 4 2-3 3 5z" /><path d="M15 2a1 1 0 011 1v12a1 1 0 11-2 0V3a1 1 0 011-1z" opacity=".4"/></Icon>
);
export const AddTextToPdfIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zM8 6h4v1H8V6zm-2 4h8v1H6v-1z" opacity=".4"/><path d="M8.5 12.5a.5.5 0 01.5-.5h2a.5.5 0 010 1h-2a.5.5 0 01-.5-.5z"/></Icon>
);
export const MsOutlookToPdfIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm1 2a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm3 3a1 1 0 00-1 1v2a1 1 0 102 0v-2a1 1 0 00-1-1z" clipRule="evenodd"/><path d="M3 13.5a.5.5 0 01.5-.5h3a.5.5 0 010 1h-3a.5.5 0 01-.5-.5z" opacity=".4"/></Icon>
);
export const PdfToTextIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm2 5a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 4a1 1 0 100 2h4a1 1 0 100-2H7z" clipRule="evenodd"/></Icon>
);

// --- File Tool Icons ---
export const WordCounterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zM8 6h4v1H8V6zm-2 4h8v1H6v-1z" opacity=".4"/><path d="M12 14a1 1 0 01-1-1v-1a1 1 0 112 0v1a1 1 0 01-1 1zm-3.293-2.293a1 1 0 010-1.414l1-1a1 1 0 111.414 1.414l-1 1a1 1 0 01-1.414 0z"/></Icon>
);
export const QRCodeGeneratorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M5 5h2v2H5V5zm3 0h2v2H8V5zm5 0h2v2h-2V5zM5 8h2v2H5V8zm5 0h2v2h-2V8zm-2 2H6v2h2v-2zm-2 2H5v2h1v-2zm3 2h2v-2H8v2zm5-2h-2v2h2v-2z" /><path d="M3 3a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V3zm2-1a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1V3a1 1 0 00-1-1H5z" opacity=".4"/></Icon>
);
export const CalculatorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zM7 6a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 3a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 3a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd"/><path d="M13 13a1 1 0 100 2h-1a1 1 0 100-2h1z" opacity=".4"/></Icon>
);

// --- Converter Tool Icons ---
const Arrow: React.FC = () => <path d="M13 10a1 1 0 010-2h4a1 1 0 110 2h-4zm-4 5a1 1 0 010-2h4a1 1 0 110 2H9z" opacity=".5" />;
export const ExcelToPdfIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M3 3h4v4H3V3zm0 6h4v4H3v-4z" opacity=".4"/><Arrow /><path d="M11 3h6a2 2 0 012 2v2h-8V3zM11 9h8v6a2 2 0 002-2v-4h-2V9z"/></Icon>;
export const CsvToExcelIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M3 3h4v2H3V3zm0 4h4v2H3V7zm0 4h4v2H3v-2z" opacity=".4"/><Arrow /><path d="M11 3h6v2h-6V3zm0 4h6v2h-6V7zm0 4h6v2h-6v-2z"/></Icon>;
export const SplitExcelIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M2 5h8v2H2V5zm0 4h8v2H2V9z" opacity=".4"/><path fillRule="evenodd" d="M14 3h4v2h-4V3zm0 6h4v2h-4V9zm0 6h4v2h-4v-2z" clipRule="evenodd"/><path d="M11 10a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1z"/></Icon>;
export const XmlToExcelIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M4.414 3.586a1 1 0 011.414-1.414l3.586 3.586a1 1 0 010 1.414l-3.586 3.586a1 1 0 01-1.414-1.414L7.586 7 4.414 3.854zM2 13h6v2H2v-2z" opacity=".4"/><Arrow /><path d="M11 3h6v2h-6V3zm0 4h6v2h-6V7zm0 4h6v2h-6v-2z"/></Icon>;
export const SplitCsvIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M2 5h8v2H2V5zm0 4h8v2H2V9z" opacity=".4"/><path fillRule="evenodd" d="M14 3h4v2h-4V3zm0 6h4v2h-4V9zm0 6h4v2h-4v-2z" clipRule="evenodd"/><path d="M11 10a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1z"/></Icon>;
export const JsonToXmlIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M4 4a1 1 0 011-1h2a1 1 0 110 2H5a1 1 0 01-1-1zM3 10a1 1 0 011-1h4a1 1 0 110 2H4a1 1 0 01-1-1z" opacity=".4"/><Arrow /><path d="M12.414 3.586L16 7.172l-3.586 3.586-1.414-1.414L13.172 7l-2.172-2.172 1.414-1.414zM11 13h6v2h-6v-2z"/></Icon>;
export const XmlToCsvIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M4.414 3.586a1 1 0 011.414-1.414l3.586 3.586a1 1 0 010 1.414l-3.586 3.586a1 1 0 01-1.414-1.414L7.586 7 4.414 3.854zM2 13h6v2H2v-2z" opacity=".4"/><Arrow /><path d="M11 3h6v2h-6V3zm0 4h6v2h-6V7zm0 4h6v2h-6v-2z"/></Icon>;
export const ExcelToCsvIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M3 3h4v2H3V3zm0 4h4v2H3V7zm0 4h4v2H3v-2z" opacity=".4"/><Arrow /><path d="M11 3h6v2h-6V3zm0 4h6v2h-6V7zm0 4h6v2h-6v-2z"/></Icon>;
export const CsvToJsonIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M3 3h4v2H3V3zm0 4h4v2H3V7zm0 4h4v2H3v-2z" opacity=".4"/><Arrow /><path d="M12 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1zm-1 6a1 1 0 001 1h4a1 1 0 100-2h-4a1 1 0 00-1 1z"/></Icon>;
export const XmlToJsonIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M4.414 3.586a1 1 0 011.414-1.414l3.586 3.586a1 1 0 010 1.414l-3.586 3.586a1 1 0 01-1.414-1.414L7.586 7 4.414 3.854zM2 13h6v2H2v-2z" opacity=".4"/><Arrow /><path d="M12 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1zm-1 6a1 1 0 001 1h4a1 1 0 100-2h-4a1 1 0 00-1 1z"/></Icon>;
export const ExcelToXmlIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M3 3h4v4H3V3zm0 6h4v4H3v-4z" opacity=".4"/><Arrow /><path d="M12.414 3.586L16 7.172l-3.586 3.586-1.414-1.414L13.172 7l-2.172-2.172 1.414-1.414zM11 13h6v2h-6v-2z"/></Icon>;
export const CsvToXmlIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <Icon {...props}><path d="M3 3h4v2H3V3zm0 4h4v2H3V7zm0 4h4v2H3v-2z" opacity=".4"/><Arrow /><path d="M12.414 3.586L16 7.172l-3.586 3.586-1.414-1.414L13.172 7l-2.172-2.172 1.414-1.414zM11 13h6v2h-6v-2z"/></Icon>;

// --- AI, Image, Video Tool Icons ---
export const AIImageGeneratorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/><path d="M10.5 6a.5.5 0 00-1 0V9a.5.5 0 00.5.5h2a.5.5 0 000-1H10V6z" /></Icon>
);
export const AIVideoGeneratorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.586 3l-2.293 2.293A1 1 0 0011.586 6H11v8h.586a1 1 0 00.707-.293L14.586 11H18V7h-3.414l-1.293-1.293A1 1 0 0012.586 5H12V3h2.586z"/><path d="M7 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" /></Icon>
);

// --- AI Write Icons (alphabetical) ---
export const AIDetectorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M9 3a1 1 0 012 0v5.5a2.5 2.5 0 11-5 0 1 1 0 112 0V3z" /><path d="M10 11a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0z" opacity=".4"/><path d="M16.293 11.293a1 1 0 011.414 0l2 2a1 1 0 01-1.414 1.414l-2-2a1 1 0 010-1.414zM11 15a1 1 0 100 2h6a1 1 0 100-2h-6z" /></Icon>
);
export const AIHumanizerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" opacity=".4"/><path d="M10 4.828a1 1 0 01.707.293l.293.293a1 1 0 01-1.414 1.414L10 6.543l.707-.707a1 1 0 011.414 0L13 6.707a1 1 0 11-1.414 1.414l-.707-.707-.146-.147a3 3 0 00-4.243 0L6 7.707a1 1 0 01-1.414-1.414l.293-.293a1 1 0 01.707-.293H6a1 1 0 110-2h4z"/></Icon>
);
export const AIRephraserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M4 2a1 1 0 00-1 1v2a1 1 0 001 1h2a1 1 0 000-2H4V2zm11 0a1 1 0 00-1 1v2a1 1 0 102 0V3a1 1 0 00-1-1zM4 14a1 1 0 00-1 1v2a1 1 0 102 0v-2a1 1 0 00-1-1zm12 0a1 1 0 00-1 1v2a1 1 0 102 0v-2a1 1 0 00-1-1z"/><path d="M6 8a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 4a1 1 0 100 2h4a1 1 0 100-2H7z" opacity=".4"/></Icon>
);
export const ArticleGeneratorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm2 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" opacity=".4"/><path d="M8 3h4v1H8V3z"/></Icon>
);
export const ArticleRewriterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M17.657 16.657L13.414 21l-4.243-4.243a1 1 0 111.414-1.414L12 16.586l1.243-1.243a4 4 0 10-5.657-5.657L6 11.243l-4.243 4.243a1 1 0 11-1.414-1.414L4.586 10 3.343 8.757a4 4 0 115.657-5.657L10.243 4.343l4.243-4.243a1 1 0 111.414 1.414L11.657 6l1.243 1.243a4 4 0 010 5.657z" opacity=".4"/><path d="M10 10a1 1 0 11-2 0 1 1 0 012 0z"/></Icon>
);
export const ArticleWriterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" opacity=".4"/></Icon>
);
export const BillOfSaleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4z" opacity=".4"/><path d="M12 12a2 2 0 100-4 2 2 0 000 4z"/><path d="M10.707 3.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-1-1a1 1 0 111.414-1.414L6 6.586l3.293-3.293a1 1 0 011.414 0z"/></Icon>
);
export const BlogPostGeneratorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 3a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" opacity=".4"/></Icon>
);
export const BlogPostIdeasIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm2 5a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 4a1 1 0 100 2h4a1 1 0 100-2H7z" clipRule="evenodd" opacity=".4"/><path d="M10 2a2.5 2.5 0 00-2.5 2.5V5a.5.5 0 001 0V4.5A1.5 1.5 0 0110 3c.638 0 1.18.397 1.412.956a1.002 1.002 0 011.913.528A2.5 2.5 0 0015.5 2H10z"/></Icon>
);
export const BlogPostRewriterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M4.53 3.97A5.5 5.5 0 0112 6.13v3.72l-1.47-1.47a.5.5 0 10-.71.71L12 11.2l2.17-2.17a.5.5 0 10-.71-.71L12 9.85V6.13a4.5 4.5 0 00-7.03-3.66.5.5 0 10.53.87zM15.47 16.03a5.5 5.5 0 01-7.47-2.16v-3.72l1.47 1.47a.5.5 0 00.71-.71L8 8.8l-2.17 2.17a.5.5 0 00.71.71L8 10.15v3.72a4.5 4.5 0 007.03 3.66.5.5 0 00-.53-.87z" opacity=".4"/></Icon>
);
export const BlogOutlineGeneratorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm2 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm-1 5a1 1 0 100 2h8a1 1 0 100-2H5z" opacity=".4"/><path d="M10 9a1 1 0 100 2h4a1 1 0 100-2h-4z"/></Icon>
);
export const BusinessNameGeneratorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1h-3v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2H5a1 1 0 01-1-1V4zm3 2a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" opacity=".4"/><path d="M9 13h2v3H9v-3z"/></Icon>
);
export const BusinessPlanGeneratorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M6 3a1 1 0 011-1h6a1 1 0 011 1v2a1 1 0 01-1 1H7a1 1 0 01-1-1V3zM4 6h12v11a1 1 0 01-1 1H5a1 1 0 01-1-1V6z" opacity=".4"/><path d="M9 8h2v2H9V8zM8 11h4v2H8v-2zm-1 3h6v2H7v-2z"/></Icon>
);
export const BusinessSloganGeneratorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M10 2a6 6 0 00-6 6c0 1.892 1.864 3.41 3 4.417V18h6v-5.583c1.136-1.007 3-2.525 3-4.417a6 6 0 00-6-6z" opacity=".4"/><path d="M10 13a1 1 0 01-1 1H7a1 1 0 010-2h2a1 1 0 011 1z"/></Icon>
);
export const ColdEmailWriterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4z" opacity=".4"/><path d="M10 9a3 3 0 100-6 3 3 0 000 6zM7 9a3 3 0 100 6h6a3 3 0 100-6H7z"/></Icon>
);
export const ContentBriefGeneratorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm3.414 4.586a1 1 0 011.172 0l2.586 2.586a1 1 0 010 1.172l-2.586 2.586a1 1 0 01-1.172 0L6.828 10.75a1 1 0 010-1.172l2.586-2.586z" opacity=".4"/></Icon>
);
export const ContentImproverIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm2 5a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" opacity=".4"/><path d="M13 11l1.414-1.414a1 1 0 011.414 1.414L14.414 12l1.414 1.414a1 1 0 01-1.414 1.414L13 13.414V16a1 1 0 11-2 0v-2.586l-1.414 1.414a1 1 0 01-1.414-1.414L9.586 12 8.172 10.586a1 1 0 011.414-1.414L11 10.586V8a1 1 0 112 0v3z"/></Icon>
);
export const ContentParaphraserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M2 5a3 3 0 013-3h10a3 3 0 013 3v10a3 3 0 01-3 3H5a3 3 0 01-3-3V5zm3.5.5a.5.5 0 000 1h8a.5.5 0 000-1h-8zm0 3a.5.5 0 000 1h8a.5.5 0 000-1h-8z" opacity=".4"/><path d="M5.5 11.5a.5.5 0 000 1h4a.5.5 0 000-1h-4zm0 3a.5.5 0 000 1h4a.5.5 0 000-1h-4z"/></Icon>
);
export const ContentPlannerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6z" opacity=".4"/><path d="M8 7a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm1 3a1 1 0 10-2 0v2a1 1 0 102 0v-2zm2 0a1 1 0 10-2 0v2a1 1 0 102 0v-2z"/></Icon>
);
export const ContentShortenerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4z" opacity=".4"/><path d="M7 6a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 3a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 3a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm-3-3a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm10 0a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1z"/></Icon>
);
export const ContentSummarizerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4z" opacity=".4"/><path d="M7 6a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 3a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm-2 4h10v1a1 1 0 01-1 1H6a1 1 0 01-1-1v-1z"/></Icon>
);
export const EssayWriterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14A1 1 0 003 18h14a1 1 0 00.894-1.447l-7-14z" opacity=".4"/><path d="M12 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-1-3a1 1 0 10-2 0v1a1 1 0 102 0V8z"/></Icon>
);
export const ExplainItIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0z" opacity=".4"/><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l.135.41a3.001 3.001 0 005.513 1.986l.33-.25a1 1 0 011.23.953l-.226 1.464a3.001 3.001 0 003.11 3.11l1.465-.226a1 1 0 01.952 1.23l-.25.33a3.001 3.001 0 001.986 5.513l.41.135c.921.3 1.22 1.603 0 1.902l-14 4.667a1 1 0 01-1.22-.953l2.26-14.64a1 1 0 01.953-1.23l.25.33a3.001 3.001 0 005.513-1.986l.135-.41z"/></Icon>
);
export const FAQGeneratorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-1 1v1a1 1 0 102 0V8a1 1 0 00-1-1zm-1 4a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V9a1 1 0 10-2 0v1H9z" clipRule="evenodd" opacity=".4"/></Icon>
);
export const FBHeadlineGeneratorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M10 18a8 8 0 100-16 8 8 0 000 16z" opacity=".4"/><path d="M12 8a1 1 0 01-1 1H9a1 1 0 110-2h2a1 1 0 011 1zm-2 2a1 1 0 100 2h2V9h-2v3z"/></Icon>
);
export const GrammarFixerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm2 5a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" opacity=".4"/><path d="M10.707 10.293a1 1 0 010 1.414l-2 2a1 1 0 01-1.414 0l-1-1a1 1 0 111.414-1.414L8 11.586l1.293-1.293a1 1 0 011.414 0z"/></Icon>
);
export const InstagramCaptionGeneratorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M4.5 2A2.5 2.5 0 002 4.5v11A2.5 2.5 0 004.5 18h11a2.5 2.5 0 002.5-2.5v-11A2.5 2.5 0 0015.5 2h-11z" opacity=".4"/><path d="M10 6a4 4 0 100 8 4 4 0 000-8z"/><path d="M13.5 5a1 1 0 100 2 1 1 0 000-2z" opacity=".6"/></Icon>
);
export const InstagramStoryIdeasIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M5.5 2A3.5 3.5 0 002 5.5v9A3.5 3.5 0 005.5 18h9a3.5 3.5 0 003.5-3.5v-9A3.5 3.5 0 0014.5 2h-9z" opacity=".4"/><path d="M7 6a3 3 0 100 6 3 3 0 000-6zM13 10a3 3 0 100-6 3 3 0 000 6z"/></Icon>
);
export const LandingPageCopyGeneratorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h14a1 1 0 001-1V4a1 1 0 00-1-1H3zm2 2h10v3H5V5z" opacity=".4"/><path d="M7 9h6v2H7V9zm-2 4h10v2H5v-2z"/></Icon>
);
export const LinkedInPostGeneratorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M2 5a3 3 0 013-3h10a3 3 0 013 3v10a3 3 0 01-3 3H5a3 3 0 01-3-3V5z" opacity=".4"/><path d="M7 7h2v6H7V7zm6 0h2v3a2 2 0 01-2 2h-1V7h1z"/><path d="M8 5a1 1 0 100-2 1 1 0 000 2z"/></Icon>
);
export const MetaDescriptionGeneratorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm2 5a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 4a1 1 0 100 2h4a1 1 0 100-2H7z" opacity=".4"/><path d="M17 6a3 3 0 01-3 3h-1V3h1a3 3 0 013 3z"/></Icon>
);
export const NDAGeneratorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4z" opacity=".4"/><path d="M11 6a1 1 0 011 1v3h-2V7a1 1 0 011-1zM10 10a1 1 0 00-1 1v3h4v-3a1 1 0 00-1-1h-2z"/><path d="M6 10a1 1 0 011-1h1v5H7a1 1 0 01-1-1v-3z"/></Icon>
);
export const ParagraphCompleterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm2 5a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 4a1 1 0 100 2h2a1 1 0 100-2H7z" opacity=".4"/><path d="M12.5 13a.5.5 0 110-1h2a.5.5 0 110 1h-2zm1-1.5a.5.5 0 00-1 0v.5h-1a.5.5 0 100 1h1v1a.5.5 0 101 0v-2.5z"/></Icon>
);
export const ParagraphRewriterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm2 5a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 4a1 1 0 100 2h4a1 1 0 100-2H7z" opacity=".4"/><path d="M17.34 9.87l-2.47 2.47a.5.5 0 01-.71-.71l1.6-1.6a3 3 0 00-4.24 0 .5.5 0 01-.71-.71 4 4 0 015.66 0l.85.85zM3.51 9.26l.85.85a4 4 0 005.66 0 .5.5 0 00-.71-.71 3 3 0 01-4.24 0l-1.6 1.6a.5.5 0 00.71.71l2.47-2.47z"/></Icon>
);
export const ParagraphWriterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm2 5a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 4a1 1 0 100 2h4a1 1 0 100-2H7z" opacity=".4"/><path d="M14 3a1 1 0 011 1v2a1 1 0 11-2 0V4a1 1 0 011-1zm0 0l-1 1m2-1l-1 1m-1-1l-1-1m2 1l1-1"/></Icon>
);
export const PodcastScriptWriterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" /><path d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" opacity=".4"/><path d="M9 13a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1z"/></Icon>
);
export const PollGeneratorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6z" opacity=".4"/><path d="M9 6a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1zm-1 5a1 1 0 100 2h4a1 1 0 100-2H8zm-1 3a1 1 0 011-1h2a1 1 0 110 2H8a1 1 0 01-1-1z"/></Icon>
);
export const PostWriterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 3a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" opacity=".4"/></Icon>
);
export const PressReleaseGeneratorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm1 10a2 2 0 012-2h10a2 2 0 012 2v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2z" opacity=".4"/><path d="M12 2h2v4h-2V2zm-4 0h2v4H8V2z"/></Icon>
);
export const PrivacyPolicyGeneratorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M10 2a3 3 0 00-3 3v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-3V5a3 3 0 00-3-3zm-1 4v1h4V6h-4z" opacity=".4"/><path d="M10 14a1 1 0 01-1-1v-2a1 1 0 112 0v2a1 1 0 01-1 1z"/></Icon>
);
export const PurchaseAgreementIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4z" opacity=".4"/><path d="M5 8a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"/><path d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 111.414-1.414L10 13.586l3.293-3.293a1 1 0 011.414 0z"/></Icon>
);
export const RealEstateDescriptionIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" opacity=".4"/><path d="M12 11a1 1 0 100-2 1 1 0 000 2z"/></Icon>
);
export const SentenceRewriterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm2 5a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" opacity=".4"/><path d="M13.68 11.23a.5.5 0 00-.68.12l-2.4 4a.5.5 0 00.8.6l2.4-4a.5.5 0 00-.12-.68zM7.5 11a.5.5 0 000 1h2a.5.5 0 000-1h-2z"/></Icon>
);
export const StoryGeneratorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M9 4a3 3 0 012 5.292V18H7v-8.708A3 3 0 019 4zm3-2a3 3 0 00-3 3v1h4V5a3 3 0 00-1-3zm-6 2a3 3 0 00-1 3v1h4V5a3 3 0 00-3-3z" opacity=".4"/><path d="M15 13a1 1 0 11-2 0 1 1 0 012 0zm-5-4a1 1 0 11-2 0 1 1 0 012 0zm-4 4a1 1 0 11-2 0 1 1 0 012 0z"/></Icon>
);
export const SummarizePdfIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4z" opacity=".4"/><path d="M7 6a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 3a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm-2 4h10v1a1 1 0 01-1 1H6a1 1 0 01-1-1v-1z"/></Icon>
);
export const SummarizeYoutubeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M10 1.5a8.5 8.5 0 100 17 8.5 8.5 0 000-17z" opacity=".4"/><path d="M8.5 7.429a.5.5 0 01.78-.42l4 2.5a.5.5 0 010 .84l-4 2.5A.5.5 0 018.5 12.57V7.43z"/></Icon>
);
export const TiktokScriptWriterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M12 4v10a3 3 0 11-3-3h2a1 1 0 100-2h-3a5 5 0 105 5V8a1 1 0 112 0v2a1 1 0 11-2 0V7a3 3 0 00-3-3z" opacity=".4"/><path d="M12 2a1 1 0 100 2 1 1 0 000-2z"/></Icon>
);
export const TitleRewriterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4z" opacity=".4"/><path d="M10.894 6.553a1 1 0 00-1.788 0l-3.5 7A1 1 0 006.5 15h7a1 1 0 00.894-1.447l-3.5-7z"/><path d="M8 4h4v1H8V4z"/></Icon>
);
export const ToneOfVoiceIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M8.5 3.5a1 1 0 00-1 1v11a1 1 0 102 0v-11a1 1 0 00-1-1z" /><path d="M12.5 3.5a1 1 0 00-1 1v11a1 1 0 102 0v-11a1 1 0 00-1-1z" opacity=".4"/><path d="M5.5 6.5a1 1 0 00-1 1v5a1 1 0 102 0v-5a1 1 0 00-1-1zM15.5 6.5a1 1 0 00-1 1v5a1 1 0 102 0v-5a1 1 0 00-1-1z" /></Icon>
);
export const TranslateIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M7 4a1 1 0 011 1v1h2V5a1 1 0 112 0v1h2V5a1 1 0 112 0v3a1 1 0 01-1 1h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0V9H6a1 1 0 01-1-1V5a1 1 0 011-1z" /><path d="M2.5 15a.5.5 0 01.5-.5h4a.5.5 0 010 1h-4a.5.5 0 01-.5-.5zm.5 2a.5.5 0 000 1h2a.5.5 0 000-1h-2zM15.5 15a.5.5 0 01.5-.5h2a.5.5 0 010 1h-2a.5.5 0 01-.5-.5z" opacity=".4"/></Icon>
);
export const TriviaGeneratorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4z" opacity=".4"/><path d="M11 7a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v1a1 1 0 002 0v-1a1 1 0 10-2 0v1a1 1 0 002 0v-1a1 1 0 00-2 0zM10 15a1 1 0 100-2 1 1 0 000 2z"/></Icon>
);
export const TwitterGeneratorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M16 4.212c-1.29.5-2.6.8-4 1-1.39-.5-2.79-1-4.33-1-1.54 0-2.67.5-3.67 1.25C2.8 6.5 2 7.7 2 9.25c0 .5.09 1 .28 1.5.09.5.28.8.5.8s.5-.3.8-.5a5.5 5.5 0 003.8-2.65c-.5.5-1 1.09-1.3 1.78-.4.7-.6 1.4-.6 2.22 0 .9.3 1.6.8 2.3.5.7 1.2 1.1 2.2 1.3-1.09.5-2.18.8-3.37.8a1 1 0 100 2c1.5 0 2.9-.3 4.4-.8 1.5-.5 2.8-1.2 3.8-2.1s1.8-2 2.4-3.3c.6-1.3.9-2.6.9-4 0-.5-.09-1-.28-1.5-.09-.5-.28-.8-.5-.8s-.5.3-.8.5a5.5 5.5 0 00-3.8 2.65c.5-.5 1-1.09 1.3-1.78.4-.7.6-1.4.6-2.22 0-.5-.09-1-.28-1.5z" opacity=".4"/></Icon>
);
export const YoutubeScriptWriterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}><path d="M3.5 4.5A1.5 1.5 0 015 3h10a1.5 1.5 0 011.5 1.5v11a1.5 1.5 0 01-1.5 1.5H5A1.5 1.5 0 013.5 15.5v-11z" opacity=".4"/><path d="M8.5 7.429a.5.5 0 01.78-.42l4 2.5a.5.5 0 010 .84l-4 2.5A.5.5 0 018.5 12.57V7.43z"/></Icon>
);