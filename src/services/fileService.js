const path = require("path");
const axios = require('axios');
const uploadSingleFile = async (fileObject) => {
    let uploadPath = path.resolve(__dirname, "../public/Assets/upload");
    let extName = path.extname(fileObject.name);
    let baseName = path.basename(fileObject.name, extName);
    let finalName = `${baseName}-${Date.now()}${extName}`;
    let finalPath = `${uploadPath}/${finalName}`;
    // Use the mv() method to place the file somewhere on your server
    try {
        await fileObject.mv(finalPath);
        return {
            status: "Success",
            path: finalName,
            error: null
        }
    } catch (error) {
        return {
            status: "Failed",
            path: null,
            error: JSON.stringify(error)
        }
    }
}
const uploadMultipleFiles = async (filesArray) => {
    let uploadPath = path.resolve(__dirname, "../public/Assets/upload");
    let resultsArray = [];
    let countSuccess = 0;
    try {
        for (const fileObject of filesArray) {
            let extName = path.extname(fileObject.name);
            let baseName = path.basename(fileObject.name, extName);
            let finalName = `${baseName}-${Date.now()}${extName}`;
            let finalPath = `${uploadPath}/${finalName}`;

            try {
                await fileObject.mv(finalPath);
                resultsArray.push({
                    status: "Success",
                    path: finalName,
                    fileName: fileObject.name,
                    error: null
                });
                countSuccess++;
            } catch (error) {
                resultsArray.push({
                    status: "Failed",
                    path: null,
                    fileName: fileObject.name,
                    error: JSON.stringify(error)
                });
            }
        }
        return {
            countSuccess: countSuccess,
            detail: resultsArray
        }
    } catch (error) {
        console.log(error)
    }
}

const uploadFileImgBB = async (file) => {
    try {
        const imageBuffer = file.data.toString('base64'); // Chuyển đổi file thành base64

        const response = await axios.post('https://api.imgbb.com/1/upload', null, {
            params: {
                key: '622ebfb6cdd2b61f04414a77c5ded468', // Thay bằng API key của bạn
                image: imageBuffer,
            },
        });

        if (response.data && response.data.success) {
            console.log('Image URL:', response.data.data.url);
            return response.data.data.url; // URL ảnh đã upload
        } else {
            console.error('Failed to upload image:', response.data);
            return null;
        }
    } catch (error) {
        console.error('Error uploading image:', error);
        return null;
    }
}

module.exports = {
    uploadSingleFile,
    uploadMultipleFiles,
    uploadFileImgBB
}