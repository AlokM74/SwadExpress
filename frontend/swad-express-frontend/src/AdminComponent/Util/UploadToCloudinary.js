const uploadPreset = "SwadExpress";
const cloudName = "asfiahcq";
const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const response = await fetch(uploadUrl, {
    method: "POST",
    body: formData,
  });
  const result = await response.json();

  if (!response.ok || !result.secure_url) {
    throw new Error(
      result.error?.message || "Image upload failed. Please try again.",
    );
  }

  return result.secure_url;
};
