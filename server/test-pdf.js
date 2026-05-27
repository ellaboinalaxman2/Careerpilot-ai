const fs = require("fs");
const pdfParse = require("pdf-parse");

// Test function
async function testPDF() {
  try {
    // Create a simple test PDF buffer (or use an actual PDF file)
    const dataBuffer = fs.readFileSync("uploads/test.pdf"); // Replace with actual PDF path

    const data = await pdfParse(dataBuffer);
    console.log("PDF Parse Test Successful!");
    console.log("Text length:", data.text.length);
    console.log("Number of pages:", data.numpages);
  } catch (error) {
    console.error("PDF Parse Error:", error.message);
  }
}

// Run test if you have a PDF file
// testPDF();
