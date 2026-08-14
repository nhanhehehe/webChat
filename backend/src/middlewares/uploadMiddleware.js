import multer from "multer"
import {v2 as cloudinary} from "cloudinary"

// tạo instance của multer gồm 2 cấu hình chính: +
export const upload = multer({
    // lưu file dưới dạng dữ liệu thô trong bộ nhớ ram thay vì disk giúp gửi file tới cloudinary nhanh hơn
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024 * 1, // 1MB = 1024kb * 1024byte * 1
    }
})

// xử lý gửi ảnh đã nhận lên cloudinary
// trong js buffer là kiểu dữ dùng để mô tả một khối dữ liệu thô giống như một mảng các byte
export const uploadImageFromBuffer = (buffer, options) => {
    return new Promise((resolve, reject) => {
        // uploadStream giúp đẩy buffer ảnh lên trực tiếp cloudinary
        const uploadStream = cloudinary.uploader.upload_stream({
            folder: "moji_chat/avatars",
            resource_type: "image",
            transformation: [{width:200, height: 200, crop: "fill"}],
            ...options
            // -> transform giúp cho ảnh luônn cố định về mặt consistency 
            // spread options những options nếu có trước đó
        }, 
        (error, result) => {
            if (error) {
                reject(error);
            } else {
                // result chứa url và id của hình
                resolve(result)
            }
        }
    );
        // lấy ra buffer của ảnh và kết thúc stream
        uploadStream.end(buffer);
    }) 
}