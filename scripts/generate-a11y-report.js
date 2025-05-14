/**
 * Script to generate an accessibility report
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const axe = require('axe-core');
const puppeteer = require('puppeteer');

// Create the report directory
const reportDir = path.join(__dirname, '..', 'accessibility-report');
if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir, { recursive: true });
}

// URLs to test
const urls = [
  'http://localhost:3000',
  'http://localhost:3000/dashboard',
  'http://localhost:3000/onboarding',
];

// Start the development server
console.log('Starting development server...');
const server = execSync('npm run preview', { stdio: 'pipe' });

// Run the accessibility audit
async function runAccessibilityAudit() {
  console.log('Running accessibility audit...');
  
  const browser = await puppeteer.launch();
  const results = [];
  
  try {
    for (const url of urls) {
      console.log(`Testing ${url}...`);
      
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle2' });
      
      // Inject axe-core
      await page.evaluateHandle(`
        ${axe.source}
      `);
      
      // Run axe
      const result = await page.evaluate(() => {
        return new Promise(resolve => {
          axe.run(document, {
            resultTypes: ['violations', 'incomplete', 'inapplicable'],
          }, (err, results) => {
            if (err) throw err;
            resolve(results);
          });
        });
      });
      
      results.push({
        url,
        result,
      });
      
      await page.close();
    }
  } finally {
    await browser.close();
  }
  
  return results;
}

// Generate HTML report
function generateHtmlReport(results) {
  console.log('Generating HTML report...');
  
  let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Accessibility Audit Report</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        h1, h2, h3 {
          color: #2c3e50;
        }
        .url {
          background-color: #f8f9fa;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 20px;
        }
        .violation {
          background-color: #fff5f5;
          border-left: 4px solid #e53e3e;
          padding: 15px;
          margin-bottom: 15px;
          border-radius: 4px;
        }
        .incomplete {
          background-color: #fffaf0;
          border-left: 4px solid #ed8936;
          padding: 15px;
          margin-bottom: 15px;
          border-radius: 4px;
        }
        .passed {
          background-color: #f0fff4;
          border-left: 4px solid #38a169;
          padding: 15px;
          margin-bottom: 15px;
          border-radius: 4px;
        }
        .inapplicable {
          background-color: #f7fafc;
          border-left: 4px solid #a0aec0;
          padding: 15px;
          margin-bottom: 15px;
          border-radius: 4px;
        }
        .impact {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
          color: white;
        }
        .impact.critical {
          background-color: #e53e3e;
        }
        .impact.serious {
          background-color: #dd6b20;
        }
        .impact.moderate {
          background-color: #d69e2e;
        }
        .impact.minor {
          background-color: #718096;
        }
        .nodes {
          margin-top: 10px;
          padding-left: 20px;
        }
        .node {
          background-color: #f8f9fa;
          padding: 10px;
          margin-bottom: 10px;
          border-radius: 4px;
          font-family: monospace;
          white-space: pre-wrap;
          overflow-x: auto;
        }
        .summary {
          display: flex;
          justify-content: space-between;
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 4px;
          margin-bottom: 20px;
        }
        .summary-item {
          text-align: center;
        }
        .summary-count {
          font-size: 24px;
          font-weight: bold;
        }
        .summary-label {
          font-size: 14px;
          color: #718096;
        }
        .critical { color: #e53e3e; }
        .serious { color: #dd6b20; }
        .moderate { color: #d69e2e; }
        .minor { color: #718096; }
      </style>
    </head>
    <body>
      <h1>Accessibility Audit Report</h1>
      <p>Generated on ${new Date().toLocaleString()}</p>
  `;
  
  // Add summary
  let totalViolations = 0;
  let totalIncomplete = 0;
  let totalPassed = 0;
  let totalInapplicable = 0;
  
  let criticalViolations = 0;
  let seriousViolations = 0;
  let moderateViolations = 0;
  let minorViolations = 0;
  
  for (const { result } of results) {
    totalViolations += result.violations.length;
    totalIncomplete += result.incomplete.length;
    totalPassed += result.passes.length;
    totalInapplicable += result.inapplicable.length;
    
    for (const violation of result.violations) {
      if (violation.impact === 'critical') criticalViolations++;
      if (violation.impact === 'serious') seriousViolations++;
      if (violation.impact === 'moderate') moderateViolations++;
      if (violation.impact === 'minor') minorViolations++;
    }
  }
  
  html += `
    <div class="summary">
      <div class="summary-item">
        <div class="summary-count">${totalViolations}</div>
        <div class="summary-label">Violations</div>
      </div>
      <div class="summary-item">
        <div class="summary-count">${totalIncomplete}</div>
        <div class="summary-label">Incomplete</div>
      </div>
      <div class="summary-item">
        <div class="summary-count">${totalPassed}</div>
        <div class="summary-label">Passed</div>
      </div>
      <div class="summary-item">
        <div class="summary-count">${totalInapplicable}</div>
        <div class="summary-label">Inapplicable</div>
      </div>
    </div>
    
    <div class="summary">
      <div class="summary-item">
        <div class="summary-count critical">${criticalViolations}</div>
        <div class="summary-label">Critical</div>
      </div>
      <div class="summary-item">
        <div class="summary-count serious">${seriousViolations}</div>
        <div class="summary-label">Serious</div>
      </div>
      <div class="summary-item">
        <div class="summary-count moderate">${moderateViolations}</div>
        <div class="summary-label">Moderate</div>
      </div>
      <div class="summary-item">
        <div class="summary-count minor">${minorViolations}</div>
        <div class="summary-label">Minor</div>
      </div>
    </div>
  `;
  
  // Add results for each URL
  for (const { url, result } of results) {
    html += `
      <div class="url">
        <h2>${url}</h2>
        
        <h3>Violations (${result.violations.length})</h3>
    `;
    
    if (result.violations.length === 0) {
      html += `<p>No violations found!</p>`;
    } else {
      for (const violation of result.violations) {
        html += `
          <div class="violation">
            <h4>${violation.id}: ${violation.help}</h4>
            <p>${violation.description}</p>
            <p>
              <span class="impact ${violation.impact}">${violation.impact}</span>
              <a href="${violation.helpUrl}" target="_blank">Learn more</a>
            </p>
            <div class="nodes">
              ${violation.nodes.map(node => `
                <div class="node">
                  <div>${node.html}</div>
                  <div>${node.failureSummary}</div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }
    }
    
    html += `
        <h3>Incomplete (${result.incomplete.length})</h3>
    `;
    
    if (result.incomplete.length === 0) {
      html += `<p>No incomplete checks found!</p>`;
    } else {
      for (const incomplete of result.incomplete) {
        html += `
          <div class="incomplete">
            <h4>${incomplete.id}: ${incomplete.help}</h4>
            <p>${incomplete.description}</p>
            <p>
              <a href="${incomplete.helpUrl}" target="_blank">Learn more</a>
            </p>
            <div class="nodes">
              ${incomplete.nodes.map(node => `
                <div class="node">
                  <div>${node.html}</div>
                  <div>${node.failureSummary || 'Manual check required'}</div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }
    }
    
    html += `
      </div>
    `;
  }
  
  html += `
    </body>
    </html>
  `;
  
  fs.writeFileSync(path.join(reportDir, 'index.html'), html);
  console.log(`HTML report saved to ${path.join(reportDir, 'index.html')}`);
}

// Generate JSON report
function generateJsonReport(results) {
  console.log('Generating JSON report...');
  fs.writeFileSync(
    path.join(reportDir, 'report.json'),
    JSON.stringify(results, null, 2)
  );
  console.log(`JSON report saved to ${path.join(reportDir, 'report.json')}`);
}

// Main function
async function main() {
  try {
    const results = await runAccessibilityAudit();
    generateHtmlReport(results);
    generateJsonReport(results);
    console.log('Accessibility report generated successfully!');
  } catch (error) {
    console.error('Error generating accessibility report:', error);
    process.exit(1);
  } finally {
    // Kill the server
    server.kill();
  }
}

main();
