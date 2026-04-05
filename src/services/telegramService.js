/**
 * Telegram Receipt Notification Service
 * Sends sale receipts via Telegram Bot API
 * 
 * Configuration:
 *   VITE_TELEGRAM_BOT_TOKEN - Bot token from @BotFather
 *   VITE_TELEGRAM_CHAT_ID - Chat/Group ID to send notifications to
 * 
 * Rules:
 *   - Async (non-blocking) — never delays checkout
 *   - If fails → log error only, never throw
 */

const getTelegramConfig = () => {
  // Try env vars first, then localStorage settings
  const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || localStorage.getItem('telegramBotToken') || '';
  const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID || localStorage.getItem('telegramChatId') || '';
  return { botToken, chatId };
};

/**
 * Save Telegram config to localStorage (from Settings page)
 */
export const saveTelegramConfig = (botToken, chatId) => {
  localStorage.setItem('telegramBotToken', botToken);
  localStorage.setItem('telegramChatId', chatId);
};

/**
 * Get current Telegram config
 */
export const getTelegramSettings = () => {
  return {
    botToken: localStorage.getItem('telegramBotToken') || '',
    chatId: localStorage.getItem('telegramChatId') || '',
  };
};

/**
 * Format receipt into Telegram message
 */
const formatReceiptMessage = (receipt) => {
  const date = receipt.timestamp || new Date().toLocaleString('fr-FR');
  
  let itemsText = '';
  if (receipt.items && receipt.items.length > 0) {
    itemsText = receipt.items.map(item => {
      const size = item.size ? `${item.size}ml` : '';
      const qty = item.quantity > 1 ? ` x${item.quantity}` : '';
      return `- ${item.name} | ${size}${qty} | ${item.price} DA`;
    }).join('\n');
  }

  const loyaltyLine = receipt.loyaltyDiscount > 0 
    ? `\n🎁 Remise fidélité: -${receipt.loyaltyDiscount} DA` 
    : '';

  const customerLine = receipt.customerPhone && receipt.customerPhone !== 'N/A'
    ? `\n👤 Client: ${receipt.customerPhone}`
    : '';

  return `🧾 Nouvelle vente
📅 Date: ${date}
🔖 Reçu: ${receipt.receiptId || 'N/A'}
${customerLine}
📦 Produits:
${itemsText}
${loyaltyLine}
💰 Total: ${receipt.total} DA`;
};

/**
 * Send receipt notification to Telegram
 * ASYNC — non-blocking, fire-and-forget
 * If it fails, it only logs the error
 */
export const sendTelegramReceipt = async (receipt) => {
  try {
    const { botToken, chatId } = getTelegramConfig();
    
    if (!botToken || !chatId) {
      console.log('📱 Telegram not configured — skipping notification');
      return { sent: false, reason: 'not_configured' };
    }

    const message = formatReceiptMessage(receipt);
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    });

    if (response.ok) {
      console.log('📱 Telegram notification sent successfully');
      return { sent: true };
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.error('📱 Telegram notification failed:', errorData);
      return { sent: false, reason: 'api_error', error: errorData };
    }
  } catch (error) {
    // Never throw — just log
    console.error('📱 Telegram notification error (non-blocking):', error.message);
    return { sent: false, reason: 'network_error', error: error.message };
  }
};

export const sendTelegramStockAlert = async (product, remainingStock) => {
  try {
    const { botToken, chatId } = getTelegramConfig();
    if (!botToken || !chatId) return { sent: false, reason: 'not_configured' };

    const status = remainingStock <= 0 ? '🔴 RUPTURE DE STOCK' : '⚠️ STOCK CRITIQUE';
    const message = `🚨 Alerte Inventaire\n\n${status}\n📦 Produit: ${product.name}\n🏷️ Catégorie: ${product.category}\n📉 Reste en stock: ${remainingStock} unités`;

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message }),
    });

    if (response.ok) {
      console.log('📱 Telegram stock alert sent');
      return { sent: true };
    } else {
      return { sent: false, reason: 'api_error' };
    }
  } catch (error) {
    console.error('📱 Telegram stock alert error:', error.message);
    return { sent: false, reason: 'network_error' };
  }
};

export default { sendTelegramReceipt, sendTelegramStockAlert, saveTelegramConfig, getTelegramSettings };
