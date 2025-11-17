import React, { useState } from 'react';
import ToolContainer from '../components/ToolContainer';
import Spinner from '../components/Spinner';

// Declare globals for libraries loaded via script tags
declare const XLSX: any;
declare const html2pdf: any;
declare const JSZip: any;

// --- HELPER FUNCTIONS ---

const downloadBlob = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
};

const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsText(file);
    });
};

// --- GENERIC CONVERTER COMPONENT ---

interface FileConverterProps {
    title: string;
    onConvert: (file: File, options?: any) => Promise<Blob>;
    acceptedFileTypes: string;
    outputExtension: string;
    // FIX: Removed the redundant `setOptions` prop. The `optionsComponent` is now expected
    // to receive all its necessary props, including `setOptions`, when it is created.
    optionsComponent?: React.ReactElement;
}

const FileConverter: React.FC<FileConverterProps> = ({ title, onConvert, acceptedFileTypes, outputExtension, optionsComponent }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isConverting, setIsConverting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        setSuccessMessage(null);
        setFile(e.target.files ? e.target.files[0] : null);
        e.target.value = '';
    };

    const handleConvert = async () => {
        if (!file) return;
        setIsConverting(true);
        setError(null);
        setSuccessMessage(null);
        try {
            const resultBlob = await onConvert(file);
            const outputFileName = `${file.name.split('.').slice(0, -1).join('.')}.${outputExtension}`;
            downloadBlob(resultBlob, outputFileName);
            setSuccessMessage('Conversion successful! Your download has started.');
            setFile(null); // Reset after successful conversion
            setTimeout(() => setSuccessMessage(null), 4000); // Clear message
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred during conversion.');
        } finally {
            setIsConverting(false);
        }
    };

    return (
        <ToolContainer title={title}>
            <div className="flex flex-col items-center space-y-6">
                 {error && (
                    <div className="w-full max-w-lg text-center text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/50 p-3 rounded-md border border-red-200 dark:border-red-800 flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                        <span>{error}</span>
                    </div>
                )}
                {successMessage && (
                     <div className="w-full max-w-lg text-center text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/50 p-3 rounded-md border border-green-200 dark:border-green-800 flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        <span>{successMessage}</span>
                    </div>
                )}

                {(!file && !successMessage) && (
                    <label htmlFor="file-upload" className="w-full max-w-lg mx-auto flex flex-col items-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center cursor-pointer hover:border-primary-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <input type="file" id="file-upload" accept={acceptedFileTypes} onChange={handleFileChange} className="hidden"/>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                        <p className="mt-2 text-primary-600 dark:text-primary-400 font-semibold">Select a file</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">or drag and drop here</p>
                    </label>
                )}
                
                {file && (
                    <div className="w-full max-w-md text-center">
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border dark:border-gray-700 mb-4">
                            <p>Selected file: <span className="font-semibold text-gray-800 dark:text-gray-200">{file.name}</span></p>
                        </div>
                        {/* FIX: Render the options component directly, removing the problematic React.cloneElement call. */}
                        {optionsComponent}
                        <button
                            onClick={handleConvert}
                            disabled={isConverting}
                            className="w-full flex justify-center items-center px-6 py-3 text-lg font-semibold text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:bg-primary-400 disabled:cursor-not-allowed"
                        >
                            {isConverting ? <Spinner /> : `Convert to ${outputExtension.toUpperCase()}`}
                        </button>
                    </div>
                )}
            </div>
        </ToolContainer>
    );
};


// --- CONVERSION LOGIC ---

// Excel to PDF
const convertExcelToPdf = async (file: File): Promise<Blob> => {
    const buffer = await readFileAsArrayBuffer(file);
    const workbook = XLSX.read(buffer, { type: 'array' });
    let finalHtml = `
        <style>
            body { font-family: sans-serif; }
            table { border-collapse: collapse; width: 100%; font-size: 10px; }
            th, td { border: 1px solid #dddddd; text-align: left; padding: 4px; }
            th { background-color: #f2f2f2; }
            h2 { font-size: 14px; margin-top: 20px; }
        </style>
    `;
    workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        const html = XLSX.utils.sheet_to_html(worksheet);
        finalHtml += `<h2>${sheetName}</h2>${html}`;
    });
    const element = document.createElement('div');
    element.innerHTML = finalHtml;
    const pdfBlob = await html2pdf().from(element).set({
        jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' },
        margin: 0.5
    }).output('blob');
    return pdfBlob;
};

// CSV to Excel
const convertCsvToExcel = async (file: File): Promise<Blob> => {
    const text = await readFileAsText(file);
    const workbook = XLSX.read(text, { type: 'string', raw: true });
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    return new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
};

// Split Excel
const splitExcel = async (file: File): Promise<Blob> => {
    const buffer = await readFileAsArrayBuffer(file);
    const workbook = XLSX.read(buffer, { type: 'array' });
    const zip = new JSZip();

    if (workbook.SheetNames.length <= 1) {
        throw new Error("This Excel file only has one sheet. There's nothing to split.");
    }

    workbook.SheetNames.forEach((sheetName: string) => {
        const newWorkbook = XLSX.utils.book_new();
        const worksheet = workbook.Sheets[sheetName];
        XLSX.utils.book_append_sheet(newWorkbook, worksheet, sheetName);
        const excelBuffer = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'array' });
        zip.file(`${sheetName}.xlsx`, excelBuffer);
    });

    return zip.generateAsync({ type: 'blob' });
};

// XML to Excel/CSV Helper
const xmlToArray = (xmlDoc: Document): string[][] => {
    const firstLevelChildren = Array.from(xmlDoc.documentElement.children);
    if (firstLevelChildren.length === 0) return [];
    
    const headers = Array.from(firstLevelChildren[0].children).map(child => child.tagName);
    const rows = firstLevelChildren.map(rowNode => {
        return headers.map(header => rowNode.getElementsByTagName(header)[0]?.textContent || '');
    });
    return [headers, ...rows];
};

// XML to Excel
const convertXmlToExcel = async (file: File): Promise<Blob> => {
    const text = await readFileAsText(file);
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "application/xml");
    const data = xmlToArray(xmlDoc);
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    return new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
};

// Split CSV
const SplitCsvOptions: React.FC<{ setOptions: (opts: { rows: number }) => void }> = ({ setOptions }) => {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Rows per file</label>
            <input 
                type="number" 
                defaultValue={1000}
                min="1"
                onChange={(e) => setOptions({ rows: parseInt(e.target.value, 10) })}
                className="w-full p-2 bg-white dark:bg-gray-600 border rounded"
            />
        </div>
    );
};
const splitCsv = async (file: File, options: { rows: number } = { rows: 1000 }): Promise<Blob> => {
    const text = await readFileAsText(file);
    const lines = text.split(/\r\n|\n/);
    if (lines.length <= options.rows) {
        throw new Error(`The file has fewer than ${options.rows} rows. Nothing to split.`);
    }
    const header = lines[0];
    const dataRows = lines.slice(1);
    const zip = new JSZip();
    let fileCount = 1;
    for (let i = 0; i < dataRows.length; i += options.rows) {
        const chunk = dataRows.slice(i, i + options.rows);
        const csvContent = [header, ...chunk].join('\n');
        zip.file(`part_${fileCount++}.csv`, csvContent);
    }
    return zip.generateAsync({ type: 'blob' });
};

// JSON to XML
const jsonToXml = (json: any): string => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<root>';
    const convert = (obj: any, name: string) => {
        if (Array.isArray(obj)) {
            obj.forEach(item => xml += convert(item, name));
        } else if (typeof obj === 'object' && obj !== null) {
            xml += `<${name}>`;
            Object.keys(obj).forEach(key => xml += convert(obj[key], key));
            xml += `</${name}>`;
        } else {
            xml += `<${name}>${obj}</${name}>`;
        }
        return '';
    };
    Object.keys(json).forEach(key => convert(json[key], key));
    xml += '</root>';
    return xml;
};
const convertJsonToXml = async (file: File): Promise<Blob> => {
    const text = await readFileAsText(file);
    const json = JSON.parse(text);
    const xml = jsonToXml(json);
    return new Blob([xml], { type: 'application/xml' });
};

// XML to CSV
const convertXmlToCsv = async (file: File): Promise<Blob> => {
    const text = await readFileAsText(file);
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "application/xml");
    const data = xmlToArray(xmlDoc);
    const csv = XLSX.utils.sheet_to_csv(XLSX.utils.aoa_to_sheet(data));
    return new Blob([csv], { type: 'text/csv' });
};

// Excel to CSV
const convertExcelToCsv = async (file: File): Promise<Blob> => {
    const buffer = await readFileAsArrayBuffer(file);
    const workbook = XLSX.read(buffer, { type: 'array' });
    if (workbook.SheetNames.length === 1) {
        const csv = XLSX.utils.sheet_to_csv(workbook.Sheets[workbook.SheetNames[0]]);
        return new Blob([csv], { type: 'text/csv' });
    }
    const zip = new JSZip();
    workbook.SheetNames.forEach((sheetName: string) => {
        const csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
        zip.file(`${sheetName}.csv`, csv);
    });
    return zip.generateAsync({ type: 'blob' });
};

// CSV to JSON
const convertCsvToJson = async (file: File): Promise<Blob> => {
    const text = await readFileAsText(file);
    const worksheet = XLSX.read(text, { type: 'string' }).Sheets['Sheet1'];
    const json = XLSX.utils.sheet_to_json(worksheet);
    return new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
};

// XML to JSON Helper
const xmlToJson = (xml: Node): any => {
    let obj: any = {};
    if (xml.nodeType === 1 && (xml as Element).attributes.length > 0) {
        obj["@attributes"] = {};
        for (let j = 0; j < (xml as Element).attributes.length; j++) {
            const attribute = (xml as Element).attributes.item(j)!;
            obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
        }
    }
    if (xml.nodeType === 3) {
        obj = xml.nodeValue;
    }
    if (xml.hasChildNodes()) {
        for (let i = 0; i < xml.childNodes.length; i++) {
            const item = xml.childNodes.item(i);
            const nodeName = item.nodeName;
            if (typeof obj[nodeName] === "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (typeof obj[nodeName].push === "undefined") {
                    const old = obj[nodeName];
                    obj[nodeName] = [old];
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    }
    return obj;
};

// XML to JSON
const convertXmlToJson = async (file: File): Promise<Blob> => {
    const text = await readFileAsText(file);
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "application/xml");
    const json = xmlToJson(xmlDoc);
    // The top level is often document, we want the root element
    const rootKey = Object.keys(json)[0];
    const finalJson = json[rootKey];
    return new Blob([JSON.stringify(finalJson, null, 2)], { type: 'application/json' });
};

// Excel to XML
const convertExcelToXml = async (file: File): Promise<Blob> => {
    const buffer = await readFileAsArrayBuffer(file);
    const workbook = XLSX.read(buffer, { type: 'array' });
    const json = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    const xml = jsonToXml({ item: json });
    return new Blob([xml], { type: 'application/xml' });
};

// CSV to XML
const convertCsvToXml = async (file: File): Promise<Blob> => {
    const text = await readFileAsText(file);
    const worksheet = XLSX.read(text, { type: 'string' }).Sheets['Sheet1'];
    const json = XLSX.utils.sheet_to_json(worksheet);
    const xml = jsonToXml({ item: json });
    return new Blob([xml], { type: 'application/xml' });
};


// --- EXPORTED COMPONENTS ---

export const ExcelToPdf: React.FC = () => <FileConverter title="Excel to PDF" onConvert={convertExcelToPdf} acceptedFileTypes=".xlsx" outputExtension="pdf" />;
export const CsvToExcel: React.FC = () => <FileConverter title="CSV to Excel" onConvert={convertCsvToExcel} acceptedFileTypes=".csv" outputExtension="xlsx" />;
export const SplitExcel: React.FC = () => <FileConverter title="Split Excel by Sheet" onConvert={splitExcel} acceptedFileTypes=".xlsx" outputExtension="zip" />;
export const XmlToExcel: React.FC = () => <FileConverter title="XML to Excel" onConvert={convertXmlToExcel} acceptedFileTypes=".xml" outputExtension="xlsx" />;
export const JsonToXml: React.FC = () => <FileConverter title="JSON to XML" onConvert={convertJsonToXml} acceptedFileTypes=".json" outputExtension="xml" />;
export const XmlToCsv: React.FC = () => <FileConverter title="XML to CSV" onConvert={convertXmlToCsv} acceptedFileTypes=".xml" outputExtension="csv" />;
export const ExcelToCsv: React.FC = () => <FileConverter title="Excel to CSV" onConvert={convertExcelToCsv} acceptedFileTypes=".xlsx" outputExtension="zip" />;
export const CsvToJson: React.FC = () => <FileConverter title="CSV to JSON" onConvert={convertCsvToJson} acceptedFileTypes=".csv" outputExtension="json" />;
export const XmlToJson: React.FC = () => <FileConverter title="XML to JSON" onConvert={convertXmlToJson} acceptedFileTypes=".xml" outputExtension="json" />;
export const ExcelToXml: React.FC = () => <FileConverter title="Excel to XML" onConvert={convertExcelToXml} acceptedFileTypes=".xlsx" outputExtension="xml" />;
export const CsvToXml: React.FC = () => <FileConverter title="CSV to XML" onConvert={convertCsvToXml} acceptedFileTypes=".csv" outputExtension="xml" />;

export const SplitCsv: React.FC = () => {
    const [options, setOptions] = useState({ rows: 1000 });
    return <FileConverter 
        title="Split CSV" 
        onConvert={(file) => splitCsv(file, options)} 
        acceptedFileTypes=".csv" 
        outputExtension="zip" 
        optionsComponent={<SplitCsvOptions setOptions={setOptions} />}
    />;
};