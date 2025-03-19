"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const functions = require('firebase-functions');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors')({ origin: true });
// 創建 checkout session
exports.createCheckoutSession = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        if (req.method !== 'POST') {
            res.status(405).send('Method Not Allowed');
            return;
        }
        try {
            const { name, price, description, image } = req.body.data;
            const appUrl = 'https://claire-cms.web.app';
            // const appUrl = 'http://localhost:5173'
            const session = await stripe.checkout.sessions.create({
                ui_mode: 'embedded',
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: 'aud',
                            product_data: {
                                name,
                                description: description || '',
                                images: image ? [image] : [],
                            },
                            unit_amount: Math.round(Number(price) * 100),
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                return_url: `${appUrl}/return?session_id={CHECKOUT_SESSION_ID}`,
            });
            res.json({ data: { clientSecret: session.client_secret } });
        }
        catch (error) {
            console.error('Error creating checkout session:', error);
            res.status(500).json({
                data: {
                    error: error.message
                }
            });
        }
    });
});
// 獲取 session 狀態
exports.sessionStatus = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        var _a;
        if (req.method !== 'POST') {
            res.status(405).send('Method Not Allowed');
            return;
        }
        try {
            const sessionId = req.body.data.sessionId;
            const session = await stripe.checkout.sessions.retrieve(sessionId);
            res.json({
                data: {
                    status: session.status,
                    customer_email: (_a = session.customer_details) === null || _a === void 0 ? void 0 : _a.email
                }
            });
        }
        catch (error) {
            console.error('Error retrieving session:', error);
            res.status(500).json({
                data: {
                    error: error.message
                }
            });
        }
    });
});
//# sourceMappingURL=index.js.map