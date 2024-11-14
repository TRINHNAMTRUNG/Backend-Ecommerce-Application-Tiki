require("dotenv").config();
const axios = require("axios");
const { formatResBodyFailed, formatResBodySuscess } = require("./fomatResponse");

const infobipApiKey = process.env.INFOBIP_API_KEY;
const infobipBaseUrl = process.env.INFOBIP_BASE_URL;
const infobipApplicationId = process.env.INFOBIP_APPLICATION_ID;

const createTemplateMessage = async () => {
    if (!infobipApiKey || !infobipBaseUrl || !infobipApplicationId) {
        console.error("API Key, Base URL, hoặc Application ID không được cung cấp.");
        return;
    }

    try {
        const response = await axios.post(
            `${infobipBaseUrl}/2fa/2/applications/${infobipApplicationId}/messages`,
            {
                language: "en",
                messageText: "Your verification code is {{pin}}",
                pinLength: 6,
                pinType: "NUMERIC",
                senderId: "ServiceSMS",
                speechRate: 1,
                voiceName: "Joanna",
            },
            {
                headers: {
                    Authorization: `App ${infobipApiKey}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        );
        return response.data; // Trả về `data` thay vì toàn bộ `response`
    } catch (error) {
        console.error(">>>>> Error creating SMS template: ", error.response?.data || error.message);
    }
}


const sendOtpCtrl = async (req, res) => {
    const { phoneNumber } = req.body;
    try {
        // const template = await createTemplateMessage();
        // console.log("template: ", template);
        const response = await axios.post(
            `https://pe2w83.api.infobip.com/2fa/2/pin?ncNeeded=false`,
            {
                applicationId: infobipApplicationId,
                to: phoneNumber,
                from: "ServiceSMS",
                messageId: "01A593779D2514426F79686EB0B640EB",
            },
            {
                headers: {
                    Authorization: `App ${infobipApiKey}`,
                    "Content-Type": "application/json"
                }
            }
        );
        console.log("otp: ", response.pinId);
        return res.status(200).json(formatResBodySuscess(true, "OTP sent successfully", response.data));
    } catch (error) {
        console.log(error.response.data);
        return res.status(500).json(formatResBodyFailed(false, "OTP send failed", error.message));
    }
}

const verifyOtpCtrl = async (req, res) => {
    const { phoneNumber, pin } = req.body;
    try {
        const response = await axios.post(
            `${infobipBaseUrl}/2fa/2/pin/verify`,
            {
                applicationId: infobipApplicationId,
                to: phoneNumber,
                pin: pin,
            },
            {
                headers: {
                    Authorization: `App ${infobipApiKey}`,
                    "Content-Type": "application/json"
                }
            }
        );

        if (response.data.verified) {
            return res.status(200).json(formatResBodySuscess(true, "OTP verified"));
        } else {
            return res.status(400).json(formatResBodyFailed(false, "OTP verification failed"));
        }
    } catch (error) {
        return res.status(500).json(formatResBodyFailed(false, "OTP verification error", error.message));
    }
}

module.exports = {
    sendOtpCtrl,
    verifyOtpCtrl
}
