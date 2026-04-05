/**
 * Ticket Service
 * Handles ticket generation, formatting, and printing
 */

import { TICKET_TYPES } from '@/constants/ticketTypes'
import QRCode from 'qrcode'

/**
 * Format a price that is ALREADY in DA (no conversion needed).
 * The POS stores all prices in Algerian Dinars natively.
 */
const formatDA = (amount) => {
  if (!amount || isNaN(amount)) return '0 DA'
  return new Intl.NumberFormat('fr-DZ', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    useGrouping: true,
  }).format(amount) + ' DA'
}

/**
 * Generate ticket HTML for printing
 * @param {string} ticketType - Type of ticket (receipt, invoice, label, refund)
 * @param {object} data - Transaction data
 * @returns {string} HTML content for printing
 */
export const generateTicketHTML = (ticketType = 'receipt', data = {}) => {
  const type = TICKET_TYPES[ticketType.toUpperCase()] || TICKET_TYPES.RECEIPT

  // Generate unique receipt ID
  const receiptId = data.receiptId || `RCP-${Date.now()}`
  const timestamp = data.timestamp || new Date().toLocaleString()

  // Generate HTML based on ticket type
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${type.header}</title>
      <style>
        * { margin: 0; padding: 0; }
        body {
          font-family: 'Courier New', monospace;
          background: white;
          color: #000;
          width: ${type.paperWidth}mm;
          padding: 10mm;
        }
        .ticket {
          text-align: center;
          min-height: 100mm;
          display: flex;
          flex-direction: column;
        }
        .header {
          border-bottom: 2px dashed #000;
          padding-bottom: 8px;
          margin-bottom: 8px;
        }
        .shop-name {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 2px;
        }
        .shop-info {
          font-size: 10px;
          color: #333;
        }
        .ticket-title {
          font-size: 13px;
          font-weight: bold;
          margin: 8px 0;
        }
        .receipt-id {
          font-size: 10px;
          margin-bottom: 8px;
        }
        .timestamp {
          font-size: 9px;
          margin-bottom: 8px;
          color: #555;
        }
        .items-section {
          text-align: left;
          margin: 8px 0;
          border-top: 1px dashed #000;
          border-bottom: 1px dashed #000;
          padding: 8px 0;
        }
        .item-header {
          display: flex;
          justify-content: space-between;
          font-size: 10px;
          font-weight: bold;
          margin-bottom: 4px;
          border-bottom: 1px solid #000;
          padding-bottom: 2px;
        }
        .item-row {
          display: flex;
          justify-content: space-between;
          font-size: 10px;
          margin-bottom: 2px;
          word-wrap: break-word;
        }
        .item-name {
          flex: 1;
          text-align: left;
        }
        .item-qty {
          text-align: center;
          width: 30px;
        }
        .item-price {
          text-align: right;
          width: 50px;
        }
        .totals {
          text-align: right;
          margin: 8px 0;
          font-size: 10px;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 2px;
        }
        .total-label {
          flex: 1;
        }
        .total-value {
          width: 50px;
          text-align: right;
        }
        .grand-total {
          font-size: 12px;
          font-weight: bold;
          border-top: 2px solid #000;
          border-bottom: 2px solid #000;
          padding: 4px 0;
          margin: 4px 0;
        }
        .payment-method {
          text-align: center;
          font-size: 10px;
          margin: 8px 0;
        }
        .footer {
          text-align: center;
          font-size: 9px;
          margin-top: 8px;
          border-top: 2px dashed #000;
          padding-top: 8px;
          color: #555;
        }
        .page-break {
          page-break-after: always;
        }
      </style>
    </head>
    <body>
  `

  // Print multiple copies if needed
  for (let copy = 0; copy < type.copies; copy++) {
    if (copy > 0) html += '<div class="page-break"></div>'

    html += `
      <div class="ticket">
        <div class="header">
          <div class="shop-name">${data.shopName || 'PerfumierPro'}</div>
          ${
            data.shopPhone
              ? `<div class="shop-info">📞 ${data.shopPhone}</div>`
              : ''
          }
          ${
            data.shopAddress
              ? `<div class="shop-info">📍 ${data.shopAddress}</div>`
              : ''
          }
        </div>

        <div class="ticket-title">${type.header}</div>
        <div class="receipt-id">Receipt #: ${receiptId}</div>
        <div class="timestamp">${timestamp}</div>
    `

    // Items section
    if (type.showItems && data.items && data.items.length > 0) {
      html += `
        <div class="items-section">
          <div class="item-header">
            <div class="item-name">Product</div>
            <div class="item-qty">Qty</div>
            <div class="item-price">Price</div>
          </div>
      `

      data.items.forEach((item) => {
        const itemTotal = item.price * item.quantity
        const sizeLabel = item.size ? ` (${item.size}ml)` : ''
        html += `
          <div class="item-row">
            <div class="item-name">${item.name}${sizeLabel}</div>
            <div class="item-qty">${item.quantity}</div>
            <div class="item-price">${formatDA(itemTotal)}</div>
          </div>
        `
      })

      html += '</div>'
    }

    // Totals section
    if (type.showTotals && (data.subtotal || data.total)) {
      html += `
        <div class="totals">
          ${
            data.subtotal
              ? `<div class="total-row">
                  <div class="total-label">Sous-total:</div>
                  <div class="total-value">${formatDA(data.subtotal)}</div>
                </div>`
              : ''
          }
          ${
            data.tax
              ? `<div class="total-row">
                  <div class="total-label">Taxe:</div>
                  <div class="total-value">${formatDA(data.tax)}</div>
                </div>`
              : ''
          }
          ${data.loyaltyDiscount > 0 ? `<div class="total-row">
            <div class="total-label">Remise fidélité:</div>
            <div class="total-value">-${formatDA(data.loyaltyDiscount)}</div>
          </div>` : ''}
          <div class="total-row grand-total">
            <div class="total-label">TOTAL:</div>
            <div class="total-value">${formatDA(data.total || data.subtotal || 0)}</div>
          </div>
        </div>
      `
    }

    // Payment method
    if (type.showPaymentMethod && data.paymentMethod) {
      html += `
        <div class="payment-method">
          💳 Payment: ${data.paymentMethod.toUpperCase()}
        </div>
      `
    }

    // QR Code Scent History
    let qrHtml = ''
    if (data.qrImageStr) {
      qrHtml = `
        <div style="margin-top: 15px; text-align: center;">
          <p style="font-size: 0.75rem; margin-bottom: 5px;"><strong>Historique Parfums</strong></p>
          <img src="${data.qrImageStr}" alt="QR Scent History" style="max-width: 120px;" />
          <p style="font-size: 0.65rem; color: #555;">Scannez pour voir l'historique et les notes de vos achats</p>
        </div>
      `
    }

    html += `
        ${qrHtml}
        <div class="footer">
          Merci pour votre achat !
          <br>
          ${data.shopName || 'PerfumierPro'}
        </div>
      </div>
    `
  }

  html += `
    </body>
    </html>
  `

  return html
}

/**
 * Print ticket
 * Opens print dialog with formatted ticket
 * @param {string} ticketType - Type of ticket
 * @param {object} data - Transaction data
 */
export const printTicket = async (ticketType = 'receipt', data = {}) => {
  // Generate QR Code async if there are items
  if (data.items && data.items.length > 0) {
    try {
      const minimalItems = data.items.map(i => ({ c: i.id || 0, n: encodeURIComponent(i.name), s: i.size || 0, q: i.quantity || 1 }));
      const payload = btoa(JSON.stringify(minimalItems));
      // In production, this links to your actual hosted URL
      const qrUrl = "https://meh00-smkmk.github.io/ParfumHistory/#/history?data=" + payload;
      data.qrImageStr = await QRCode.toDataURL(qrUrl, { margin: 1, width: 130 });
    } catch (e) {
      console.error("QR Code Error:", e);
    }
  }

  const html = generateTicketHTML(ticketType, data)

  // Create iframe for printing
  const printWindow = window.open('', '', 'height=600,width=800')
  printWindow.document.write(html)
  printWindow.document.close()

  // Trigger print dialog
  printWindow.focus()
  setTimeout(() => {
    printWindow.print()
    // Don't close window automatically - let user decide
    // printWindow.close()
  }, 150)
}

/**
 * Download ticket as HTML file
 * Useful for archiving or emailing receipts
 * @param {string} ticketType - Type of ticket
 * @param {object} data - Transaction data
 * @param {string} filename - Output filename
 */
export const downloadTicket = (ticketType = 'receipt', data = {}, filename = 'ticket.html') => {
  const html = generateTicketHTML(ticketType, data)
  const element = document.createElement('a')
  element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(html))
  element.setAttribute('download', filename)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

export default {
  generateTicketHTML,
  printTicket,
  downloadTicket,
}
