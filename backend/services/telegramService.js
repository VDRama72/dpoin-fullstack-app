// ✅ FILE: backend/services/telegramService.js

const axios = require('axios');
require('dotenv').config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

const sendTelegramMessage = async (chatId, message) => {
    try {
        const response = await axios.post(TELEGRAM_API_URL, {
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML' // Mengaktifkan format HTML di pesan
        });
        console.log("✅ Pesan Telegram berhasil dikirim.");
        return response.data;
    } catch (error) {
        console.error("Gagal mengirim pesan Telegram:", error.response?.data || error.message);
        throw new Error("Gagal mengirim notifikasi Telegram.");
    }
};

module.exports = { sendTelegramMessage };