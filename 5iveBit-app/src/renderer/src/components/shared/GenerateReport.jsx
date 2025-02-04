import { marked } from 'marked';
import html2pdf from 'html2pdf.js';
import ReactDOMServer from 'react-dom/server';

const generateReport = async (content) => {
  try {

    // Configure marked options to properly handle tables and other formatting
    marked.setOptions({
      breaks: true,
      gfm: true,
      tables: true,
      headerIds: false
    });

    // Process the content through marked first
    const htmlContent = marked(content);

    // Process severity labels and maintain other formatting
    const processedContent = htmlContent
      .replace(/Critical:?\s/g, '<span style="color: #dc3545; font-weight: bold; padding: 2px 6px; border-radius: 4px; background-color: rgba(220, 53, 69, 0.1);">Critical: </span>')
      .replace(/High:?\s/g, '<span style="color: #fd7e14; font-weight: bold; padding: 2px 6px; border-radius: 4px; background-color: rgba(253, 126, 20, 0.1);">High: </span>')
      .replace(/Medium:?\s/g, '<span style="color: #ffc107; font-weight: bold; padding: 2px 6px; border-radius: 4px; background-color: rgba(255, 193, 7, 0.1);">Medium: </span>')
      .replace(/Low:?\s/g, '<span style="color: #28a745; font-weight: bold; padding: 2px 6px; border-radius: 4px; background-color: rgba(40, 167, 69, 0.1);">Low: </span>')
      //links will appear clickable
      .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" style="color: #9b15ed; text-decoration: underline;">$1</a>');

    // PDF report component
    const reportElement = (
      <div style={{
        padding: '40px',
        maxWidth: '800px',
        margin: '0 auto',
        fontFamily: 'sans-serif',
        color: '#000000'
      }}>

        <style>{`
          /* Table styles */
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 16px 0;
          }
          th {
            background-color: #e9d6ff;
            border: 1px solid #0d0117;
            padding: 12px;
            text-align: left;
          }
          td {
            background-color: #faf7fe;
            border: 1px solid #0d0117;
            padding: 12px;
          }

            /* Code Block Styling */
          pre {
            background-color:rgb(157, 158, 161) !important;
            color: #000000 !important;
            padding: 12px !important;
            border-radius: 6px !important;
            font-family: 'Courier New', monospace !important;
            font-size: 12px !important;
            white-space: pre-wrap !important;
            overflow-x: auto !important;
          }

          /* Inline Code Styling */
          code {
            background-color:rgb(157, 158, 161) !important;
            color: #000000 !important;
            padding: 3px 6px !important;
            border-radius: 4px !important;
            font-family: 'Courier New', monospace !important;
            font-size: 12px !important;
          }

          /* Strong and emphasis styles */
          strong { 
            font-weight: bold !important; 
          }
          em { 
            font-style: italic !important; 
          }

          /* Headers */
          h1, h2, h3, h4, h5, h6 {
            color: #9b15ed !important;
            margin-top: 1.5em !important;
            margin-bottom: 0.5em !important;
            font-weight: 600 !important;
          }

           /* Move header up */
          .header-container {
            margin-bottom: 1px !important; 
            padding-bottom: 0px !important;
          }

          /* Logo styling */
          .logo {
            height: 35px !important;
          }

        `}</style>

        {/* Header */}
        <div className="header-container" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '5px' 
        }}>
            
         {/*import 5iveBit logo*/}
          <img 
            src="/src/assets/5iveBitLogo.png"
            alt="5iveBit Logo" 
            style={{ height: '40px' }}
          />
          <div>

            <h1 style={{ 
              margin: '0', 
              fontSize: '22px',  
              fontWeight: 'bold', 
              color: '#9b15ed' 
            }}>
              5iveBot Security Report
            </h1>
            <p style={{ fontSize: '14px', opacity: 0.9 }}>
              Generated on {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderBottom: '2px solid #9b15ed', margin: '10px 0 20px 0', width: '100%' }} />

        {/* Content with formatting preserved */}
        <div 
          style={{ fontSize: '12px', lineHeight: 1.6, marginTop: '10px' }}
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />

        {/* Footer */}
        <div style={{
          marginTop: '10px',
          paddingTop: '12px',
          borderTop: '2px solid #9b15ed',
          textAlign: 'center',
          color: '#666',
          fontSize: '9px'
        }}>
          <div>© 5iveBit {new Date().getFullYear()} | Generated by 5iveBot</div>
        </div>
      </div>
    );

    // Convert React components to HTML string
    const element = document.createElement('div');
    element.innerHTML = ReactDOMServer.renderToString(reportElement);

    // PDF options
    const pdfOptions = {
      margin: [20, 20, 20, 20],
      filename: `5iveBot_Security_Report_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'png', quality: 1.0 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        backgroundColor: '#ffffff'
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    await html2pdf().from(element).set(pdfOptions).save();
    console.log('PDF Successfully Created!');
    
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};

export default generateReport;