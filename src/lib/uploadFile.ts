import axiosInstance from "./axiosInstance";

export const uploadFiles = async (files: FileList | File[]): Promise<string[]> => {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append("files", files[i]);
  }

  try {
    const response = await axiosInstance.post<{ data: string[] }>("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error uploading files:", error);
    throw error;
  }
};
